import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId, UnauthorizedError } from "@/lib/auth-helpers";
import { z } from "zod";

const saveComparisonSchema = z.object({
  collegeIds: z
    .array(z.number().int().positive())
    .min(2, "Must compare at least 2 colleges")
    .max(3, "Can compare at most 3 colleges"),
  label: z.string().max(100).optional(),
});

const deleteSchema = z.object({
  id: z.number().int().positive(),
});

export async function GET() {
  try {
    const userId = await requireUserId();

    const comparisons = await prisma.savedComparison.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Fetch college names for display
    const enriched = await Promise.all(
      comparisons.map(async (comp) => {
        const ids = comp.collegeIds as number[];
        const colleges = await prisma.college.findMany({
          where: { id: { in: ids } },
          select: { id: true, name: true, location: true, rating: true },
        });
        return { ...comp, colleges };
      })
    );

    return NextResponse.json({ data: enriched });
  } catch (error) {
    if (error instanceof UnauthorizedError) return error.response;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await request.json();

    const parsed = saveComparisonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { collegeIds, label } = parsed.data;
    const uniqueIds = Array.from(new Set(collegeIds));

    if (uniqueIds.length < 2) {
      return NextResponse.json(
        { error: "Please select at least 2 different colleges" },
        { status: 400 }
      );
    }

    // Verify colleges exist
    const colleges = await prisma.college.count({
      where: { id: { in: uniqueIds } },
    });
    if (colleges < uniqueIds.length) {
      return NextResponse.json({ error: "One or more colleges not found" }, { status: 404 });
    }

    const comparison = await prisma.savedComparison.create({
      data: { userId, collegeIds: uniqueIds, label: label ?? null },
    });

    return NextResponse.json({ data: comparison }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) return error.response;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await request.json();

    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await prisma.savedComparison.deleteMany({
      where: { id: parsed.data.id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) return error.response;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
