import { GoogleGenerativeAI } from '@google/generative-ai';
import AIDecision from '@/models/AIDecision';
import { ClockService } from './clockService';
import { RiskIngestionService } from './riskIngestionService';

// Initialize Gemini client
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

export class AIService {
    static async evaluateRisks() {
        // 1. Fetch unprocessed risks
        const risks = await RiskIngestionService.getUnprocessedRisks();

        if (risks.length === 0) {
            return { status: 'no_new_data', message: "No new risk factors to evaluate." };
        }

        // 2. Fetch current clock state
        const clockState = await ClockService.getCurrentState();

        // 3. Construct Prompt
        const systemInstruction = `
      You are the Doomsday Clock AI. Your job is to evaluate global risk signals and decide if the clock should move closer to midnight (catastrophe).
      
      Current status: ${clockState.secondsToMidnight} seconds to midnight.
      
      Rules:
      - Be objective, scientific, and non-alarmist.
      - Input consists of risk reports (0-100 severity).
      - Output a strictly valid JSON object without markdown formatting:
        { 
          "decision": "forward"|"backward"|"no_change", 
          "delta_seconds": number, 
          "explanation": "string", 
          "confidence": number, 
          "primary_factors": ["string"],
          "updated_locations": [ {"risk_index": number, "region": "string", "lat": number, "lng": number} ] 
        }
      - "updated_locations": For each input risk, try to infer a specific lat/lng if missing.
      - Max movement per update is strict ${process.env.MAX_CLOCK_MOVEMENT_SECONDS || 30} seconds.
      - "forward" means closer to midnight (more danger). "backward" means safer.
    `;

        const riskDescriptions = risks.map((r, i) =>
            `Index ${i}: [${r.category}] Source: ${r.source}. Desc: ${r.description}. Location: ${r.region || 'Unknown'}`
        ).join('\n');

        const userPrompt = `Evaluate these new risk signals:\n${riskDescriptions}`;

        // 4. Call AI (or Mock)
        let aiResponse;
        if (genAI) {
            try {
                const modelName = process.env.AI_MODEL || "gemini-1.5-flash";
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: systemInstruction,
                    generationConfig: { responseMimeType: "application/json" }
                });

                const result = await model.generateContent(userPrompt);
                const text = result.response.text();
                aiResponse = JSON.parse(text);
            } catch (error) {
                console.error("AI Generation failed:", error);
                throw new Error("AI Evaluation failed");
            }
        } else {
            // Mock response
            aiResponse = {
                decision: "no_change",
                delta_seconds: 0,
                explanation: "Mock AI: No GEMINI_API_KEY provided.",
                confidence: 0.5,
                primary_factors: ["System Configuration"],
                updated_locations: []
            };
        }

        // 5. Update Locations (Optional Enhancement)
        if (aiResponse.updated_locations && Array.isArray(aiResponse.updated_locations)) {
            for (const loc of aiResponse.updated_locations) {
                const risk = risks[loc.risk_index];
                if (risk && !risk.coordinates?.lat) {
                    risk.region = loc.region;
                    risk.coordinates = { lat: loc.lat, lng: loc.lng };
                    await risk.save();
                }
            }
        }

        // 6. Log Decision
        const decisionRecord = await AIDecision.create({
            decision: aiResponse.decision,
            deltaSeconds: aiResponse.delta_seconds || 0,
            confidence: aiResponse.confidence || 0.8,
            primaryFactors: aiResponse.primary_factors || [],
            explanation: aiResponse.explanation,
            rawOutput: aiResponse
        });

        // 7. Execute Clock Move
        if (aiResponse.decision !== 'no_change' && (aiResponse.delta_seconds > 0)) {
            await ClockService.updateClock(
                aiResponse.decision,
                aiResponse.delta_seconds,
                aiResponse.explanation,
                decisionRecord.confidence
            );
        }

        // 8. Mark risks as processed
        await RiskIngestionService.markRisksAsProcessed(risks.map(r => r._id));

        return decisionRecord;
    }
}
