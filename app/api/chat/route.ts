import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const token = request.headers.get("authorization")?.split(" ")[1];

		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				message: body.message,
				conversationId: body.conversationId,
				language: body.language,
			}),
		});

		if (!response.ok) {
			const error = await response.json();
			return NextResponse.json(error, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("[v0] Chat API error:", error);
		return NextResponse.json(
			{ error: "Failed to process chat message" },
			{ status: 500 }
		);
	}
}
