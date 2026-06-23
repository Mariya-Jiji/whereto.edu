import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { error: "ids query parameter is required (e.g., ?ids=1,2,3)" },
        { status: 400 }
      );
    }

    const ids = idsParam
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (ids.length < 2) {
      return NextResponse.json(
        { error: "Please select at least 2 colleges to compare" },
        { status: 400 }
      );
    }

    if (ids.length > 3) {
      return NextResponse.json(
        { error: "You can compare at most 3 colleges at a time" },
        { status: 400 }
      );
    }

    // Deduplicate
    const uniqueIds = Array.from(new Set(ids));
    if (uniqueIds.length < 2) {
      return NextResponse.json(
        { error: "Please select at least 2 different colleges to compare" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: uniqueIds } },
      include: {
        courses: true,
        placements: { orderBy: { year: "desc" }, take: 1 },
        _count: { select: { reviews: true } },
      },
    });

    if (colleges.length < 2) {
      return NextResponse.json(
        { error: "One or more colleges not found" },
        { status: 404 }
      );
    }

    // Normalize comparison data — preserve order from request
    const ordered = uniqueIds
      .map((id) => colleges.find((c) => c.id === id))
      .filter(Boolean);

    const comparison = ordered.map((college) => ({
      id: college!.id,
      name: college!.name,
      location: college!.location,
      type: college!.type,
      establishedYear: college!.establishedYear,
      rating: college!.rating,
      feesPerYear: college!.feesPerYear,
      reviewCount: college!._count.reviews,
      coursesCount: college!.courses.length,
      courses: college!.courses,
      latestPlacement: college!.placements[0] ?? null,
    }));

    return NextResponse.json({ data: comparison });
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
