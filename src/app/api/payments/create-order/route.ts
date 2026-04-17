import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { tournamentId, amount, teamName, leaderName, players } = await req.json();
    const userId = (session.user as any).id;

    // 1. Fetch Gateway Strategy & Credentials
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) return NextResponse.json({ error: "Gateway protocol not initialized by command." }, { status: 500 });

    // Explicit Gateway Selection: Prioritize CASHFREE if keys exist, regardless of DB default
    let activeGateway = settings.activeGateway;
    if (settings.cashfreeAppId && settings.cashfreeSecretKey) {
        activeGateway = "CASHFREE";
    } else {
        activeGateway = activeGateway || "RAZORPAY";
    }

    // 2. Tournament Validation
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });
    if (!tournament) return NextResponse.json({ error: "Mission invalid." }, { status: 404 });

    // 2.5 Integrity & Pre-Registration Logic
    let teamId = null;
    if (tournament.mode !== "SOLO") {
        let team = await prisma.team.findFirst({
            where: { captainId: userId }
        });
        if (!team) {
            if (!teamName) return NextResponse.json({ error: "Team Name is required for registration." }, { status: 400 });
            team = await prisma.team.create({
                data: {
                    name: teamName,
                    captainId: userId,
                    members: { connect: { id: userId } }
                }
            });
        }
        teamId = team.id;
    }

    // Comprehensive Unique Registration Check (Prevent Multi-Payload Inconsistency)
    let registration = await prisma.registration.findFirst({
        where: { 
            tournamentId,
            OR: [
                { userId },
                { teamId: teamId || undefined },
                { captainId: userId }
            ]
        }
    });

    // Atomic Registry Key Generation
    const registrarKey = tournament.mode === "SOLO" 
        ? `${tournamentId}_${userId}` 
        : `${tournamentId}_${teamId}`;

    const registrationData = {
        tournamentId,
        userId: tournament.mode === "SOLO" ? userId : null,
        teamId,
        captainId: userId,
        status: "PENDING_APPROVAL",
        paymentStatus: "PENDING",
        rosterData: players || [],
        gatewayUsed: activeGateway,
        registryKey: registrarKey
    };

    // Atomic Upsert Handshake (Ensures strict uniqueness)
    registration = await prisma.registration.upsert({
        where: { registryKey: registrarKey },
        update: { ...registrationData, status: registration?.status || "PENDING_APPROVAL" },
        create: registrationData
    });

    // 3. Initiate Transaction
    if (activeGateway === "RAZORPAY") {
        if (!settings.razorpayKeyId || !settings.razorpayKeySecret) {
            return NextResponse.json({ error: "Razorpay protocol requires authorization keys." }, { status: 500 });
        }

        const razorpay = new Razorpay({
            key_id: settings.razorpayKeyId,
            key_secret: settings.razorpayKeySecret,
        });

        const order = await razorpay.orders.create({
            amount: Math.round(Number(amount) * 100), // In paise
            currency: "INR",
            receipt: `mission_${tournamentId}_usr_${userId}`,
            notes: { tournamentId, userId, registrationId: registration.id }
        });

        // Update registration with order_id for link verification
        await prisma.registration.update({
            where: { id: registration.id },
            data: { transactionId: order.id }
        });

        return NextResponse.json({
            gateway: "RAZORPAY",
            key: settings.razorpayKeyId,
            amount: order.amount,
            order_id: order.id,
            currency: order.currency
        });
    }

    if (activeGateway === "CASHFREE") {
        if (!settings.cashfreeAppId || !settings.cashfreeSecretKey) {
            return NextResponse.json({ error: "Cashfree protocol requires active client credentials." }, { status: 500 });
        }

        const host = settings.cashfreeEnv === "PRODUCTION" 
            ? "https://api.cashfree.com/pg/orders" 
            : "https://sandbox.cashfree.com/pg/orders";

        // Logic: Cashfree REQUIRES notify_url to be HTTPS. If on localhost, we skip it.
        const siteUrl = process.env.NEXTAUTH_URL || "";
        const isSecure = siteUrl.startsWith("https://");

        const orderBody: any = {
            order_amount: Number(amount),
            order_currency: "INR",
            customer_details: {
                customer_id: String(userId),
                customer_email: String(session.user?.email || "player@tribex.com"),
                customer_phone: "9999999999" 
            },
            order_note: `Tournament Entry: ${tournament.title}`,
            order_meta: {
                return_url: `${siteUrl}/dashboard/payment/callback?order_id={order_id}`,
                notify_url: isSecure ? `${siteUrl}/api/payments/webhook/cashfree` : undefined
            }
        };

        const cashfreeRes = await fetch(host, {
            method: "POST",
            headers: {
                "x-client-id": settings.cashfreeAppId as string,
                "x-client-secret": settings.cashfreeSecretKey as string,
                "x-api-version": "2023-08-01",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderBody)
        });

        const cashfreeData = await cashfreeRes.json();

        if (!cashfreeRes.ok) {
            console.error("CASHFREE API REJECTION:", JSON.stringify(cashfreeData, null, 2));
            return NextResponse.json({ 
                error: `Cashfree: ${cashfreeData.message || "Order rejection"}`, 
                details: cashfreeData.type || "Unknown Error"
            }, { status: 500 });
        }

        // Update registration with order_id for link verification
        await prisma.registration.update({
            where: { id: registration.id },
            data: { transactionId: cashfreeData.order_id }
        });

        return NextResponse.json({
            gateway: "CASHFREE",
            payment_session_id: cashfreeData.payment_session_id,
            order_id: cashfreeData.order_id,
            env: settings.cashfreeEnv === "PRODUCTION" ? "PROD" : "TEST"
        });
    }

    return NextResponse.json({ error: "Unsupported gateway protocol." }, { status: 500 });

    return NextResponse.json({ error: "Unsupported gateway protocol." }, { status: 500 });

  } catch (error: any) {
    console.error("CRITICAL: Payment Order Initialization Failure", error);
    return NextResponse.json({ error: "Failed to initialize monetary protocol.", details: error.message }, { status: 500 });
  }
}
