// app/api/debug-cookies/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const cookies = request.cookies.getAll();

	return NextResponse.json({
		cookies,
		headers: Object.fromEntries(request.headers.entries()),
	});
}
