import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { GeminiService } from './gemini.service';

declare var XLSX: any;

export type AppState = 'LANDING' | 'CANDIDATE_FORM' | 'UPLOAD' | 'PROCESSING' | 'INSTRUCTIONS' | 'INTERVIEW' | 'REPORT' | 'DISQUALIFIED';
export type Difficulty = 'EASY' | 'MEDIUM' | 'EXTREME';

export interface CandidateInfo {
  name: string;
  email: string;
  role: string;
  id: string;
}

export interface Question {
  id: number;
  question: string;
  type: 'MCQ' | 'SHORT_ANSWER' | 'PARAGRAPH';
  options?: string[];
  citation: string;
  complexity: string;
  hint: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
  futureAdvice?: string; // New field
  managementSummary?: string; // New field
}

const DEFAULT_CONTEXT = `The Transformer is a model architecture...`;
const STORAGE_KEY = 'lexivitae_ms_ultimate_v3';

@Injectable({
  providedIn: 'root'
})
export class VivaService {
  private gemini = inject(GeminiService);

  state = signal<AppState>('LANDING');
  difficulty = signal<Difficulty>('MEDIUM'); // New Difficulty Signal
  
  context = signal<string>(DEFAULT_CONTEXT);
  questions = signal<Question[]>([]);
  currentQuestionIndex = signal<number>(0);
  isSpeaking = signal<boolean>(false);
  streak = signal<number>(0); 
  finalReport = signal<string>('');
  
  totalQuestionCount = signal<number>(5);
  examDurationMinutes = signal<number>(10);

  feedbackState = signal<'IDLE' | 'CORRECT' | 'INCORRECT'>('IDLE');
  candidate = signal<CandidateInfo>({ name: '', email: '', role: '', id: '' });
  
  cheatStrikes = signal<number>(0);
  isCheating = signal<boolean>(false);
  suspiciousObject = signal<string>('');

  currentQuestion = computed(() => this.questions()[this.currentQuestionIndex()]);
  progress = computed(() => Math.min(100, (this.currentQuestionIndex() / this.totalQuestionCount()) * 100));
  
  totalScore = computed(() => {
    const qs = this.questions();
    const scoredQs = qs.filter(q => q.score !== undefined);
    if (scoredQs.length === 0) return 0;
    const sum = scoredQs.reduce((acc, q) => acc + (q.score || 0), 0);
    return (sum / (scoredQs.length * 10)) * 10;
  });

  constructor() {
    this.loadState();
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        state: this.state(),
        difficulty: this.difficulty(),
        context: this.context(),
        questions: this.questions(),
        currentQuestionIndex: this.currentQuestionIndex(),
        candidate: this.candidate()
      }));
    });
  }

  loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.state && data.state !== 'LANDING' && data.state !== 'PROCESSING') {
          this.context.set(data.context);
          this.questions.set(data.questions);
          this.currentQuestionIndex.set(data.currentQuestionIndex);
          this.state.set(data.state);
          if (data.candidate) this.candidate.set(data.candidate);
          if (data.difficulty) this.difficulty.set(data.difficulty);
        }
      } catch (e) { localStorage.removeItem(STORAGE_KEY); }
    }
  }

  registerCandidate(info: CandidateInfo, diff: Difficulty) {
    this.candidate.set(info);
    this.difficulty.set(diff);
    this.state.set('UPLOAD');
  }

  async analyzeDocumentAndPrepare(text: string): Promise<boolean> {
    this.context.set(text);
    
    const wordCount = text.split(' ').length;
    // Extreme mode = slightly longer exam
    const multiplier = this.difficulty() === 'EXTREME' ? 500 : 400; 
    const calculatedQuestions = Math.min(10, Math.max(3, Math.floor(wordCount / multiplier)));
    
    this.totalQuestionCount.set(calculatedQuestions);
    this.examDurationMinutes.set(Math.ceil(calculatedQuestions * 1.5));

    try {
        // Pass difficulty to generation
        const firstQ = await this.gemini.generateNextQuestion(text, null, this.difficulty());
        this.questions.set([{ id: 1, ...firstQ }]);
        this.currentQuestionIndex.set(0);
        this.streak.set(0);
        this.cheatStrikes.set(0);
        this.state.set('INSTRUCTIONS'); 
        return true;
    } catch (e) {
        console.error("Analysis Failed", e);
        return false;
    }
  }

  beginInterview() {
    this.state.set('INTERVIEW');
    const firstName = this.candidate().name.split(' ')[0];
    const diffText = this.difficulty() === 'EXTREME' ? 'strict' : 'standard';
    
    this.speak(`Welcome, ${firstName}. Initializing ${diffText} assessment protocols. Good luck.`, 'NEUTRAL');
    
    setTimeout(() => {
        if (this.questions().length > 0) {
           this.speak(this.questions()[0].question, 'NEUTRAL');
        }
    }, 5000);
  }

  triggerCheatFlag(reason: string) {
    if (this.state() !== 'INTERVIEW') return;
    
    // Extreme Mode: Stricter Strikes
    const penalty = this.difficulty() === 'EXTREME' ? 1.5 : 1; 
    
    this.cheatStrikes.update(s => s + penalty);
    this.isCheating.set(true);
    this.suspiciousObject.set(reason);
    
    const warningMsg = `Proctor Alert. ${reason}. Focus on the screen.`;
    this.speak(warningMsg, 'SERIOUS');

    if (this.cheatStrikes() >= 3) {
        setTimeout(() => {
            this.state.set('DISQUALIFIED');
            this.speak("Examination Terminated. Integrity Threshold Breached.", 'SERIOUS');
        }, 3000);
    }
    setTimeout(() => {
        this.isCheating.set(false);
        this.suspiciousObject.set('');
    }, 4000);
  }

  async submitAnswer(answer: string): Promise<number> {
    const q = this.currentQuestion();
    window.speechSynthesis.cancel(); 

    // Pass difficulty to grader
    const result = await this.gemini.gradeAnswer(q.question, answer, this.context(), this.difficulty());
    
    const isGood = result.score >= 7;
    this.feedbackState.set(isGood ? 'CORRECT' : 'INCORRECT');
    setTimeout(() => this.feedbackState.set('IDLE'), 1000);

    if (isGood) this.streak.update(s => s + 1);
    else this.streak.set(0);

    this.questions.update(qs => {
      const newQs = [...qs];
      newQs[this.currentQuestionIndex()] = {
        ...q,
        userAnswer: answer,
        score: result.score,
        feedback: result.feedback,
        futureAdvice: result.futureAdvice,
        managementSummary: result.managementSummary
      };
      return newQs;
    });

    // Voice Feedback
    let emotion: 'HAPPY' | 'NEUTRAL' | 'SERIOUS' | 'DISAPPOINTED' | 'ENCOURAGING' = 'NEUTRAL';
    const firstName = this.candidate().name.split(' ')[0];

    if (result.score >= 9) emotion = 'HAPPY';
    else if (result.score >= 7) emotion = 'ENCOURAGING';
    else if (result.score >= 4) emotion = 'NEUTRAL';
    else emotion = 'SERIOUS';

    const cleanFeedback = (result.feedback || "").replace(/\*/g, '').replace(/\n/g, ' ');
    // Speak only the first sentence to keep flow fast
    const spokenFeedback = cleanFeedback.split('.')[0] + '.'; 
    
    this.speak(`${spokenFeedback}`, emotion);

    this.handleTransition(result.score, q.question, answer);
    return result.score;
  }

  private async handleTransition(score: number, topic: string, answer: string) {
    await new Promise(r => setTimeout(r, 5000)); // Short pause for feedback reading

    if (this.questions().length < this.totalQuestionCount()) {
        try {
            // Adaptive: If score is high, next question is harder (handled by GeminiService prompt logic)
            const nextQData = await this.gemini.generateNextQuestion(
                this.context(), 
                { score, topic, answer },
                this.difficulty()
            );
            
            this.questions.update(qs => [...qs, { id: qs.length + 1, ...nextQData }]);
            this.currentQuestionIndex.update(i => i + 1);
            
            this.speak(nextQData.question, 'NEUTRAL');

        } catch (err) { console.error(err); }
    } else {
      this.state.set('REPORT');
      this.speak("Assessment complete. Generating final evaluation.", 'HAPPY');
      try {
          const report = await this.gemini.generateFinalReport(this.questions(), this.context());
          this.finalReport.set(report);
      } catch (e) { this.finalReport.set("Summary Unavailable."); }
    }
  }

  downloadExcelReport() {
    if (typeof XLSX === 'undefined') return;
    const ws_data: any[][] = [
        ["LexiVitae Exam Report"],
        ["Candidate", this.candidate().name],
        ["Difficulty", this.difficulty()],
        ["Score", `${this.totalScore()}/10`],
        [],
        ["Question", "Type", "Answer", "Score", "Feedback", "Advice"]
    ];
    this.questions().forEach(q => ws_data.push([
        q.question, q.type, q.userAnswer || "", q.score || 0, q.feedback || "", q.futureAdvice || ""
    ]));
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, `LexiVitae_${this.candidate().name}.xlsx`);
  }

  speak(text: string, emotion: 'HAPPY' | 'NEUTRAL' | 'SERIOUS' | 'DISAPPOINTED' | 'ENCOURAGING') {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Priority: Edge/Windows Natural > Google > Default
    let selectedVoice = voices.find(v => v.name.includes('Microsoft Christopher Online')); // Very professional male
    if (!selectedVoice) selectedVoice = voices.find(v => v.name.includes('Microsoft Jenny Online')); // Professional female
    if (!selectedVoice) selectedVoice = voices.find(v => v.name.includes('Google US English'));
    
    if (selectedVoice) utterance.voice = selectedVoice;

    // Prosody Tuning
    switch (emotion) {
        case 'HAPPY': utterance.rate = 1.1; utterance.pitch = 1.1; break;
        case 'ENCOURAGING': utterance.rate = 1.0; utterance.pitch = 1.05; break;
        case 'SERIOUS': utterance.rate = 0.95; utterance.pitch = 0.9; break; // Authoritative
        case 'DISAPPOINTED': utterance.rate = 0.9; utterance.pitch = 0.85; break;
        case 'NEUTRAL': default: utterance.rate = 1.05; utterance.pitch = 1.0; break;
    }

    utterance.onstart = () => this.isSpeaking.set(true);
    utterance.onend = () => this.isSpeaking.set(false);
    window.speechSynthesis.speak(utterance);
  }

  reset() {
    window.speechSynthesis.cancel();
    this.state.set('LANDING');
    this.questions.set([]);
    this.cheatStrikes.set(0);
    this.candidate.set({ name: '', email: '', role: '', id: '' });
    localStorage.removeItem(STORAGE_KEY);
  }

  introduce() {
    this.speak("System Online. Please verify your credentials.", 'NEUTRAL');
  }

  goToCandidateForm() {
    this.state.set('CANDIDATE_FORM');
  }
}
