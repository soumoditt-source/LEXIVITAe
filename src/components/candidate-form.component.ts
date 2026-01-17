import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VivaService, CandidateInfo, Difficulty } from '../services/viva.service';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex items-center justify-center p-4">
      <div class="fluent-card w-full max-w-[550px] rounded-3xl p-10 animate-scale-in relative overflow-hidden shadow-2xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-ms-blue to-blue-700 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-glow-blue transform rotate-3">
                <span class="material-icons text-3xl text-white">badge</span>
            </div>
            <h2 class="text-3xl font-bold text-white font-heading">Candidate Identity</h2>
            <p class="text-white/50 text-sm mt-2">Configure Assessment Parameters</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div class="group">
                <label class="block text-[10px] font-bold text-ms-blue uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input type="text" [(ngModel)]="info.name" name="name" required 
                       class="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/20 focus:border-ms-blue focus:bg-black/60 focus:ring-1 focus:ring-ms-blue outline-none transition-all font-sans text-lg" 
                       placeholder="e.g. Satya Nadella" />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="group">
                    <label class="block text-[10px] font-bold text-ms-blue uppercase tracking-widest mb-2 ml-1">ID Code</label>
                    <input type="text" [(ngModel)]="info.id" name="id" required 
                           class="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/20 focus:border-ms-blue outline-none transition-all font-mono text-sm" 
                           placeholder="MS-101" />
                </div>
                <div class="group">
                     <label class="block text-[10px] font-bold text-ms-blue uppercase tracking-widest mb-2 ml-1">Role</label>
                     <select [(ngModel)]="info.role" name="role" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none text-sm appearance-none">
                        <option value="Developer">Developer</option>
                        <option value="Researcher">Researcher</option>
                        <option value="Student">Student</option>
                     </select>
                </div>
            </div>

            <!-- Difficulty Selector -->
            <div class="bg-white/5 p-4 rounded-2xl border border-white/10 mt-4">
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Examination Mode</label>
                <div class="grid grid-cols-3 gap-2">
                    <button type="button" (click)="selectedDiff = 'EASY'" 
                        [class]="selectedDiff === 'EASY' ? 'bg-success text-white border-success shadow-[0_0_15px_rgba(16,124,16,0.4)]' : 'bg-black/40 text-gray-500 border-white/5 hover:bg-white/10'"
                        class="py-3 rounded-xl border font-bold text-xs transition-all flex flex-col items-center gap-1 relative overflow-hidden group">
                        <span class="material-icons text-lg">school</span>
                        <span>STANDARD</span>
                    </button>
                    
                    <button type="button" (click)="selectedDiff = 'MEDIUM'" 
                        [class]="selectedDiff === 'MEDIUM' ? 'bg-ms-blue text-white border-ms-blue shadow-glow-blue' : 'bg-black/40 text-gray-500 border-white/5 hover:bg-white/10'"
                        class="py-3 rounded-xl border font-bold text-xs transition-all flex flex-col items-center gap-1">
                        <span class="material-icons text-lg">tune</span>
                        <span>ADVANCED</span>
                    </button>
                    
                    <button type="button" (click)="selectedDiff = 'EXTREME'" 
                        [class]="selectedDiff === 'EXTREME' ? 'bg-danger text-white border-danger shadow-[0_0_15px_rgba(209,52,56,0.4)]' : 'bg-black/40 text-gray-500 border-white/5 hover:bg-white/10'"
                        class="py-3 rounded-xl border font-bold text-xs transition-all flex flex-col items-center gap-1">
                        <span class="material-icons text-lg">psychology</span>
                        <span>EXTREME</span>
                    </button>
                </div>
                
                <div class="text-[10px] text-center mt-3 font-mono transition-colors"
                     [class.text-success]="selectedDiff === 'EASY'"
                     [class.text-ms-blue]="selectedDiff === 'MEDIUM'"
                     [class.text-danger]="selectedDiff === 'EXTREME'">
                     @if(selectedDiff === 'EASY') { > Mostly MCQs. Lenient Grading. Hints Enabled. }
                     @if(selectedDiff === 'MEDIUM') { > Balanced Mix. Standard Proctoring. }
                     @if(selectedDiff === 'EXTREME') { > Open-Ended Qs. Strict Logic. High Sensitivity. }
                </div>
            </div>

            <div class="pt-4">
                <button type="submit" [disabled]="!isValid()" 
                        class="w-full bg-ms-blue hover:bg-ms-blue-hover text-white font-bold py-5 rounded-xl shadow-fluent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]">
                    <span>INITIALIZE SYSTEM</span>
                    <span class="material-icons text-sm">arrow_forward</span>
                </button>
            </div>
        </form>
      </div>
    </div>
  `
})
export class CandidateFormComponent {
  viva = inject(VivaService);
  info: CandidateInfo = { name: '', email: '', role: 'Developer', id: '' };
  selectedDiff: Difficulty = 'MEDIUM';

  isValid() {
    return this.info.name.length > 2 && this.info.id.length > 0;
  }

  onSubmit() {
    if (this.isValid()) {
        this.viva.registerCandidate(this.info, this.selectedDiff);
    }
  }
}
