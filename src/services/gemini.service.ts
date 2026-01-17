import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Difficulty } from './viva.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  private modelId = 'gemini-2.5-flash';

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  /**
   * Generates a question based on Context + Difficulty + Previous Performance.
   * Does NOT force MCQ. Uses heuristic to decide best format.
   */
  async generateNextQuestion(topicContext: string, previousPerformance: { score: number, topic: string, answer: string } | null, difficulty: Difficulty = 'MEDIUM'): Promise<any> {
    const strategy = this.deriveStrategy(previousPerformance, difficulty);
    const safeContext = topicContext.substring(0, 40000); 

    const sysInstruction = `You are LexiVitae, an adaptive Technical Examiner.
    CONTEXT: User chose difficulty '${difficulty}'.
    
    DIFFICULTY LOGIC:
    - EASY: Prefer MCQs (70%) or simple SHORT_ANSWER (30%). Questions should be direct recall.
    - MEDIUM: Balanced mix. 40% MCQ, 40% SHORT_ANSWER, 20% PARAGRAPH.
    - EXTREME: Prefer PARAGRAPH (50%) or complex SHORT_ANSWER (40%). Minimal MCQs (10%). Questions must require synthesis of multiple facts.

    GENERAL RULES:
    1. If the text contains data/tables, ask for specific numbers (SHORT_ANSWER).
    2. If the text explains a process, ask "How/Why" (PARAGRAPH).
    3. If definitions are key, use MCQ.
    4. NO TRIVIA. All questions must test understanding of the provided PDF content.
    `;
    
    const prompt = `
      CONTEXT:
      ${safeContext} ... [truncated]

      STRATEGIC GOAL:
      ${strategy}
      
      TASK:
      Generate ONE viva question in JSON.
      
      OUTPUT FORMAT (JSON):
      {
        "question": "string",
        "type": "MCQ" | "SHORT_ANSWER" | "PARAGRAPH",
        "options": ["string"] | [],  // Only for MCQ
        "citation": "string",
        "complexity": "EASY" | "MEDIUM" | "HARD",
        "hint": "string"
      }
    `;

    return this.withRetry(async () => {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: prompt,
        config: {
          systemInstruction: sysInstruction,
          temperature: difficulty === 'EXTREME' ? 0.4 : 0.3, // Higher temp for extreme to find complex links
          maxOutputTokens: 1000, 
          responseMimeType: 'application/json',
        }
      });
      return this.safeParse(response.text);
    });
  }

  /**
   * Grades answers with strictness scaling based on Difficulty.
   * Returns extended feedback fields.
   */
  async gradeAnswer(question: string, answer: string, context: string, difficulty: Difficulty = 'MEDIUM'): Promise<any> {
    const safeContext = context.substring(0, 15000);

    const prompt = `
      CONTEXT: ${safeContext}
      QUESTION: ${question}
      STUDENT ANSWER: ${answer}
      DIFFICULTY MODE: ${difficulty}

      TASK:
      Grade the answer (0-10).

      STRICTNESS LEVELS:
      - EASY: Accept close synonyms. If key concept is present, give 8+.
      - MEDIUM: Standard academic grading. Requires correct terminology.
      - EXTREME: UNCOMPROMISING. If specific metrics/names from text are missing, max score is 6. If logic is slightly flawed, max score is 4.

      OUTPUT FORMAT (JSON):
      {
        "score": number,
        "feedback": "string (Direct feedback on what was wrong/right)",
        "futureAdvice": "string (Specific tip for improvement, e.g. 'Focus on Table 3 data' or 'Be more concise')",
        "managementSummary": "string (One short sentence for the final report, e.g. 'Candidate struggled with quantitative recall')",
        "isCorrect": boolean
      }
    `;

    return this.withRetry(async () => {
       const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: prompt,
        config: {
          systemInstruction: "You are an AI Grader. Be precise.",
          temperature: 0.1, 
          maxOutputTokens: 800,
          responseMimeType: 'application/json'
        }
      });
      return this.safeParse(response.text);
    });
  }

  async generateFinalReport(questions: any[], context: string): Promise<string> {
    const history = questions.map((q, i) => `Q${i+1}: ${q.question}\nScore: ${q.score}\nSummary: ${q.managementSummary}`).join('\n');
    
    const prompt = `
      EXAM HISTORY: 
      ${history}

      TASK: 
      Write a High-Level Executive Summary (1 paragraph).
      Focus on the candidate's strengths/weaknesses patterns.
    `;

    return this.withRetry(async () => {
        const response = await this.ai.models.generateContent({
            model: this.modelId,
            contents: prompt,
            config: { maxOutputTokens: 500, temperature: 0.7 }
        });
        return response.text || "Report generation failed.";
    });
  }

  private deriveStrategy(prev: { score: number, topic: string, answer: string } | null, difficulty: Difficulty): string {
    if (!prev) {
        return "Start with a core concept definition. Type: MCQ (if Easy/Medium) or SHORT_ANSWER (if Extreme).";
    }
    
    const { score, topic } = prev;
    
    // Adaptive Logic
    if (score >= 8) {
        return `User nailed the last question on "${topic}". ESCALATE DIFFICULTY. Ask a "How" or "Compare" question about a different section. Prefer PARAGRAPH type.`;
    } else if (score <= 4) {
        if (difficulty === 'EXTREME') return `User failed "${topic}". MERCY RULE: Ask a simpler MCQ to re-establish confidence.`;
        return `User failed. Ask a remedial definition question about "${topic}".`;
    } else {
        return `Average performance. Verify details with a specific data-point question (Short Answer).`;
    }
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, delay));
        return this.withRetry(fn, retries - 1, delay * 2);
      }
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  private safeParse(text: string | undefined): any {
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (e) {
      let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      try { return JSON.parse(clean); } catch (e2) {
        return { 
            question: "Context Analysis Error. Please summarize the main contribution.", 
            type: "SHORT_ANSWER",
            complexity: "MEDIUM",
            hint: "Summary",
            score: 5,
            feedback: "System Parse Error.",
            isCorrect: false
        };
      }
    }
  }
}
