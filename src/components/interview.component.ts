import { Component, inject, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivaService } from '../services/viva.service';
import { ProctorService } from '../services/proctor.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interview',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col max-w-7xl mx-auto relative p-4 md:p-6 transition-colors duration-700"
         [class.bg-red-900_10]="proctorThreatLevel() > 0">
      
      <!-- SCAN LINES -->
      <div class="scan-line"></div>
      
      <!-- THREAT HUD -->
      @if (proctorThreatLevel() > 0) {
        <div class="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
           <div class="bg-black/90 backdrop-blur-xl border border-danger text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-[0_0_30px_rgba(209,52,56,0.6)]">
               <span class="material-icons text-danger animate-pulse">warning</span>
               <div class="flex flex-col">
                   <span class="text-[10px] font-bold text-danger tracking-widest uppercase">Integrity Alert</span>
                   <span class="text-xs font-mono">{{ viva.suspiciousObject() || 'Suspicious Behavior' }}</span>
               </div>
               <div class="h-8 w-[1px] bg-white/20"></div>
               <div class="text-xl font-black text-danger">{{ viva.cheatStrikes() }}/3</div>
           </div>
        </div>
      }

      <!-- TERMINATION SCREEN -->
      @if (viva.state() === 'DISQUALIFIED') {
        <div class="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-fade-in text-center p-8 backdrop-blur-xl">
            <div class="w-32 h-32 rounded-full border-4 border-danger flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(209,52,56,0.5)]">
                <span class="material-icons text-6xl text-danger">block</span>
            </div>
            <h1 class="text-6xl font-black text-white mb-4 font-heading tracking-tight">EXAM TERMINATED</h1>
            <p class="text-xl text-gray-400 font-mono mb-10">Multiple proctoring violations detected.</p>
            <button (click)="viva.reset()" class="px-10 py-4 bg-danger hover:bg-red-700 text-white transition-all font-bold rounded-xl tracking-widest uppercase shadow-lg">Return to Lobby</button>
        </div>
      }

      <!-- HEADER -->
      <div class="flex justify-between items-start mb-6 z-20 gap-4">
        <!-- Question Badge -->
        <div class="fluent-card px-5 py-3 rounded-xl flex items-center gap-4 border-l-4 border-ms-blue min-w-[280px]">
           <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-ms-blue to-blue-800 shadow-lg flex items-center justify-center font-bold text-white text-xl font-heading">
             {{ viva.currentQuestion().id }}
           </div>
           <div>
             <div class="text-[9px] text-gray-400 font-mono uppercase tracking-widest mb-0.5">Assessment Phase</div>
             <div class="text-base font-bold text-white tracking-wide flex items-center gap-2">
                {{ viva.currentQuestion().type.replace('_', ' ') }}
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 font-mono" 
                      [class.text-success]="viva.currentQuestion().complexity === 'EASY'"
                      [class.text-academic-gold]="viva.currentQuestion().complexity === 'MEDIUM'"
                      [class.text-danger]="viva.currentQuestion().complexity === 'HARD'">
                    {{ viva.currentQuestion().complexity }}
                </span>
             </div>
           </div>
        </div>

        <!-- Camera -->
        <div class="relative w-48 h-32 bg-black rounded-lg overflow-hidden border border-white/10 shadow-lg group transition-all duration-300 hover:scale-105 hover:shadow-glow-blue z-30 hover:border-ms-blue hover:z-50">
             <video #videoElement autoplay playsinline muted class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"></video>
             <div class="absolute top-2 left-2 flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                 <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                 <span class="text-[8px] font-mono text-white/80">LIVE</span>
             </div>
        </div>
      </div>

      <!-- MAIN INTERFACE -->
      <div class="flex-1 fluent-card rounded-[2.5rem] p-6 md:p-12 mb-4 relative overflow-hidden flex flex-col shadow-fluent border-t border-white/10"
           [class.border-success]="viva.feedbackState() === 'CORRECT'"
           [class.border-danger]="viva.feedbackState() === 'INCORRECT'">
        
        <!-- Result Flash -->
        <div class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 bg-success/10" [class.opacity-100]="viva.feedbackState() === 'CORRECT'"></div>
        <div class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 bg-danger/10" [class.opacity-100]="viva.feedbackState() === 'INCORRECT'"></div>

        <!-- Question Area -->
        <div class="relative z-10 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
            
            <div class="mb-8 flex justify-center">
                 <div class="bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[10px] text-ms-blue uppercase tracking-widest font-bold flex items-center gap-2 shadow-sm">
                   <span class="material-icons text-xs">lightbulb</span> Hint: {{ viva.currentQuestion().hint }}
                </div>
            </div>

            <h2 class="text-3xl md:text-5xl font-bold text-white text-center leading-[1.1] drop-shadow-xl mb-12 font-heading">
               {{ viva.currentQuestion().question }}
            </h2>
            
            <!-- INPUT AREA -->
            <div class="w-full">
                
                <!-- MCQ INTERFACE -->
                @if (viva.currentQuestion().type === 'MCQ') {
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in mb-8">
                        @for (opt of viva.currentQuestion().options; track $index) {
                            <button (click)="selectOption(opt)" [disabled]="isProcessing()" 
                                    class="relative overflow-hidden p-5 rounded-xl border text-left transition-all duration-200 group active:scale-[0.99]"
                                    [class.bg-ms-blue]="selectedOption() === opt"
                                    [class.border-ms-blue]="selectedOption() === opt"
                                    [class.shadow-glow-blue]="selectedOption() === opt"
                                    [class.bg-white_5]="selectedOption() !== opt"
                                    [class.border-white_10]="selectedOption() !== opt"
                                    [class.hover-bg-white_10]="selectedOption() !== opt">
                                
                                <div class="flex items-center gap-4">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-colors"
                                         [class.bg-white]="selectedOption() === opt"
                                         [class.text-ms-blue]="selectedOption() === opt"
                                         [class.bg-white_10]="selectedOption() !== opt">
                                        {{ ['A','B','C','D'][$index] }}
                                    </div>
                                    <span class="text-lg font-medium" [class.text-white]="true">{{ opt }}</span>
                                </div>
                            </button>
                        }
                    </div>
                    
                    <!-- Confirm Button for MCQ -->
                    <div class="text-center h-16">
                        @if (selectedOption()) {
                            <button (click)="lockAndSubmitMCQ()" [disabled]="isProcessing()"
                                class="px-8 py-3 bg-white text-ms-blue font-bold rounded-xl shadow-glow-blue hover:bg-gray-100 transition-all animate-scale-in flex items-center gap-2 mx-auto">
                                <span>LOCK ANSWER</span>
                                <span class="material-icons">lock</span>
                            </button>
                        }
                    </div>
                } 
                
                <!-- TEXT/VOICE INTERFACE (Enhanced for Long Answers) -->
                @else {
                    <div class="animate-fade-in relative max-w-3xl mx-auto">
                         <div class="fluent-card bg-black/40 rounded-2xl p-4 border border-white/20 shadow-2xl transition-all duration-300 focus-within:border-ms-blue focus-within:shadow-glow-blue relative overflow-hidden">
                             
                             <textarea #answerInput [(ngModel)]="textInput" (keydown.enter.prevent)="submitText()"
                                [placeholder]="isListening() ? 'Listening to your answer...' : (viva.currentQuestion().type === 'PARAGRAPH' ? 'Explain your reasoning in detail...' : 'Type your answer...')"
                                class="w-full bg-transparent border-none outline-none text-white placeholder-white/30 font-sans text-xl p-2 min-h-[140px] resize-none custom-scrollbar leading-relaxed transition-all"
                                [class.opacity-50]="isListening()"
                                [disabled]="isProcessing()"></textarea>
                             
                             <!-- Voice Visualizer Overlay -->
                             @if(isListening()) {
                                <div class="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
                                    <div class="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-ms-blue/50 flex items-center gap-3 shadow-[0_0_20px_rgba(0,120,212,0.3)] animate-fadeIn">
                                        <div class="flex gap-1 items-center h-4">
                                            <div class="w-1 bg-ms-blue rounded-full animate-[float_0.3s_infinite] h-full"></div>
                                            <div class="w-1 bg-ms-blue rounded-full animate-[float_0.5s_infinite] h-3/4"></div>
                                            <div class="w-1 bg-ms-blue rounded-full animate-[float_0.4s_infinite] h-full"></div>
                                        </div>
                                        <span class="text-ms-blue font-mono text-xs font-bold uppercase tracking-wider">Recording... Tap mic to stop</span>
                                    </div>
                                </div>
                             }

                             <div class="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                                 <!-- Mic Button Toggle -->
                                 <button (click)="toggleRecording()"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors group"
                                    [class.text-danger]="isListening()"
                                    [class.text-white_60]="!isListening()">
                                    <div class="relative">
                                        <span class="material-icons group-hover:scale-110 transition-transform">{{ isListening() ? 'mic' : 'mic_none' }}</span>
                                        @if(isListening()) {
                                            <div class="absolute inset-0 bg-danger/50 rounded-full animate-ping"></div>
                                        }
                                    </div>
                                    <span class="text-xs font-bold uppercase tracking-wider">{{ isListening() ? 'Stop & Review' : 'Voice Input' }}</span>
                                 </button>
                                 
                                 <button (click)="submitText()" [disabled]="!textInput.trim() || isProcessing()"
                                    class="px-6 py-2 rounded-xl bg-ms-blue text-white font-bold hover:bg-ms-blue-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95 flex items-center gap-2">
                                    <span>SUBMIT</span>
                                    <span class="material-icons text-sm">send</span>
                                 </button>
                             </div>
                         </div>
                    </div>
                }
            </div>
        </div>
      </div>
    </div>
  `
})
export class InterviewComponent implements AfterViewInit, OnDestroy {
  viva = inject(VivaService);
  proctor = inject(ProctorService);
  
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('answerInput') answerInput!: ElementRef;
  
  isListening = signal(false);
  isProcessing = signal(false);
  textInput = '';
  selectedOption = signal<string | null>(null);
  
  recognition: any;
  stream: MediaStream | null = null;
  detectionInterval: any;
  
  proctorThreatLevel = computed(() => {
    if (this.viva.isCheating()) return 2; 
    if (this.proctor.detections().some(d => d.includes('cell phone') || d.includes('book'))) return 1; 
    return 0;
  });

  constructor() {
    this.initSpeech();
  }

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange() {
    if (document.hidden) {
        this.viva.triggerCheatFlag('Tab Switching');
    }
  }

  async ngAfterViewInit() {
    await this.startCamera();
    await this.proctor.loadModel();
    this.startDetectionLoop();
  }

  ngOnDestroy() {
    if (this.stream) this.stream.getTracks().forEach(track => track.stop());
    clearInterval(this.detectionInterval);
    if (this.recognition) this.recognition.stop();
  }

  async startCamera() {
    try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.videoElement.nativeElement.srcObject = this.stream;
    } catch (err) { console.error("Camera error", err); }
  }

  startDetectionLoop() {
    this.detectionInterval = setInterval(async () => {
        if (this.videoElement?.nativeElement && this.viva.state() === 'INTERVIEW') {
            const hasForbiddenObject = await this.proctor.detect(this.videoElement.nativeElement);
            if (hasForbiddenObject && !this.viva.isCheating()) {
                this.viva.triggerCheatFlag('Prohibited Object');
            }
        }
    }, 1000); 
  }

  initSpeech() {
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore
      this.recognition = new webkitSpeechRecognition();
      // Enable continuous mode for long answers
      this.recognition.continuous = true; 
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (e: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) {
              finalTranscript += e.results[i][0].transcript;
            } else {
              interimTranscript += e.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
              // Append with a space if needed
              this.textInput = (this.textInput + ' ' + finalTranscript).trim(); 
              this.scrollToBottom();
          }
      };

      this.recognition.onerror = (e: any) => {
          console.error('Voice Error', e);
          this.isListening.set(false);
      };

      // Auto-restart if it stops but we didn't click stop (unless error)
      this.recognition.onend = () => {
          if (this.isListening()) {
             try { this.recognition.start(); } catch(e) { this.isListening.set(false); }
          }
      };
    }
  }

  scrollToBottom() {
      setTimeout(() => {
          if (this.answerInput) {
              this.answerInput.nativeElement.scrollTop = this.answerInput.nativeElement.scrollHeight;
          }
      }, 100);
  }

  // --- INTERACTION HANDLERS ---

  toggleRecording() {
      if (this.isListening()) {
          this.isListening.set(false);
          this.recognition.stop();
      } else {
          this.isListening.set(true);
          try { this.recognition.start(); } catch(e) { console.error(e); }
      }
  }

  selectOption(opt: string) {
      if (this.isProcessing()) return;
      this.selectedOption.set(opt);
  }

  async lockAndSubmitMCQ() {
      const ans = this.selectedOption();
      if (!ans || this.isProcessing()) return;
      this.isProcessing.set(true);
      await this.viva.submitAnswer(ans);
      this.selectedOption.set(null);
      this.isProcessing.set(false);
  }
  
  submitText() { 
      if(this.textInput.trim()) this.submitAnswer(this.textInput); 
  }
  
  async submitAnswer(text: string) {
    if (this.isProcessing()) return;
    this.isListening.set(false); // Ensure mic is off
    if (this.recognition) this.recognition.stop();
    
    this.isProcessing.set(true);
    await this.viva.submitAnswer(text); 
    this.textInput = '';
    this.isProcessing.set(false);
  }
}
