import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId, UnauthorizedError } from "@/lib/auth-helpers";
import { z } from "zod";

const saveSchema = z.object({
  collegeId: z.number().int().positive(),
});

export async function GET() {
  try {
    const userId = await requireUserId();

    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            feesPerYear: true,
            rating: true,
            type: true,
            placements: { orderBy: { year: "desc" }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: saved });
  } catch (error) {
    if (error instanceof UnauthorizedError) return error.response;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await request.json();

    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { collegeId } = parsed.data;

    // Verify college exists
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Idempotent save — check first to avoid race-condition unique violation
    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId, collegeId } },
    });

    const saved = existing ?? await prisma.savedCollege.create({
      data: { userId, collegeId },
    });

    return NextResponse.json({ data: saved });
  } catch (error) {
    if (error instanceof UnauthorizedError) return error.response;
    // Handle duplicate key gracefully (e.g. concurrent requests)
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ data: { userId, collegeId } });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await request.json();

    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { collegeId } = parsed.data;

    await prisma.savedCollege.deleteMany({
      where: { userId, collegeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) return error.response;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
