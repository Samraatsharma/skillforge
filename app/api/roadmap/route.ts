import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        const { role } = await req.json();

        if (!role) {
            return NextResponse.json({ error: "Role required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        // 1. Dynamic Model Discovery (Same logic as analyze)
        let modelName = "gemini-1.5-flash";

        // CHECK QUOTA LIMITS FIRST (Simple heuristic or env flag)
        // If we hit 429 recently, we might want to skip, but for now we just handle the error.

        try {
            const modelsResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (modelsResp.ok) {
                const modelsData = await modelsResp.json();
                const viableModel = modelsData.models?.find((m: any) =>
                    m.supportedGenerationMethods?.includes("generateContent") &&
                    (m.name.includes("flash") || m.name.includes("pro") || m.name.includes("gemini"))
                );
                if (viableModel) modelName = viableModel.name.replace("models/", "");
            } else if (modelsResp.status === 429) {
                console.warn("Gemini Quota Exceeded (Discovery). Using Offline Fallback.");
                return NextResponse.json({ roadmap: [] }); // Empty returns trigger fallback in FE
            }
        } catch (e) { }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `Generate a linear skill tree for a "${role}". 
             Return STRICTLY a JSON array of strings (max 20 items). 
             Example: ["HTML", "CSS", "JS"]. 
             NO markdown, NO explanations.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

            const roadmap = JSON.parse(text);
            return NextResponse.json({ roadmap });

        } catch (error: any) {
            console.error("Gemini Generation Error:", error);
            // FAIL OPEN: sending empty array triggers the Frontend static fallback
            return NextResponse.json({ roadmap: [] });
        }

    } catch (error) {
        console.error("Roadmap Gen Failed:", error);
        return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
    }
}
