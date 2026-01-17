import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivaService } from '../services/viva.service';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex items-center justify-center p-4">
      <div class="fluent-card w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl animate-fade-in border border-white/10">
        
        <!-- Left: Candidate Profile -->
        <div class="w-full md:w-1/3 bg-black/40 border-r border-white/10 p-8 flex flex-col relative">
            <div class="absolute inset-0 bg-ms-blue/5"></div>
            
            <div class="relative z-10 text-center">
                <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-white/10 flex items-center justify-center mb-6 shadow-xl">
                    <span class="material-icons text-6xl text-gray-400">person</span>
                </div>
                <h2 class="text-2xl font-bold text-white mb-1 font-heading">{{ viva.candidate().name }}</h2>
                <div class="text-sm text-gray-400 font-mono mb-6">ID: {{ viva.candidate().id }}</div>
                
                <div class="bg-white/5 rounded-xl p-4 text-left space-y-3 border border-white/5">
                    <div class="flex justify-between text-xs">
                        <span class="text-gray-500">ROLE</span>
                        <span class="text-white font-bold">{{ viva.candidate().role }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                        <span class="text-gray-500">EXAM ID</span>
                        <span class="text-white font-bold">LX-{{ getDateStr() }}</span>
                    </div>
                    <div class="flex justify-between text-xs">
                        <span class="text-gray-500">SYSTEM</span>
                        <span class="text-success font-bold">ONLINE</span>
                    </div>
                </div>
            </div>
            
            <div class="mt-auto relative z-10">
                <div class="text-[10px] text-gray-500 text-center uppercase tracking-widest">LexiVitae Proctoring v3.0</div>
            </div>
        </div>

        <!-- Right: Rules & Instructions -->
        <div class="w-full md:w-2/3 p-8 md:p-12 flex flex-col bg-gradient-to-br from-gray-900 to-black relative">
            <div class="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-academic-gold">
                    <span class="material-icons text-2xl">gavel</span>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-white font-heading">General Instructions</h1>
                    <p class="text-gray-400 text-sm">Please read the following guidelines carefully.</p>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
                <div class="flex gap-4">
                    <span class="text-ms-blue font-bold font-mono text-lg">01</span>
                    <p class="text-gray-300 text-sm leading-relaxed">The examination consists of <strong class="text-white">{{ viva.totalQuestionCount() }} questions</strong>. The estimated duration is <strong class="text-white">{{ viva.examDurationMinutes() }} minutes</strong>.</p>
                </div>
                <div class="flex gap-4">
                    <span class="text-ms-blue font-bold font-mono text-lg">02</span>
                    <p class="text-gray-300 text-sm leading-relaxed">Questions are dynamically generated from your uploaded context. Answers must be precise. "Fluff" will negatively impact your score.</p>
                </div>
                <div class="flex gap-4">
                    <span class="text-ms-blue font-bold font-mono text-lg">03</span>
                    <p class="text-gray-300 text-sm leading-relaxed"><strong class="text-danger">STRICT PROCTORING:</strong> The system monitors tab switching, multiple faces, and object detection (phones). 3 Strikes will result in immediate disqualification.</p>
                </div>
                <div class="flex gap-4">
                    <span class="text-ms-blue font-bold font-mono text-lg">04</span>
                    <p class="text-gray-300 text-sm leading-relaxed">Ensure your microphone allows permissions. You may type or speak your answers. Speaking is recommended for higher engagement.</p>
                </div>
            </div>

            <!-- Agreement & Action -->
            <div class="mt-8 pt-6 border-t border-white/10">
                <div class="flex items-center gap-3 mb-6 cursor-pointer" (click)="toggleAgreement()">
                    <div class="w-6 h-6 rounded border border-white/30 flex items-center justify-center transition-colors" 
                         [class.bg-ms-blue]="agreed()" [class.border-ms-blue]="agreed()">
                        @if (agreed()) { <span class="material-icons text-sm text-white">check</span> }
                    </div>
                    <span class="text-sm text-gray-400 select-none">I have read and understood the instructions.</span>
                </div>

                <button (click)="startExam()" [disabled]="!agreed()"
                    class="w-full py-4 bg-ms-blue hover:bg-ms-blue-hover text-white font-bold rounded-xl shadow-glow-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-3 text-lg">
                    <span>Begin Examination</span>
                    <span class="material-icons">login</span>
                </button>
            </div>
        </div>

      </div>
    </div>
  `
})
export class InstructionsComponent {
  viva = inject(VivaService);
  agreed = signal(false);

  toggleAgreement() {
    this.agreed.update(v => !v);
  }

  getDateStr() {
    return new Date().toLocaleDateString().replace(/\//g, '');
  }

  startExam() {
    if (this.agreed()) {
        this.viva.beginInterview();
    }
  }
}
