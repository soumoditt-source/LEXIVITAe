import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivaService } from '../services/viva.service';

@Component({
  selector: 'app-report',
  imports: [CommonModule],
  template: `
    <div class="h-full overflow-y-auto p-4 max-w-5xl mx-auto custom-scrollbar">
      
      <!-- Top Actions -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl md:text-2xl font-bold text-white font-heading">Final Evaluation</h1>
        <button (click)="viva.downloadExcelReport()" class="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-success hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base">
            <span class="material-icons text-sm md:text-base">table_view</span> 
            <span>Export XLS</span>
        </button>
      </div>

      <!-- Score Card -->
      <div class="fluent-card rounded-3xl p-6 md:p-10 mb-8 flex flex-col md:flex-row items-center justify-between border-l-4 md:border-l-8 shadow-2xl relative overflow-hidden gap-6 md:gap-0" 
           [class]="viva.totalScore() >= 7 ? 'border-success' : 'border-danger'">
        
        <div class="absolute right-0 top-0 opacity-10 pointer-events-none">
            <span class="material-icons text-[8rem] md:text-[12rem] text-white">analytics</span>
        </div>

        <div class="text-center md:text-left relative z-10 w-full md:w-auto">
            <h2 class="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-2">Candidate Report</h2>
            <div class="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">{{ viva.candidate().name }}</div>
            <div class="flex justify-center md:justify-start gap-3 text-sm text-white/70">
                <span class="bg-white/10 px-3 py-1 rounded-md border border-white/5">{{ viva.candidate().role }}</span>
                <span class="bg-white/10 px-3 py-1 rounded-md border border-white/5 font-mono">{{ viva.difficulty() }} MODE</span>
            </div>
        </div>

        <div class="text-center relative z-10">
            <div class="text-6xl md:text-7xl font-black text-white mb-2 font-mono tracking-tighter drop-shadow-lg">{{ viva.totalScore() | number:'1.1-1' }}</div>
            <div class="text-xs md:text-sm font-bold uppercase tracking-[0.3em] px-4 py-1 rounded-full bg-black/30 backdrop-blur-sm inline-block" 
                 [class]="viva.totalScore() >= 7 ? 'text-success border border-success/30' : 'text-danger border border-danger/30'">
                {{ viva.totalScore() >= 7 ? 'QUALIFIED' : 'DISQUALIFIED' }}
            </div>
        </div>
      </div>

      <!-- Executive Summary -->
      <div class="fluent-card rounded-2xl p-6 md:p-8 mb-8 bg-gradient-to-br from-ms-blue/20 to-transparent border border-ms-blue/30 relative">
         <h3 class="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2 font-heading">
            <span class="material-icons text-ms-blue">auto_awesome</span> 
            Copilot Executive Summary
         </h3>
         @if (viva.finalReport()) {
            <div class="text-gray-100 leading-relaxed whitespace-pre-line animate-fade-in font-sans text-sm md:text-lg opacity-90">
                {{ viva.finalReport() }}
            </div>
         } @else {
            <div class="flex items-center gap-3 opacity-70 py-4">
                <div class="w-6 h-6 border-2 border-ms-blue border-t-transparent rounded-full animate-spin"></div>
                <div class="text-sm font-mono text-ms-blue">GENERATING INSIGHTS...</div>
            </div>
         }
      </div>

      <!-- Review List -->
      <h3 class="text-white font-bold mb-6 ml-2 font-heading text-lg md:text-xl">Transcript & Feedback</h3>
      <div class="grid grid-cols-1 gap-4 md:gap-5 mb-12">
         @for (q of viva.questions(); track q.id) {
            <div class="fluent-card rounded-2xl p-4 md:p-6 hover:bg-white/5 transition-all border border-white/5 group">
               <div class="flex justify-between items-start mb-3">
                  <span class="text-[9px] md:text-[10px] font-bold text-gray-400 bg-black/30 px-2 py-1 rounded font-mono">Q{{q.id}} • {{q.type}}</span>
                  <span class="font-bold text-base md:text-lg font-mono" [class]="(q.score || 0) >= 7 ? 'text-success' : 'text-danger'">{{q.score}}/10</span>
               </div>
               
               <div class="font-bold text-white mb-3 text-base md:text-lg leading-snug">{{q.question}}</div>
               <div class="text-xs md:text-sm text-gray-300 italic mb-5 border-l-2 border-white/20 pl-4 py-1">"{{q.userAnswer}}"</div>
               
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                  <div class="bg-black/30 p-4 rounded-xl border border-white/5">
                      <strong class="text-ms-blue block mb-1 text-[10px] md:text-xs uppercase tracking-wider">Analysis</strong>
                      {{q.feedback}}
                  </div>
                  <div class="bg-black/30 p-4 rounded-xl border border-white/5">
                      <strong class="text-academic-gold block mb-1 text-[10px] md:text-xs uppercase tracking-wider">Future Advice</strong>
                      {{q.futureAdvice || "Maintain precision."}}
                  </div>
               </div>
               
               @if(q.managementSummary) {
                 <div class="mt-2 text-[9px] md:text-[10px] text-gray-500 font-mono text-right">
                    Log: {{q.managementSummary}}
                 </div>
               }
            </div>
         }
      </div>

      <div class="text-center pb-12">
        <button (click)="viva.reset()" class="text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest hover:underline">Start New Session</button>
      </div>
    </div>
  `
})
export class ReportComponent {
  viva = inject(VivaService);
}
