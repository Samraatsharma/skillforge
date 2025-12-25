import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { setupPDFWorker } from '@/utils/pdfWorkerSetup';

// Initialize Worker
const pdfjs = setupPDFWorker();

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 1. Parsing PDF Text
        let text = '';
        try {
            const arrayBuffer = await file.arrayBuffer();

            // Parse using the initialized pdfjs lib
            const loadingTask = pdfjs.getDocument({
                data: new Uint8Array(arrayBuffer),
                useSystemFonts: true,
                disableFontFace: true,
            });

            const pdfDocument = await loadingTask.promise;
            let fullText = '';

            for (let i = 1; i <= pdfDocument.numPages; i++) {
                const page = await pdfDocument.getPage(i);
                const textContent = await page.getTextContent();
                // @ts-ignore
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + ' ';
            }
            text = fullText;
            console.log("Server: PDF Parsed Length:", text.length);
        } catch (pdfError: any) {
            console.error("PDF Parsing Error:", pdfError);
            return NextResponse.json({
                error: `PDF Read Error: ${pdfError.message || 'Corrupt file'}. Please copy text manually.`
            }, { status: 400 });
        }

        // 2. AI Analysis (If Key Exists)
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Server: Gemini API Key status:", apiKey ? "Present" : "Missing");

        let analysis = null;

        if (apiKey) {
            try {
                // 1. Dynamic Model Discovery
                let modelName = "gemini-1.5-flash"; // Default fallback
                try {
                    const modelsResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                    if (modelsResp.ok) {
                        const modelsData = await modelsResp.json();
                        // Find first model that supports generateContent
                        const viableModel = modelsData.models?.find((m: any) =>
                            m.supportedGenerationMethods?.includes("generateContent") &&
                            (m.name.includes("flash") || m.name.includes("pro") || m.name.includes("gemini"))
                        );
                        if (viableModel) {
                            // API returns "models/model-name", sdk expects "model-name"? 
                            // Actually SDK handles both, but let's strip "models/" to be safe if passed to getGenerativeModel
                            modelName = viableModel.name.replace("models/", "");
                        }
                    }
                } catch (discoveryError) {
                    console.warn("Model discovery failed, using fallback:", discoveryError);
                }

                console.log("Server: Selected AI Model:", modelName);

                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
            You are a Career Architect AI. Analyze the following resume text.
            Extensively extract the top 15 professional skills found (mastered). These can be technical (Java, React) OR non-technical (Content Writing, Project Management, SEO, Public Speaking), depending on the resume's focus.
            
            Based on these, identify 5 "Missing but Critical" skills for their likely next career step (unlocked).
            Identify 5 "Advanced/Future" skills (locked).
            
            Return ONLY a valid JSON object with this structure:
            {
                "mastered": ["Skill1", "Skill2"],
                "unlocked": ["Skill3", "Skill4"],
                "locked": ["Skill5", "Skill6"],
                "match_score": 85
            }
            
            Resume Text:
            ${text.substring(0, 8000)}
            `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const jsonText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                analysis = JSON.parse(jsonText);

            } catch (aiError) {
                console.error("AI Generation Failed:", aiError);
                // Fallback to null, frontend will handle local simulation
            }
        }

        return NextResponse.json({
            success: true,
            text: text, // Legacy support for local sim
            analysis: analysis // The Real AI Payload
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: `Failed to process resume: ${error.message}` }, { status: 500 });
    }
}
