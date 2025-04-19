import { getPointsAction } from "@/lib/server-actions/points";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { autocomplete, lang } = await request.json();
  const points = await getPointsAction({ autocomplete, lang });

  return NextResponse.json(points);
}
