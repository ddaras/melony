import { getRoutesAction } from "@/lib/server-actions/routes";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const routes = await getRoutesAction(body);
  return NextResponse.json(routes);
}
