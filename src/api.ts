import type { SimulationResult, HistoryItem } from './types';

// Re-export types if needed
export type { SimulationResult };

export const simulate = async (history: HistoryItem[], candidates: string[], model: string = 'default', prompt?: string): Promise<SimulationResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Simulating with model: ${model}, prompt length: ${prompt?.length}`);

            // Logic ported from backend/app/model.py
            let decisionIndex = 0;
            let rationale = "I chose this item randomly because nothing looked specific.";
            let matchedWord = "";
            let matchedCandidate = "";

            if (candidates.length > 0) {
                // Create a set of words from history titles
                const historyWords = new Set<string>();
                history.forEach(item => {
                    item.title.toLowerCase().split(/\s+/).forEach(word => historyWords.add(word));
                });

                // Find the first candidate that shares a word with history
                for (let i = 0; i < candidates.length; i++) {
                    const cand = candidates[i];
                    const candWords = cand.toLowerCase().split(/\s+/);
                    const common = candWords.find(word => historyWords.has(word));

                    if (common) {
                        decisionIndex = i;
                        matchedCandidate = cand;
                        matchedWord = common;
                        rationale = `I chose '${cand}' because it relates to your interest in '${common}'.`;
                        break;
                    }
                }

                if (!matchedCandidate) {
                    matchedCandidate = candidates[0];
                }
            }

            // Map index to A, B, C...
            const behavior = String.fromCharCode(65 + decisionIndex);

            resolve({
                stimulus: {
                    text: "I am considering my options based on my past viewing history and current mood.",
                    factors: "User Preferences/History, Internal States"
                },
                knowledge: {
                    text: matchedWord
                        ? `I see '${matchedCandidate}' which contains thoughts similar to '${matchedWord}' from my history.`
                        : "None of the options seem to strongly connect with my specific past detailed history, so I am looking at them broadly.",
                    factors: "Product Attributes, Cognitive Matching"
                },
                evaluation: {
                    text: rationale,
                    style: "Logical"
                },
                behavior: behavior
            });
        }, 1500); // 1.5s delay to mimic backend
    });
};
