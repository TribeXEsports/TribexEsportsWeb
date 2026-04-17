import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const region = searchParams.get("region") || "IND";

    if (!uid || uid.trim() === "") {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Read the base URL from admin-controlled settings
    const settings = await prisma.siteSettings.findFirst({
      select: { freefireApiUrl: true },
    });
    const API_BASE_URL =
      settings?.freefireApiUrl?.trim() || "https://tribexapi.vercel.app";

    const url = `${API_BASE_URL}/info?uid=${uid.trim()}&region=${region}`;

    // Abort after 12 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      if (fetchErr.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timed out. The Free Fire API did not respond." },
          { status: 504 }
        );
      }
      throw fetchErr;
    }
    clearTimeout(timeout);

    // Safely parse the response body
    const rawText = await response.text();
    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: `Unexpected response from Free Fire API (status ${response.status})` },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const msg =
        data?.error ||
        data?.message ||
        "Player not found. Check the UID and region.";
      return NextResponse.json({ error: msg }, { status: response.status });
    }

    const filteredData = {
      nickname: data.basic_info?.nickname || "Unknown",
      level: data.basic_info?.level || 0,
      guild: data.clan_info?.clanName || "No Guild",
    };

    return NextResponse.json(filteredData);
  } catch (error: any) {
    console.error("Free Fire Proxy Error:", error.message);
    return NextResponse.json(
      { error: "Internal proxy error. Please try again." },
      { status: 500 }
    );
  }
}
