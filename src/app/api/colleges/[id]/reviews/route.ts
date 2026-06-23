import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId, UnauthorizedError } from "@/lib/auth-helpers";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireUserId();
    const collegeId = parseInt(params.id, 10);

    if (isNaN(collegeId)) {
      return NextResponse.json({ error: "Invalid college ID" }, { status: 400 });
    }

    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { rating, comment } = parsed.data;

    // Upsert: one review per user per college
    const review = await prisma.review.upsert({
      where: { collegeId_userId: { collegeId, userId } },
      update: { rating, comment },
      create: { collegeId, userId, rating, comment },
      include: { user: { select: { id: true, name: true } } },
    });

    // Update college rating average
    const avgResult = await prisma.review.aggregate({
      where: { collegeId },
      _avg: { rating: true },
    });
    if (avgResult._avg.rating !== null) {
      await prisma.college.update({
        where: { id: collegeId },
        data: { rating: Math.round(avgResult._avg.rating * 10) / 10 },
      });
    }

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) return error.response;
    console.error("Review post error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
