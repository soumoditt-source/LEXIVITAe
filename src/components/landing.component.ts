import { Component, inject } from '@angular/core';
import { VivaService } from '../services/viva.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col items-center justify-center p-4 md:p-6 relative overflow-y-auto custom-scrollbar">
      
      <!-- Hero Section -->
      <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16 mt-16 md:mt-10">
        
        <!-- Left: Branding & Action -->
        <div class="space-y-6 md:space-y-8 animate-fade-in z-20 text-center lg:text-left">
            <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded border border-ms-blue/30 bg-ms-blue/10 text-ms-blue text-[10px] font-mono tracking-widest uppercase mb-4">
                    <span class="w-2 h-2 rounded-full bg-ms-blue animate-pulse"></span>
                    System Online • v3.1 • Mobile Ready
                </div>
                <h1 class="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-4 font-heading">
                    LEXI<span class="text-transparent bg-clip-text bg-gradient-to-r from-ms-blue to-blue-400">VITAE</span>
                </h1>
                <p class="text-lg md:text-xl text-gray-400 font-light max-w-md leading-relaxed mx-auto lg:mx-0">
                    The autonomous <strong class="text-white">AI Oral Examiner</strong>. 
                    Upload any research paper. Experience rigorous, <span class="text-ms-blue">semantic-grade</span> cross-examination.
                </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button (click)="onStart()" 
                    class="px-8 py-4 bg-ms-blue hover:bg-ms-blue-hover text-white font-bold rounded-xl shadow-glow-blue transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full sm:w-auto">
                    <span>INITIATE EXAM</span>
                    <span class="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button (click)="playDemoVoice()" 
                    class="px-8 py-4 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-3 hover:border-white/30 w-full sm:w-auto">
                    <span class="material-icons text-academic-gold">record_voice_over</span>
                    <span>Voice Check</span>
                </button>
            </div>
        </div>

        <!-- Right: Metrics HUD -->
        <div class="relative animate-float-slow z-10 hidden md:block">
            <!-- Background Glow -->
            <div class="absolute inset-0 bg-ms-blue/20 blur-[80px] rounded-full opacity-50"></div>
            
            <div class="fluent-card rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ms-blue to-transparent opacity-50"></div>
                
                <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">Performance Matrix</div>
                    <div class="text-[10px] font-mono text-ms-blue">LIVE_TELEMETRY</div>
                </div>

                <div class="space-y-6">
                    <div>
                        <div class="flex justify-between text-xs font-bold mb-2">
                            <span class="text-white">CONTEXT FIDELITY</span>
                            <span class="text-success">99.8%</span>
                        </div>
                        <div class="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-success h-full rounded-full w-[99.8%] shadow-[0_0_10px_rgba(16,124,16,0.5)]"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-2">
                            <span class="text-white">GRADING STRICTNESS</span>
                            <span class="text-academic-gold">SEMANTIC</span>
                        </div>
                        <div class="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-academic-gold h-full rounded-full w-[100%] shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-xs font-bold mb-2">
                            <span class="text-white">PROCTOR THREAT LEVEL</span>
                            <span class="text-danger">MONITORED</span>
                        </div>
                        <div class="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-danger h-full rounded-full w-[100%] animate-pulse shadow-[0_0_10px_rgba(209,52,56,0.5)]"></div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 grid grid-cols-2 gap-4">
                     <div class="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <div class="text-2xl font-black text-white font-mono">1.2s</div>
                        <div class="text-[9px] text-gray-500 uppercase">Avg Latency</div>
                     </div>
                     <div class="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <div class="text-2xl font-black text-white font-mono">100%</div>
                        <div class="text-[9px] text-gray-500 uppercase">Source Match</div>
                     </div>
                </div>
            </div>
        </div>
      </div>

      <!-- Capability Matrix (Mobile Friendly) -->
      <div class="w-full max-w-6xl animate-fade-in animation-delay-300 mb-12">
         <div class="fluent-card rounded-2xl overflow-hidden border border-white/10">
            <table class="w-full text-left">
                <thead class="hidden md:table-header-group">
                    <tr class="bg-white/5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        <th class="p-4 pl-6">Core Module</th>
                        <th class="p-4">Technology</th>
                        <th class="p-4 text-right pr-6">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5 text-sm font-mono text-gray-300">
                    <tr class="hover:bg-white/5 transition-colors flex flex-col md:table-row p-4 md:p-0">
                        <td class="p-1 md:p-4 md:pl-6 font-sans font-bold text-white block md:table-cell">Research Ingestion Engine</td>
                        <td class="p-1 md:p-4 text-xs md:text-sm text-gray-400 md:text-gray-300 block md:table-cell">PDF.js + Semantic Chunking</td>
                        <td class="p-1 md:p-4 md:text-right md:pr-6 text-success block md:table-cell">OPTIMIZED</td>
                    </tr>
                    <tr class="hover:bg-white/5 transition-colors flex flex-col md:table-row p-4 md:p-0">
                        <td class="p-1 md:p-4 md:pl-6 font-sans font-bold text-white block md:table-cell">Semantic Grader</td>
                        <td class="p-1 md:p-4 text-xs md:text-sm text-gray-400 md:text-gray-300 block md:table-cell">Gemini 2.5 Flash</td>
                        <td class="p-1 md:p-4 md:text-right md:pr-6 text-success block md:table-cell">STRICT</td>
                    </tr>
                </tbody>
            </table>
         </div>
      </div>

    </div>
  `
})
export class LandingComponent {
  viva = inject(VivaService);

  onStart() {
    this.viva.introduce();
    setTimeout(() => {
        this.viva.goToCandidateForm();
    }, 1200);
  }

  playDemoVoice() {
    this.viva.introduce();
  }
}
