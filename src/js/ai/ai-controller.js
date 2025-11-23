import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIController {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("API Key diperlukan untuk AIController.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async getAction(gameState) {
        const prompt = `
        You are an AI controller for an NPC in a 3D dungeon crawler game.
        Your task is to decide the next immediate action for the NPC based on the provided game state.
        You must respond ONLY with a single, valid JSON object. No other text or markdown formatting.

        Game State:
        ${JSON.stringify(gameState, null, 2)}

        Your response must follow this exact JSON schema:
        {
          "action": "MOVE_TO" | "ATTACK" | "IDLE",
          "targetId": "string or null",
          "destination": { "x": number, "y": number, "z": number }
        }

        Decision Rules:
        - If the player is close (distance < 10), choose "ATTACK".
        - If the player is far away, choose "MOVE_TO" with a position near the player.
        - If you are unsure or there is nothing to do, choose "IDLE" at your current position.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            
            // Bersihkan respons dari kemungkinan markdown
            const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
            
            // Parsing JSON
            const action = JSON.parse(cleanedText);
            
            // Validasi dasar
            if (!action.action || !action.destination) {
                throw new Error("Respons JSON tidak valid dari Gemini.");
            }

            return action;

        } catch (error) {
            console.error("Gagal mendapatkan atau memproses respons AI:", error);
            // Kembalikan aksi default yang aman
            return {
                action: "IDLE",
                targetId: null,
                destination: gameState.npc.position
            };
        }
    }
}
