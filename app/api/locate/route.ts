import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    let clientIp = (forwarded ? forwarded.split(",")[0].trim() : realIp) || "";

    const isPrivateOrLocal =
      !clientIp ||
      clientIp === "127.0.0.1" ||
      clientIp === "::1" ||
      clientIp.startsWith("192.168.") ||
      clientIp.startsWith("10.") ||
      clientIp.startsWith("172.16.");

    const providers = [
      async () => {
        const url = isPrivateOrLocal ? "https://ipwho.is/" : `https://ipwho.is/${clientIp}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) return null;
        const d = await res.json();
        if (d.success !== false && d.latitude && d.longitude) {
          return {
            latitude: Number(d.latitude),
            longitude: Number(d.longitude),
            city: d.city || d.region || "Regional Zone",
            country: d.country || "",
          };
        }
        return null;
      },
      async () => {
        const url = isPrivateOrLocal
          ? "https://freeipapi.com/api/json"
          : `https://freeipapi.com/api/json/${clientIp}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) return null;
        const d = await res.json();
        if (d.latitude && d.longitude) {
          return {
            latitude: Number(d.latitude),
            longitude: Number(d.longitude),
            city: d.cityName || d.regionName || "Regional Zone",
            country: d.countryName || "",
          };
        }
        return null;
      },
      async () => {
        const url = isPrivateOrLocal
          ? "https://ipapi.co/json/"
          : `https://ipapi.co/${clientIp}/json/`;
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) return null;
        const d = await res.json();
        if (d.latitude && d.longitude) {
          return {
            latitude: Number(d.latitude),
            longitude: Number(d.longitude),
            city: d.city || d.region || "Regional Zone",
            country: d.country_name || "",
          };
        }
        return null;
      },
    ];

    for (const provider of providers) {
      try {
        const result = await provider();
        if (result) {
          return NextResponse.json({
            success: true,
            latitude: result.latitude,
            longitude: result.longitude,
            city: result.city,
            country: result.country,
            label: result.country ? `${result.city}, ${result.country}` : result.city,
          });
        }
      } catch (err) {
        // Try next provider
      }
    }

    // Default fallback if all fail
    return NextResponse.json({
      success: true,
      latitude: 31.5204,
      longitude: 74.3587,
      city: "Punjab Farm Belt",
      country: "Pakistan",
      label: "Punjab Farm Belt",
      isFallback: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to detect IP location" },
      { status: 500 }
    );
  }
}
