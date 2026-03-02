import AIDecision from '@/models/AIDecision';
import ClockState from '@/models/ClockState';
import AuditLog from '@/models/AuditLog';
import { RiskIngestionService } from './riskIngestionService';
import connectToDatabase from '@/lib/db';

const DOMAINS = {
    Nuclear: {
        weight: 0.30,
        neg: { 'nuclear': 2.0, 'missile': 1.5, 'warhead': 2.5, 'uranium': 1.0, 'plutonium': 1.0, 'icbm': 2.0, 'atomic': 1.5, 'escalation': 1.0, 'military': 1.0 },
        pos: { 'disarmament': 2.0, 'treaty': 1.0, 'pact': 1.0, 'non-proliferation': 2.0 }
    },
    Climate: {
        weight: 0.25,
        neg: { 'flood': 1.0, 'drought': 1.0, 'heatwave': 1.0, 'wildfire': 1.0, 'emission': 1.0, 'hurricane': 1.0, 'climate': 2.0, 'warming': 1.0 },
        pos: { 'renewable': 1.0, 'solar': 1.0, 'wind': 1.0, 'conservation': 1.0, 'carbon neutral': 1.5 }
    },
    Biosecurity: {
        weight: 0.15,
        neg: { 'virus': 1.0, 'outbreak': 1.5, 'mutation': 1.5, 'pandemic': 2.0, 'quarantine': 1.0, 'disease': 1.0, 'strain': 1.0, 'infection': 1.0 },
        pos: { 'vaccine': 2.0, 'cured': 1.5, 'eradication': 2.0, 'recovery': 1.0, 'who': 0.5 }
    },
    AI: {
        weight: 0.15,
        neg: { 'agi': 1.5, 'superintelligence': 1.5, 'autonomous weapon': 2.5, 'cyberattack': 2.0, 'breach': 1.0, 'hack': 1.0, 'malware': 1.0, 'deepfake': 1.5 },
        pos: { 'regulation': 1.5, 'safety': 1.0, 'alignment': 1.5, 'guardrails': 1.5, 'oversight': 1.0 }
    },
    Geopolitical: {
        weight: 0.15,
        neg: { 'war': 2.0, 'conflict': 1.5, 'invasion': 2.5, 'strike': 1.5, 'sanctions': 1.0, 'terror': 2.0, 'rebel': 1.0, 'coup': 2.0, 'instability': 1.5 },
        pos: { 'peace': 2.0, 'ceasefire': 2.5, 'diplomatic': 1.0, 'accord': 1.0, 'negotiation': 1.0 }
    }
};

const ALPHA = 0.20; // Logistic sensitivity
const LAMBDA = 0.05; // Time decay constant
const BETA = 0.30; // Exponential smoothing factor
const MAX_MOVEMENT = 30; // Max seconds per cycle
const DAILY_CAP = 60; // Max seconds per day
const MIN_HEADLINES_THRESHOLD = 5;

export class AIService {
    static async evaluateRisks() {
        await connectToDatabase();

        // 1. Fetch unprocessed risks (All available unprocessed for batch evaluation)
        const risks = await RiskIngestionService.getUnprocessedRisks(100);

        // Phase 10: System Stability (Minimum threshold)
        if (risks.length < MIN_HEADLINES_THRESHOLD) {
            return { status: 'no_new_data', message: `Not enough new risk factors to move the clock (Need ${MIN_HEADLINES_THRESHOLD}, got ${risks.length}).` };
        }

        // 2. Fetch current clock state
        const clockState = await ClockState.findOne().sort({ lastUpdated: -1 }) || await ClockState.create({
            secondsToMidnight: 90,
            global_index: 50,
            previous_global_index: 50,
            daily_movement_total: 0,
            domain_scores: { Nuclear: 50, Climate: 50, Biosecurity: 50, AI: 50, Geopolitical: 50 }
        });

        const now = new Date();

        // Check if day changed for daily cap reset (UTC Midnight)
        if (clockState.last_run_timestamp) {
            const lastRun = new Date(clockState.last_run_timestamp);
            if (lastRun.getUTCFullYear() !== now.getUTCFullYear() ||
                lastRun.getUTCMonth() !== now.getUTCMonth() ||
                lastRun.getUTCDate() !== now.getUTCDate()) {
                clockState.daily_movement_total = 0;
            }
        }

        let uniqueSources = new Set();
        let uniqueHeadlines = new Set();

        const rawScores = { Nuclear: 0, Climate: 0, Biosecurity: 0, AI: 0, Geopolitical: 0 };
        const activeDomains = new Set();

        // Phase 2: Keyword Matching and Decay
        for (const risk of risks) {
            const h = risk.description.toLowerCase();
            const sourceName = risk.source.split(':')[0].trim();
            uniqueSources.add(sourceName);
            uniqueHeadlines.add(risk.description);

            // Time decay
            const dtHours = Math.max(0, (now - new Date(risk.timestamp)) / (1000 * 60 * 60));
            const decay = Math.exp(-LAMBDA * dtHours);

            for (const [domain, dict] of Object.entries(DOMAINS)) {
                let r_d_local = 0;
                let matched = false;

                // Check negative words (increase risk)
                for (const [kw, w] of Object.entries(dict.neg)) {
                    if (h.includes(kw)) { r_d_local += (w * decay); matched = true; }
                }

                // Check positive words (decrease risk)
                for (const [kw, w] of Object.entries(dict.pos)) {
                    if (h.includes(kw)) { r_d_local -= (w * decay); matched = true; }
                }

                if (matched) activeDomains.add(domain);
                rawScores[domain] += r_d_local;
            }
        }

        // Apply Normalization and Phase 3: Exponential Smoothing
        const normalizedScores = {};
        const newDomainScores = {};

        for (const domain of Object.keys(DOMAINS)) {
            // R_d -> Normalized
            const r_d = rawScores[domain];
            const norm = 100 * (1 / (1 + Math.exp(-ALPHA * r_d)));
            normalizedScores[domain] = norm;

            // Exponential Smoothing
            const prev_S_d = clockState.domain_scores[domain] || 50;
            const new_S_d = (BETA * norm) + ((1 - BETA) * prev_S_d);
            newDomainScores[domain] = new_S_d;
        }

        // Phase 4: Global Risk Index
        let current_G = 0;
        for (const [domain, config] of Object.entries(DOMAINS)) {
            current_G += (config.weight * newDomainScores[domain]);
        }

        const G_prev = clockState.global_index || 50;

        // Phase 5: Clock Movement Function
        // deltaC = 30 * tanh((G - G_prev) / 10)
        let deltaC = MAX_MOVEMENT * Math.tanh((current_G - G_prev) / 10);

        // Phase 6: Daily Cap
        // Ensure |Total daily movement + deltaC| <= 60
        if (clockState.daily_movement_total + deltaC > DAILY_CAP) {
            deltaC = DAILY_CAP - clockState.daily_movement_total;
        } else if (clockState.daily_movement_total + deltaC < -DAILY_CAP) {
            deltaC = -DAILY_CAP - clockState.daily_movement_total;
        }

        // Apply to clock (round to nearest integer for seconds)
        const moveSeconds = Math.round(deltaC);

        // Reverse direction logic vs semantic naming: 
        // Index increasing -> risk higher -> closer to midnight -> seconds DECREASE
        // So a positive deltaC means Risk increased.
        // We subtract positive deltaC from secondsToMidnight.

        let newSeconds = clockState.secondsToMidnight - moveSeconds;
        newSeconds = Math.max(0, Math.min(newSeconds, 600)); // Constrain 0 <= C <= 600

        const actualChange = clockState.secondsToMidnight - newSeconds; // How many seconds it moved

        let decision = "no_change";
        if (actualChange > 0) decision = "forward";
        if (actualChange < 0) decision = "backward";

        // Phase 7: Confidence Metric
        // Confidence = min( (sources/8)*0.5 + (domains/5)*0.3 + (headlines/20)*0.2, 1.0 )
        const confNum = Math.min(
            (uniqueSources.size / 8) * 0.5 +
            (activeDomains.size / 5) * 0.3 +
            (uniqueHeadlines.size / 20) * 0.2,
            1.0
        );
        let confLevel = "Medium";
        if (confNum < 0.4) confLevel = "Low";
        if (confNum > 0.7) confLevel = "High";

        // Phase 11: Explanation Engine (Deterministic)
        // Find biggest movers positively
        const movers = [];
        for (const domain of Object.keys(DOMAINS)) {
            const shift = newDomainScores[domain] - (clockState.domain_scores[domain] || 50);
            if (Math.abs(shift) > 0.5) {
                movers.push({ domain, shift });
            }
        }
        movers.sort((a, b) => Math.abs(b.shift) - Math.abs(a.shift));

        let explanation = "The clock remained stable as global risk indices experienced minimal net movement.";

        if (decision !== "no_change" && movers.length > 0) {
            const directionText = decision === "forward" ? "closer to" : "further from";
            const topMoversStr = movers.slice(0, 2).map(m => `${m.domain} Risk (${m.shift > 0 ? '+' : ''}${m.shift.toFixed(1)})`).join(" and ");

            explanation = `The clock moved ${Math.abs(actualChange)} seconds ${directionText} midnight due to shifting indicators in ${topMoversStr}, primarily triggered by ${uniqueHeadlines.size} unique headlines across ${uniqueSources.size} independent sources.`;
        }

        // Prevent useless updates (if less than 1s change, consider it no_change)
        if (Math.abs(actualChange) === 0) {
            decision = "no_change";
        }

        // 6. Log Decision 
        const decisionRecord = await AIDecision.create({
            decision: decision,
            deltaSeconds: Math.abs(actualChange),
            confidence: confNum,
            primaryFactors: movers.slice(0, 3).map(m => m.domain),
            explanation: explanation,
            rawOutput: { G: current_G, G_prev, deltaC, rawScores, normalizedScores, newDomainScores }
        });

        // 7. Execute State Update
        await ClockState.create({
            secondsToMidnight: newSeconds,
            reasonChange: explanation,
            status: newSeconds < 60 ? "Critical" : (newSeconds < 180 ? "Elevated" : "Stable"),
            confidence: confLevel,
            lastUpdated: new Date(),
            global_index: current_G,
            previous_global_index: G_prev,
            daily_movement_total: clockState.daily_movement_total + deltaC,
            domain_scores: newDomainScores,
            last_run_timestamp: now
        });

        if (decision !== 'no_change') {
            await AuditLog.create({
                action: 'CLOCK_UPDATE',
                actor: 'System',
                details: { oldSeconds: clockState.secondsToMidnight, newSeconds: newSeconds, decision, explanation }
            });
        }

        // 8. Mark risks as processed
        await RiskIngestionService.markRisksAsProcessed(risks.map(r => r._id));

        return decisionRecord;
    }
}
