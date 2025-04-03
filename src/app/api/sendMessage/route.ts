import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json()
    try{
        const response = await fetch(body.webhook,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: `From John Ezra Paz's Slack Bot: ${body.message}`  }),
        })
        
        if (!response.ok) {
            throw new Error("Failed to send message");
          }
      
          return NextResponse.json({ success: true, message: "Message sent!" });
        } catch (error) {
          return NextResponse.json({ error: (error as Error).message }, { status: 500 });
        }
}