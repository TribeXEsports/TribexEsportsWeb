import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const allowedFields = [
      "siteName",
      "siteSubtitle",
      "heroBackgroundUrl",
      "heroVideoUrl",
      "heroTitle",
      "heroSubtitle",
      "heroTagline",
      "heroCtaText",
      "heroCtaTextGuest",
      "heroBadgeText",
      "footerDescription",
      "logoUrl",
      "whatsappUrl",
      "discordUrl",
      "twitterUrl",
      "instagramUrl",
      "youtubeUrl",
      "githubUrl",
      "logoItalic",
      "heroItalic",
      "headingsItalic",
      "tagsItalic",
      "navbarItalic",
      "dashboardBtnItalic",
      "phasesTitle",
      "phasesSubtitle",
      "arenaTitle",
      "arenaSubtitle",
      "faqTitle",
      "faqSubtitle",
      "heroVideoBrightness",
      "heroOverlayOpacity",
      "totalPrizeMoney",
      "totalRegisteredTeamsBase",
      "freefireApiUrl",
      "activeGateway",
      "razorpayKeyId",
      "razorpayKeySecret",
      "cashfreeAppId",
      "cashfreeSecretKey",
      "cashfreeEnv",
      "phonepeMerchantId",
      "phonepeSaltKey",
      "phonepeSaltIndex",
      "phonepeEnv",
      "heroOverlayColor",
      "heroVideoGrayscale",
      "cloudinaryCloudName",
      "cloudinaryUploadPreset",
      "gameCardHeight",
      "gameCardSpeed",
      "freefireApiEnabled",
      "contactEmail",
      "contactPhone",
      "contactAddress",
      "aboutStatTournaments",
      "aboutStatPlayers",
      "aboutStatPrize",
      "aboutStatGames",
    ];



    const data: Record<string, any> = {};
    for (const field of allowedFields) {
      if (field in body) data[field] = body[field];
    }

    const settings = await prisma.siteSettings.findFirst();

    if (settings) {
      const updated = await prisma.siteSettings.update({
        where: { id: settings.id },
        data,
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.siteSettings.create({ data });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
