import { Component, inject, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivaService } from '../services/viva.service';
import { ProctorService } from '../services/proctor.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interview',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col max-w-7xl mx-auto relative p-2 md:p-6 transition-colors duration-700"
         [class.bg-red-900_10]="proctorThreatLevel() > 0">
      
      <!-- SCAN LINES & FX -->
      <div class="scan-line"></div>
      <div class="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
      
      <!-- THREAT HUD -->
      @if (proctorThreatLevel() > 0) {
        <div class="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-50 animate-scale-in w-full px-4 md:w-auto">
           <div class="bg-black/90 backdrop-blur-xl border border-danger text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-full flex items-center justify-between md:justify-center gap-3 md:gap-4 shadow-[0_0_30px_rgba(209,52,56,0.6)]">
               <span class="material-icons text-danger animate-pulse">warning</span>
               <div class="flex flex-col">
                   <span class="text-[9px] md:text-[10px] font-bold text-danger tracking-widest uppercase">Integrity Alert</span>
                   <span class="text-xs font-mono truncate max-w-[150px]">{{ viva.suspiciousObject() || 'Suspicious Behavior' }}</span>
               </div>
               <div class="h-8 w-[1px] bg-white/20"></div>
               <div class="text-xl font-black text-danger">{{ viva.cheatStrikes() }}/3</div>
           </div>
        </div>
      }

      <!-- TERMINATION SCREEN -->
      @if (viva.state() === 'DISQUALIFIED') {
        <div class="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-fade-in text-center p-8 backdrop-blur-xl">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-danger flex items-center justify-center mb-6 md:mb-8 shadow-[0_0_50px_rgba(209,52,56,0.5)]">
                <span class="material-icons text-5xl md:text-6xl text-danger">block</span>
            </div>
            <h1 class="text-4xl md:text-6xl font-black text-white mb-4 font-heading tracking-tight">EXAM TERMINATED</h1>
            <p class="text-lg md:text-xl text-gray-400 font-mono mb-8 md:mb-10">Violations detected.</p>
            <button (click)="viva.reset()" class="px-8 md:px-10 py-3 md:py-4 bg-danger hover:bg-red-700 text-white transition-all font-bold rounded-xl tracking-widest uppercase shadow-lg text-sm md:text-base">Return to Lobby</button>
        </div>
      }

      <!-- RESPONSIVE HEADER GRID -->
      <div class="grid grid-cols-12 gap-3 mb-4 md:mb-6 z-20">
        <!-- Question Badge (Full width mobile, left col desktop) -->
        <div class="col-span-8 md:col-span-9 lg:col-span-9 fluent-card px-3 md:px-5 py-2 md:py-3 rounded-xl flex items-center gap-3 md:gap-4 border-l-4 border-ms-blue">
           <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-ms-blue to-blue-800 shadow-lg flex items-center justify-center font-bold text-white text-lg md:text-xl font-heading">
             {{ viva.currentQuestion().id }}
           </div>
           <div class="overflow-hidden">
             <div class="text-[8px] md:text-[9px] text-gray-400 font-mono uppercase tracking-widest mb-0.5">Phase</div>
             <div class="text-sm md:text-base font-bold text-white tracking-wide flex items-center gap-2 flex-wrap">
                <span class="truncate">{{ viva.currentQuestion().type.replace('_', ' ') }}</span>
                <span class="text-[8px] md:text-[9px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 font-mono" 
                      [class.text-success]="viva.currentQuestion().complexity === 'EASY'"
                      [class.text-academic-gold]="viva.currentQuestion().complexity === 'MEDIUM'"
                      [class.text-danger]="viva.currentQuestion().complexity === 'HARD'">
                    {{ viva.currentQuestion().complexity }}
                </span>
             </div>
           </div>
        </div>

        <!-- Camera (Small right col mobile, right col desktop) -->
        <div class="col-span-4 md:col-span-3 lg:col-span-3 relative h-14 md:h-32 bg-black rounded-lg overflow-hidden border border-white/10 shadow-lg group transition-all duration-300 hover:scale-105 hover:shadow-glow-blue z-30 hover:border-ms-blue hover:z-50">
             <video #videoElement autoplay playsinline muted class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"></video>
             <div class="absolute top-1 md:top-2 left-1 md:left-2 flex items-center gap-1 bg-black/50 px-1 md:px-1.5 py-0.5 rounded backdrop-blur-sm">
                 <span class="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                 <span class="text-[6px] md:text-[8px] font-mono text-white/80">REC</span>
             </div>
        </div>
      </div>

      <!-- MAIN INTERFACE -->
      <div class="flex-1 fluent-card rounded-2xl md:rounded-[2.5rem] p-4 md:p-12 mb-2 md:mb-4 relative overflow-y-auto custom-scrollbar flex flex-col shadow-fluent border-t border-white/10"
           [class.border-success]="viva.feedbackState() === 'CORRECT'"
           [class.border-danger]="viva.feedbackState() === 'INCORRECT'">
        
        <!-- Result Flash -->
        <div class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 bg-success/10" [class.opacity-100]="viva.feedbackState() === 'CORRECT'"></div>
        <div class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 bg-danger/10" [class.opacity-100]="viva.feedbackState() === 'INCORRECT'"></div>

        <!-- Question Area -->
        <div class="relative z-10 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full min-h-[50vh]">
            
            <div class="mb-4 md:mb-6 flex justify-center">
                 <div class="bg-black/30 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-white/10 text-[9px] md:text-[10px] text-ms-blue uppercase tracking-widest font-bold flex items-center gap-2 shadow-sm text-center">
                   <span class="material-icons text-xs">lightbulb</span> Hint: {{ viva.currentQuestion().hint }}
                </div>
            </div>

            <h2 class="text-xl md:text-3xl lg:text-5xl font-bold text-white text-center leading-tight drop-shadow-xl mb-6 md:mb-10 font-heading">
               {{ viva.currentQuestion().question }}
            </h2>
            
            <!-- INPUT AREA -->
            <div class="w-full animate-fade-in pb-4">
                
                <!-- MCQ INTERFACE -->
                @if (viva.currentQuestion().type === 'MCQ') {
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                        @for (opt of viva.currentQuestion().options; track $index) {
                            <button (click)="selectOption(opt)" [disabled]="isProcessing()" 
                                    class="relative overflow-hidden p-4 md:p-5 rounded-xl border text-left transition-all duration-200 group active:scale-[0.98] min-h-[60px]"
                                    [class.bg-ms-blue]="selectedOption() === opt"
                                    [class.border-ms-blue]="selectedOption() === opt"
                                    [class.shadow-glow-blue]="selectedOption() === opt"
                                    [class.bg-white_5]="selectedOption() !== opt"
                                    [class.border-white_10]="selectedOption() !== opt"
                                    [class.hover-bg-white_10]="selectedOption() !== opt">
                                
                                <div class="flex items-center gap-3 md:gap-4">
                                    <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-mono text-xs md:text-sm font-bold transition-colors shrink-0"
                                         [class.bg-white]="selectedOption() === opt"
                                         [class.text-ms-blue]="selectedOption() === opt"
                                         [class.bg-white_10]="selectedOption() !== opt">
                                        {{ ['A','B','C','D'][$index] }}
                                    </div>
                                    <span class="text-sm md:text-lg font-medium leading-snug" [class.text-white]="true">{{ opt }}</span>
                                </div>
                            </button>
                        }
                    </div>
                    
                    <div class="text-center h-14 md:h-16">
                        @if (selectedOption()) {
                            <button (click)="lockAndSubmitMCQ()" [disabled]="isProcessing()"
                                class="px-6 md:px-8 py-3 bg-white text-ms-blue font-bold rounded-xl shadow-glow-blue hover:bg-gray-100 transition-all animate-scale-in flex items-center gap-2 mx-auto text-sm md:text-base">
                                <span>LOCK ANSWER</span>
                                <span class="material-icons text-sm">lock</span>
                            </button>
                        }
                    </div>
                } 
                
                <!-- DUAL MODE INPUT (TEXT / VOICE) -->
                @else {
                    <div class="fluent-card bg-black/40 rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden transition-all duration-300">
                        
                        <!-- Input Mode Toggles -->
                        <div class="flex border-b border-white/10 bg-black/20">
                            <button (click)="setInputMode('KEYBOARD')" class="flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors hover:bg-white/5 active:bg-white/10"
                                [class.text-ms-blue]="inputMode() === 'KEYBOARD'"
                                [class.text-gray-500]="inputMode() !== 'KEYBOARD'"
                                [class.bg-white_5]="inputMode() === 'KEYBOARD'">
                                <span class="material-icons text-base">keyboard</span> Type
                            </button>
                            <div class="w-px bg-white/10"></div>
                            <button (click)="setInputMode('VOICE')" class="flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors hover:bg-white/5 active:bg-white/10"
                                [class.text-ms-blue]="inputMode() === 'VOICE'"
                                [class.text-gray-500]="inputMode() !== 'VOICE'"
                                [class.bg-white_5]="inputMode() === 'VOICE'">
                                <span class="material-icons text-base">mic</span> Voice
                            </button>
                        </div>

                        <!-- Content Area -->
                        <div class="relative min-h-[180px] md:min-h-[220px]">
                            
                            <!-- KEYBOARD MODE -->
                            @if (inputMode() === 'KEYBOARD') {
                                <textarea #answerInput [(ngModel)]="textInput" (keydown.enter.prevent)="submitText()"
                                    [placeholder]="viva.currentQuestion().type === 'PARAGRAPH' ? 'Explain your reasoning in detail...' : 'Type your answer...'"
                                    class="w-full h-[180px] md:h-[220px] bg-transparent border-none outline-none text-white placeholder-white/20 font-sans text-base md:text-xl p-4 md:p-6 resize-none custom-scrollbar leading-relaxed animate-fade-in"
                                    [disabled]="isProcessing()"></textarea>
                            }

                            <!-- VOICE MODE -->
                            @if (inputMode() === 'VOICE') {
                                <div class="absolute inset-0 flex flex-col items-center justify-center animate-fade-in p-4 md:p-6">
                                    
                                    <!-- Transcript View -->
                                    <div class="w-full text-center mb-6 md:mb-8 h-20 md:h-24 overflow-y-auto custom-scrollbar flex items-center justify-center">
                                        @if (!textInput) {
                                            <span class="text-white/20 text-base md:text-lg font-light">Tap the microphone and speak...</span>
                                        } @else {
                                            <span class="text-white text-lg md:text-xl font-medium leading-relaxed">"{{ textInput }}"</span>
                                        }
                                    </div>

                                    <!-- Mic Button -->
                                    <button (click)="toggleRecording()" 
                                        class="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg relative group active:scale-95"
                                        [class.bg-danger]="isListening()"
                                        [class.shadow-glow-red]="isListening()"
                                        [class.bg-white_10]="!isListening()"
                                        [class.hover-bg-white_20]="!isListening()">
                                        
                                        @if(isListening()) {
                                            <div class="absolute inset-0 rounded-full border border-danger opacity-50 animate-[ping_1.5s_infinite]"></div>
                                            <div class="absolute inset-0 rounded-full border border-danger opacity-30 animate-[ping_2s_infinite]"></div>
                                        }
                                        
                                        <span class="material-icons text-2xl md:text-3xl" [class.text-white]="isListening()" [class.text-gray-400]="!isListening()">
                                            {{ isListening() ? 'stop' : 'mic' }}
                                        </span>
                                    </button>
                                    
                                    <div class="mt-4 text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                                        {{ isListening() ? 'Listening... Tap to Stop' : 'Ready' }}
                                    </div>
                                </div>
                            }
                        </div>

                        <!-- Footer Actions -->
                        <div class="flex justify-end items-center p-3 md:p-4 border-t border-white/10 bg-black/20">
                            <button (click)="submitText()" [disabled]="!textInput.trim() || isProcessing()"
                                class="px-6 md:px-8 py-3 rounded-xl bg-ms-blue text-white font-bold hover:bg-ms-blue-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95 flex items-center gap-2 group text-sm md:text-base w-full md:w-auto justify-center">
                                <span>SUBMIT ANSWER</span>
                                <span class="material-icons text-sm group-hover:translate-x-1 transition-transform">send</span>
                            </button>
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
  
  inputMode = signal<'KEYBOARD' | 'VOICE'>('KEYBOARD');
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

  constructor() { this.initSpeech(); }
  
  setInputMode(mode: 'KEYBOARD' | 'VOICE') {
    this.inputMode.set(mode);
    if (mode === 'KEYBOARD' && this.isListening()) {
        this.toggleRecording();
    }
    if (mode === 'KEYBOARD') {
        setTimeout(() => this.answerInput?.nativeElement?.focus(), 100);
    }
  }

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange() {
    if (document.hidden) this.viva.triggerCheatFlag('Tab Switching');
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
      this.recognition.continuous = true; 
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (e: any) => {
          let finalTranscript = '';
          for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript;
          }
          if (finalTranscript) {
              this.textInput = (this.textInput + ' ' + finalTranscript).trim(); 
          }
      };
      this.recognition.onerror = (e: any) => { this.isListening.set(false); };
      this.recognition.onend = () => {
          if (this.isListening()) { try { this.recognition.start(); } catch(e) { this.isListening.set(false); } }
      };
    }
  }

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
  
  submitText() { if(this.textInput.trim()) this.submitAnswer(this.textInput); }
  
  async submitAnswer(text: string) {
    if (this.isProcessing()) return;
    this.isListening.set(false); 
    if (this.recognition) this.recognition.stop();
    this.isProcessing.set(true);
    await this.viva.submitAnswer(text); 
    this.textInput = '';
    this.isProcessing.set(false);
  }
}
