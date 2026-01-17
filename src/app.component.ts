import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivaService } from './services/viva.service';
import { LandingComponent } from './components/landing.component';
import { UploadComponent } from './components/upload.component';
import { CandidateFormComponent } from './components/candidate-form.component';
import { InstructionsComponent } from './components/instructions.component';
import { InterviewComponent } from './components/interview.component';
import { ReportComponent } from './components/report.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LandingComponent, UploadComponent, CandidateFormComponent, InstructionsComponent, InterviewComponent, ReportComponent],
  template: `
    <div class="h-[100dvh] w-screen overflow-hidden flex flex-col relative font-sans text-white bg-ms-dark selection:bg-ms-blue selection:text-white">
      
      <!-- Immersive Ambient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#050505] z-0"></div>
      
      <!-- Animated Blobs (Hidden on small mobile to improve performance/visibility) -->
      <div class="hidden md:block absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-ms-blue/20 rounded-full blur-[120px] animate-float-slow opacity-60"></div>
      <div class="hidden md:block absolute top-1/2 -left-40 w-[30rem] h-[30rem] bg-purple-900/20 rounded-full blur-[100px] animate-float-medium opacity-50"></div>
      <div class="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none"></div>

      <!-- Navigation -->
      <nav class="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-50 pointer-events-none">
        <div class="flex items-center gap-2 md:gap-3 pointer-events-auto">
          <div class="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2 md:gap-3 font-heading">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-ms-blue to-blue-400">LexiVitae</span> 
            <span class="text-white/20 font-light text-lg md:text-xl">|</span> 
            <span class="text-gray-400 font-medium text-base md:text-lg">Copilot</span>
          </div>
        </div>

        <div class="pointer-events-auto flex items-center gap-2 md:gap-4">
           @if (viva.candidate().name) {
              <div class="text-[9px] md:text-[10px] font-bold text-gray-400 border border-white/10 bg-black/30 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-sm whitespace-nowrap">
                 <span class="w-1.5 h-1.5 rounded-full bg-success"></span> 
                 <span class="max-w-[80px] md:max-w-none truncate">{{viva.candidate().name}}</span>
              </div>
           }
           @if (viva.state() !== 'LANDING') {
            <button (click)="viva.reset()" class="text-white/30 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 active:bg-white/20">
              <span class="material-icons text-xl md:text-2xl">close</span>
            </button>
          }
        </div>
      </nav>

      <!-- Main Stage -->
      <main class="flex-1 relative z-20 flex flex-col items-center justify-center p-2 md:p-4">
        <div class="w-full max-w-7xl h-full md:h-[88vh] relative flex flex-col justify-center">
          
          @switch (viva.state()) {
            @case ('LANDING') { <app-landing class="h-full w-full block animate-fade-in" /> }
            @case ('CANDIDATE_FORM') { <app-candidate-form class="h-full w-full block animate-fade-in" /> }
            @case ('UPLOAD') { <app-upload class="h-full w-full block animate-fade-in" /> }
            @case ('PROCESSING') { <app-upload class="h-full w-full block" /> }
            @case ('INSTRUCTIONS') { <app-instructions class="h-full w-full block animate-fade-in" /> }
            @case ('INTERVIEW') { <app-interview class="h-full w-full block animate-fade-in" /> }
            @case ('REPORT') { <app-report class="h-full w-full block animate-fade-in" /> }
            @case ('DISQUALIFIED') { <app-interview class="h-full w-full block" /> }
          }
        
        </div>
      </main>

      <footer class="absolute bottom-2 md:bottom-4 w-full text-center text-[8px] md:text-[9px] text-white/20 font-mono z-50 tracking-[0.2em] pointer-events-none px-4">
         POWERED BY GEMINI 2.5 • MICROSOFT AZURE AI • TENSORFLOW
      </footer>
    </div>
  `
})
export class AppComponent {
  viva = inject(VivaService);
}
