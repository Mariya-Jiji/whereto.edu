import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export class UnauthorizedError extends Error {
  readonly response: NextResponse;
  constructor() {
    super("Unauthorized");
    this.response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

/** Get numeric user ID from session — throws UnauthorizedError if not logged in */
export async function requireUserId(): Promise<number> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  return parseInt(session.user.id, 10);
}
