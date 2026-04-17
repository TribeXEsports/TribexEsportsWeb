import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assignNextAvailableSlot } from "@/lib/tournament-logic";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");
    
    // 1. Fetch Credentials
    const settings = await prisma.siteSettings.findFirst();
    if (!settings?.cashfreeSecretKey) {
        console.error("WEBHOOK ERROR: Cashfree secret key not found in protocol settings.");
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    // 2. Signature Verification (Cashfree V3 Webhook)
    // Formula: timestamp + rawBody
    if (signature && timestamp) {
        const data = timestamp + rawBody;
        const expectedSignature = crypto
            .createHmac("sha256", settings.cashfreeSecretKey)
            .update(data)
            .digest("base64");

        if (signature !== expectedSignature) {
            console.error("WEBHOOK ERROR: Invalid signature detected.");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type;
    const orderData = payload.data?.order;
    const paymentData = payload.data?.payment;

    console.log(`[CASHFREE WEBHOOK] Event: ${eventType}, Order: ${orderData?.order_id}, Status: ${paymentData?.payment_status}`);

    if (eventType === "PAYMENT_SUCCESS_WEBHOOK" && paymentData?.payment_status === "SUCCESS") {
        const orderId = orderData.order_id;
        
        // 3. Find Registry via Transaction ID (Order ID)
        const registration = await prisma.registration.findFirst({
            where: { transactionId: orderId }
        });

        if (!registration) {
            console.error(`WEBHOOK ERROR: No registration found for Order ID: ${orderId}`);
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // 4. Update Registration Status
        await prisma.registration.update({
            where: { id: registration.id },
            data: {
                paymentStatus: "COMPLETED",
                status: "VERIFIED",
                transactionId: String(paymentData.cf_payment_id || orderId) // Store ultimate payment reference
            }
        });

        // 5. Automated Slotting Confirmation (Reliability Handshake)
        try {
            const slotData = await assignNextAvailableSlot(prisma, registration.tournamentId, registration.id);
            if (!slotData) {
                console.error(`WEBHOOK CRITICAL: Auto-Slotting returned null for registration ${registration.id}. Manual review required.`);
            } else {
                console.log(`[AUTO-SLOT_SUCCESS] ${registration.id}: Lobby ${slotData.lobby}, Slot ${slotData.slot}`);
            }
        } catch (slotError) {
            console.error(`WEBHOOK CRITICAL: Auto-Slotting crashed for registration ${registration.id}:`, slotError);
        }

        return NextResponse.json({ status: "SUCCESS" });
    }

    return NextResponse.json({ status: "ACKNOWLEDGED" });

  } catch (error: any) {
    console.error("WEBHOOK CRITICAL FAILURE:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
