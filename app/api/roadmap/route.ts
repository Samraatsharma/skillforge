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
        try {
            const modelsResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (modelsResp.ok) {
                const modelsData = await modelsResp.json();
                const viableModel = modelsData.models?.find((m: any) =>
                    m.supportedGenerationMethods?.includes("generateContent") &&
                    (m.name.includes("flash") || m.name.includes("pro") || m.name.includes("gemini"))
                );
                if (viableModel) modelName = viableModel.name.replace("models/", "");
            }
        } catch (e) { }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `
        Create a linear, gamified skill tree roadmap for the role: "${role}".
        Generate exactly 20 nodes (levels) starting from Beginner to Expert.
        
        Return ONLY a JSON array of strings, where each string is a short skill name (e.g., "Python Basics", "Neural Networks").
        Example: ["Skill 1", "Skill 2", ... "Skill 20"]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const roadmap = JSON.parse(text);

        return NextResponse.json({ roadmap });

    } catch (error) {
        console.error("Roadmap Gen Failed:", error);
        return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
    }
}
