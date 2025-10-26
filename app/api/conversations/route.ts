import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const token = request.headers.get("authorization")?.split(" ")[1];

		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/conversations`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (!response.ok) {
			const error = await response.json();
			return NextResponse.json(error, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("[v0] Conversations API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch conversations" },
			{ status: 500 }
		);
	}
}
