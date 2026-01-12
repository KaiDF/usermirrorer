import OpenAI from 'openai';
import type { SimulationResult, HistoryItem } from './types';

// Re-export types if needed
export type { SimulationResult };

const getApiKey = (): string => {
    return localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY || 'EMPTY';
};

const getBaseUrl = (): string => {
    return localStorage.getItem('openai_api_base_url') || import.meta.env.VITE_OPENAI_API_BASE_URL || 'http://101.200.33.46/v1';
};

// const getModelId = (requestedModel: string): string => {
//     return localStorage.getItem('openai_model_id') || requestedModel;
// };

const parseSimulationResponse = (content: string): SimulationResult => {
    const lines = content.split('\n');
    const result: SimulationResult = {
        stimulus: { text: "N/A", factors: "N/A" },
        knowledge: { text: "N/A", factors: "N/A" },
        evaluation: { text: "N/A", style: "N/A" },
        behavior: "A"
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("Stimulus:")) {
            result.stimulus.text = trimmed.substring("Stimulus:".length).trim();
        } else if (trimmed.startsWith("Stimulus Factors:")) {
            result.stimulus.factors = trimmed.substring("Stimulus Factors:".length).trim();
        } else if (trimmed.startsWith("Knowledge:")) {
            result.knowledge.text = trimmed.substring("Knowledge:".length).trim();
        } else if (trimmed.startsWith("Knowledge Factors:")) {
            result.knowledge.factors = trimmed.substring("Knowledge Factors:".length).trim();
        } else if (trimmed.startsWith("Evaluation:")) {
            result.evaluation.text = trimmed.substring("Evaluation:".length).trim();
        } else if (trimmed.startsWith("Evaluation Style:")) {
            result.evaluation.style = trimmed.substring("Evaluation Style:".length).trim();
        } else if (trimmed.startsWith("Behavior:")) {
            const match = trimmed.match(/Behavior:\s*\[?([A-Z])\]?/i);
            if (match) {
                result.behavior = match[1].toUpperCase();
            }
        }
    }
    return result;
};

export const simulate = async (history: HistoryItem[], candidates: string[], model: string = './UserMirrorrer-Llama-DPO', prompt?: string): Promise<SimulationResult> => {
    const apiKey = getApiKey();
    const baseURL = getBaseUrl();
    const targetModel = './UserMirrorrer-Llama-DPO';

    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: baseURL,
        dangerouslyAllowBrowser: true // Required for client-side usage
    });

    const systemPrompt = `You are a sophisticated user behavior emulator, tasked with simulating user responses within a general recommendation context. Given a user profile and an exposure list, generate a detailed, first-person thought and the user behavior. Your simulations should be adapted for diverse recommendation domains such as media, businesses, and e-commerce.

**Structure and Content:**

Your output includes a thought and a behavior. The thought should be structured as a logical progression through the following stages:

- **Stimulus:** [Describe the initial motivation or need that initiates the user's thought process. This should connect to their profile's spatial, temporal, thematic preferences, causal, and social factors.]
    *   **Stimulus Factors:** [List 1-3 most relevant factors from: Internal States (Boredom, Hunger, Thirst, Fatigue/Restlessness, Emotional State, Curiosity, Need for Achievement, Inspiration), External Cues (Time of Day, Day of Week, Weather, Location, Social Factors, Special Occasion, Notification, Advertising, Financial Situation, Availability)]
- **Knowledge:** [Describe the user's thought process as they gain knowledge from the exposure list.  Highlight specific attributes of the options that resonate with the user's preferences, drawing on the user profile.]
    *   **Knowledge Factors:** [List 2-4 most influential factors from: Product/Service Attributes (Price, Quality, Features, Convenience, Novelty, Brand Reputation, Personal Relevance (Functional, Thematic, Identity-Based), Emotional Appeal, Time Commitment, Risk), Information Source & Presentation (Visual Presentation, Recommendation Source, Review Content/Sentiment, Rating Score/Distribution, Social Proof), User's Prior Knowledge (Past Experience, User Preferences/History)]
-  **Evaluation:** [Explain the user's internal justification for their preference.]
    *   **Evaluation Style:** [Specify 1 style of the evaluation process, such as Logical, Intuitive, Impulsive, Habitual]

After generating the thought, choose a behavior in the given exposure list. Each choice in the exposure list is indicated by a alphabetic identifier [A], [B], [C], etc. Your output should be a choice identifier from the exposure list, for example, "Behavior: [G]".

**Constraints:**
*   While multiple behaviors might be considered in the early stages, the final decision should align with a **single** behavior.
*   Use "I" to reflect the first-person perspective of the user.

**Output Format:**
\`\`\`
Thought:
Stimulus: [STIMULUS DESCRIPTION]
Stimulus Factors: [FACTOR 1], [FACTOR 2]
Knowledge: [KNOWLEDGE DESCRIPTION]
Knowledge Factors: [FACTOR 1], [FACTOR 2], [FACTOR 3]
Evaluation: [EVALUATION DESCRIPTION]
Evaluation Style: [EVALUATION STYLE]
Behavior: [BEHAVIOR]
\`\`\`
`;

    const userPromptContent = prompt ? prompt : `
User History:
${history.map(h => `- ${h.title} (${h.genre})`).join('\n')}

Candidates:
${candidates.map((c, i) => `${String.fromCharCode(65 + i)}. ${c}`).join('\n')}

Simulate the user's thought process.
`;

    try {
        console.log(`Sending request to ${baseURL} with model: ${targetModel} (Original: ${model})`);

        const completion = await client.chat.completions.create({
            model: targetModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPromptContent }
            ],
            temperature: 0.7,
            // response_format: { type: "json_object" } // Removed JSON enforcement
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error("Received empty response from OpenAI.");
        }

        try {
            // Attempt to parse structured text response
            return parseSimulationResponse(content);
        } catch (e) {
            console.error("Failed to parse response:", content);
            throw new Error("Invalid response format from model");
        }

    } catch (error) {
        console.error("Simulation error:", error);
        return {
            stimulus: { text: "Error simulating user.", factors: "API Error" },
            knowledge: { text: String(error), factors: "Debug" },
            evaluation: { text: "Check network tab for details.", style: "Error" },
            behavior: "Error"
        };
    }
};
