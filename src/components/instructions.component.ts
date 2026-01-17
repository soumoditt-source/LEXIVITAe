import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivaService } from '../services/viva.service';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex items-center justify-center p-2 md:p-4">
      <div class="fluent-card w-full max-w-5xl h-full md:h-[85vh] rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl animate-fade-in border border-white/10">
        
        <!-- Left: Candidate Profile (Top on mobile) -->
        <div class="w-full md:w-1/3 bg-black/40 border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-row md:flex-col items-center md:items-stretch gap-6 relative shrink-0">
            <div class="absolute inset-0 bg-ms-blue/5"></div>
            
            <div class="relative z-10 text-center md:text-center flex-1 md:flex-none">
                <div class="w-16 h-16 md:w-32 md:h-32 mx-auto md:mb-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 md:border-4 border-white/10 flex items-center justify-center shadow-xl float-left md:float-none mr-4 md:mr-0">
                    <span class="material-icons text-2xl md:text-6xl text-gray-400">person</span>
                </div>
                
                <div class="text-left md:text-center pt-1 md:pt-0">
                    <h2 class="text-xl md:text-2xl font-bold text-white mb-1 font-heading truncate">{{ viva.candidate().name }}</h2>
                    <div class="text-xs md:text-sm text-gray-400 font-mono md:mb-6">ID: {{ viva.candidate().id }}</div>
                </div>

                <div class="hidden md:block bg-white/5 rounded-xl p-4 text-left space-y-3 border border-white/5">
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
            
            <div class="hidden md:block mt-auto relative z-10">
                <div class="text-[10px] text-gray-500 text-center uppercase tracking-widest">LexiVitae Proctoring v3.1</div>
            </div>
        </div>

        <!-- Right: Rules & Instructions -->
        <div class="w-full md:w-2/3 p-6 md:p-12 flex flex-col bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
            <div class="flex items-center gap-3 md:gap-4 mb-4 md:mb-8 border-b border-white/10 pb-4 md:pb-6 shrink-0">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-lg flex items-center justify-center text-academic-gold">
                    <span class="material-icons text-xl md:text-2xl">gavel</span>
                </div>
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-white font-heading">Instructions</h1>
                    <p class="text-gray-400 text-xs md:text-sm">Read carefully before proceeding.</p>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 md:space-y-6">
                <div class="flex gap-3 md:gap-4">
                    <span class="text-ms-blue font-bold font-mono text-base md:text-lg">01</span>
                    <p class="text-gray-300 text-xs md:text-sm leading-relaxed">The examination consists of <strong class="text-white">{{ viva.totalQuestionCount() }} questions</strong>. Estimated duration: <strong class="text-white">{{ viva.examDurationMinutes() }} minutes</strong>.</p>
                </div>
                <div class="flex gap-3 md:gap-4">
                    <span class="text-ms-blue font-bold font-mono text-base md:text-lg">02</span>
                    <p class="text-gray-300 text-xs md:text-sm leading-relaxed">Questions are dynamically generated. Answers must be precise. "Fluff" will negatively impact your score.</p>
                </div>
                <div class="flex gap-3 md:gap-4">
                    <span class="text-ms-blue font-bold font-mono text-base md:text-lg">03</span>
                    <p class="text-gray-300 text-xs md:text-sm leading-relaxed"><strong class="text-danger">STRICT PROCTORING:</strong> The system monitors tab switching, multiple faces, and object detection. 3 Strikes = Disqualification.</p>
                </div>
                <div class="flex gap-3 md:gap-4">
                    <span class="text-ms-blue font-bold font-mono text-base md:text-lg">04</span>
                    <p class="text-gray-300 text-xs md:text-sm leading-relaxed">Ensure microphone permissions are active. Speaking is recommended for higher engagement scores.</p>
                </div>
            </div>

            <!-- Agreement & Action -->
            <div class="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-white/10 shrink-0">
                <div class="flex items-center gap-3 mb-4 md:mb-6 cursor-pointer" (click)="toggleAgreement()">
                    <div class="w-6 h-6 rounded border border-white/30 flex items-center justify-center transition-colors" 
                         [class.bg-ms-blue]="agreed()" [class.border-ms-blue]="agreed()">
                        @if (agreed()) { <span class="material-icons text-sm text-white">check</span> }
                    </div>
                    <span class="text-xs md:text-sm text-gray-400 select-none">I have read and understood the instructions.</span>
                </div>

                <button (click)="startExam()" [disabled]="!agreed()"
                    class="w-full py-3 md:py-4 bg-ms-blue hover:bg-ms-blue-hover text-white font-bold rounded-xl shadow-glow-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-3 text-sm md:text-lg">
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
  toggleAgreement() { this.agreed.update(v => !v); }
  getDateStr() { return new Date().toLocaleDateString().replace(/\//g, ''); }
  startExam() { if (this.agreed()) { this.viva.beginInterview(); } }
}
