import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

import { z } from "zod";

// Maps Indian state names → city values stored in the DB
const STATE_TO_CITIES: Record<string, string[]> = {
  "Delhi":         ["Delhi"],
  "Gujarat":       ["Ahmedabad", "Gandhinagar"],
  "Karnataka":     ["Bangalore", "Manipal", "Mangalore"],
  "Kerala":        ["Calicut"],
  "Maharashtra":   ["Mumbai", "Pune"],
  "Odisha":        ["Bhubaneswar"],
  "Punjab":        ["Patiala", "Chandigarh"],
  "Rajasthan":     ["Jaipur", "Pilani"],
  "Tamil Nadu":    ["Chennai", "Tiruchirappalli", "Vellore"],
  "Telangana":     ["Hyderabad", "Warangal"],
  "Uttar Pradesh": ["Kanpur", "Noida"],
  "West Bengal":   ["Kolkata", "Kharagpur"],
};

// Clamp helpers
function clampInt(val: string | null, min: number, max: number): number | undefined {
  if (!val) return undefined;
  const n = parseInt(val, 10);
  if (isNaN(n)) return undefined;
  return Math.min(Math.max(n, min), max);
}

function clampFloat(val: string | null, min: number, max: number): number | undefined {
  if (!val) return undefined;
  const n = parseFloat(val);
  if (isNaN(n)) return undefined;
  return Math.min(Math.max(n, min), max);
}

const querySchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  minFees: z.string().optional(),
  maxFees: z.string().optional(),
  minRating: z.string().optional(),
  type: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = querySchema.parse(Object.fromEntries(searchParams.entries()));

    const page = Math.max(1, parseInt(query.page ?? "1", 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize ?? "12", 10) || 12));
    const skip = (page - 1) * pageSize;

    const minFees = clampInt(query.minFees ?? null, 0, 10000000);
    const maxFees = clampInt(query.maxFees ?? null, 0, 10000000);
    const minRating = clampFloat(query.minRating ?? null, 0, 5);

    // Build dynamic where clause
    const where: Record<string, unknown> = {};

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { location: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
      ];
    }

    if (query.location) {
      const cities = STATE_TO_CITIES[query.location];
      if (cities) {
        // State filter — match any city within that state
        where.location = { in: cities };
      } else {
        // Fallback: treat as direct city match
        where.location = { equals: query.location, mode: "insensitive" };
      }
    }

    if (query.type) {
      where.type = { equals: query.type, mode: "insensitive" };
    }

    if (minFees !== undefined || maxFees !== undefined) {
      where.feesPerYear = {
        ...(minFees !== undefined ? { gte: minFees } : {}),
        ...(maxFees !== undefined ? { lte: maxFees } : {}),
      };
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    const [colleges, totalCount] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy: { rating: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          location: true,
          feesPerYear: true,
          rating: true,
          type: true,
          establishedYear: true,
          _count: { select: { courses: true, reviews: true } },
          placements: {
            orderBy: { year: "desc" },
            take: 1,
            select: { avgPackage: true, placementRate: true, year: true },
          },
        },
      }),
      prisma.college.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      data: colleges,
      pagination: { page, pageSize, totalCount, totalPages },
    });
  } catch (error) {
    console.error("Colleges list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
