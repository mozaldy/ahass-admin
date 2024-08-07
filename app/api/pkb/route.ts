import { NextRequest, NextResponse } from "next/server";
import { getpkbById } from "@/data/pkb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const no_pkb = searchParams.get("no_pkb") || "";

  try {
    console.log("No Pkb", no_pkb);
    const pkb = await getpkbById(no_pkb);
    console.log("Pkb", pkb);
    return NextResponse.json(pkb);
  } catch (error) {
    console.error("API: Error fetching kendaraan:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
