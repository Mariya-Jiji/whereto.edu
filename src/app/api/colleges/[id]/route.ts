import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    const [college, savedCount] = await Promise.all([
      prisma.college.findUnique({
        where: { id },
        include: {
          courses: { orderBy: { feesPerYear: "asc" } },
          placements: { orderBy: { year: "desc" } },
          reviews: {
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true, name: true } } },
          },
          _count: { select: { savedBy: true } },
        },
      }),
      userId
        ? prisma.savedCollege.count({ where: { collegeId: id, userId } })
        : Promise.resolve(0),
    ]);

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json({ data: college, isSaved: savedCount > 0 });
  } catch (error) {
    console.error("College detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
