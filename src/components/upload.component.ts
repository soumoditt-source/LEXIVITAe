import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VivaService } from '../services/viva.service';

declare var pdfjsLib: any;

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col items-center justify-center p-6 relative">
      
      @if (!isProcessing()) {
        <div class="fluent-card rounded-3xl p-10 text-center animate-fade-in max-w-2xl w-full relative overflow-hidden shadow-fluent border-t border-white/10">
            
            <div class="mb-8 w-24 h-24 mx-auto bg-gradient-to-br from-ms-blue to-blue-900 rounded-2xl flex items-center justify-center text-4xl shadow-glow-blue transform rotate-3">
               <span class="material-icons text-5xl text-white">cloud_upload</span>
            </div>
            
            <h2 class="text-4xl font-bold text-white mb-2 font-heading">Context Ingestion</h2>
            <p class="text-white/50 mb-8 text-lg font-light">Step 2 of 3: Upload Research Document.</p>
            
            <div class="space-y-6">
               <div class="flex bg-black/40 p-1 rounded-xl mb-6 border border-white/10 relative">
                  <div class="absolute inset-y-1 bg-ms-blue/20 rounded-lg transition-all duration-300 w-[49%]" 
                       [style.left]="mode() === 'FILE' ? '0.5%' : '50.5%'"></div>
                  <button (click)="setMode('FILE')" [class.text-white]="mode() === 'FILE'" class="flex-1 py-3 rounded-lg text-sm font-bold transition-all uppercase tracking-wider text-white/50 relative z-10">Upload PDF</button>
                  <button (click)="setMode('DEMO')" [class.text-white]="mode() === 'DEMO'" class="flex-1 py-3 rounded-lg text-sm font-bold transition-all uppercase tracking-wider text-white/50 relative z-10">Load Demo</button>
               </div>

               @if (mode() === 'FILE') {
                  <div class="relative border-2 border-dashed border-white/10 rounded-2xl p-12 hover:bg-white/5 hover:border-ms-blue transition-all cursor-pointer group bg-black/20 overflow-hidden">
                      <input type="file" (change)="onFileSelected($event)" accept=".pdf,.txt,.md,.json" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div class="flex flex-col items-center gap-4 pointer-events-none transition-transform group-hover:scale-105 duration-300">
                          <span class="material-icons text-6xl text-white/20 group-hover:text-ms-blue transition-colors">description</span>
                          <div class="text-center">
                             <span class="text-lg font-bold text-white block">Drop Document Here</span>
                             <span class="text-xs text-white/30 block mt-1 font-mono">.PDF (Max 20MB / 60 Pages)</span>
                          </div>
                      </div>
                  </div>
               }

               @if (mode() === 'DEMO') {
                  <button (click)="startSimulation()" class="w-full bg-white/5 py-6 rounded-2xl text-white font-bold hover:bg-ms-blue hover:shadow-glow-blue transition-all flex items-center justify-center gap-4 border border-white/10 group relative overflow-hidden">
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <span class="material-icons text-3xl text-academic-gold">auto_stories</span>
                      <span class="text-lg">Use "Attention Is All You Need"</span>
                  </button>
               }
            </div>
        </div>
      } 
      
      @else {
         <div class="w-full max-w-2xl text-center animate-fade-in space-y-8">
            <div class="relative w-32 h-32 mx-auto">
                <div class="absolute inset-0 border-4 border-ms-blue/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
                <div class="absolute inset-2 border-4 border-t-ms-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="material-icons text-4xl text-white animate-pulse">memory</span>
                </div>
            </div>

            <div>
                <h2 class="text-2xl font-bold text-white mb-2 font-heading tracking-widest uppercase animate-pulse">System Analysis In Progress</h2>
                <p class="text-white/50 font-mono text-sm">LexiVitae is constructing the semantic knowledge graph.</p>
            </div>

            <div class="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10 font-mono text-xs text-left h-56 overflow-hidden relative shadow-inner">
                <div class="absolute top-0 left-0 right-0 h-1 bg-ms-blue animate-[scan_2s_linear_infinite] opacity-50"></div>
                <div class="flex flex-col-reverse h-full overflow-y-auto custom-scrollbar">
                    @for (log of logs().slice().reverse(); track $index) {
                        <div class="mb-2 flex gap-3 border-b border-white/5 pb-1">
                            <span class="text-ms-blue opacity-70 font-bold">[{{log.time}}]</span>
                            <span class="text-gray-300">{{log.msg}}</span>
                        </div>
                    }
                </div>
            </div>
            
            <div class="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-4">
                <div class="h-full bg-ms-blue animate-[shimmer_2s_infinite]" style="width: 60%"></div>
            </div>
         </div>
      }
    </div>
  `
})
export class UploadComponent {
  viva = inject(VivaService);
  mode = signal<'FILE' | 'DEMO'>('DEMO');
  isProcessing = signal(false);
  logs = signal<{time: string, msg: string}[]>([]);

  setMode(m: 'FILE' | 'DEMO') { this.mode.set(m); }

  addLog(msg: string) {
    const time = new Date().toLocaleTimeString([], {hour12: false, hour: "2-digit", minute:"2-digit", second:"2-digit"});
    this.logs.update(prev => [...prev, {time, msg}]);
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    
    this.isProcessing.set(true);
    this.logs.set([]);
    
    try {
      this.addLog(`System Init: Receiving ${file.name} (${(file.size/1024).toFixed(1)}KB)`);
      await this.wait(1000); 

      let text = '';
      if (file.type === 'application/pdf') {
        this.addLog("PDF Detected. Engaging PDF.js Worker...");
        text = await this.extractPdfText(file);
        this.addLog(`Extraction Complete. Parsed ${text.length} characters.`);
      } else {
        text = await this.readTextFile(file);
      }
      
      this.addLog("Sanitizing Text Stream...");
      const cleanText = text.replace(/\s+/g, ' ').trim();
      await this.wait(800);

      this.addLog("Building Semantic Context Window for Gemini 2.5...");
      const preparationPromise = this.viva.analyzeDocumentAndPrepare(cleanText);
      
      this.addLog(`Applying Difficulty Mode: ${this.viva.difficulty()}...`);
      await this.wait(1000);
      
      this.addLog("Generating Initial Assessment Vectors...");
      const success = await preparationPromise; 
      
      if (success) {
          this.addLog("Handshake Successful. Redirecting...");
          await this.wait(1000);
      } else {
          this.addLog("CRITICAL ERROR: Context Analysis Failed.");
          await this.wait(2000);
          this.isProcessing.set(false); 
      }
      
    } catch (err) {
      alert("Error reading file.");
      this.isProcessing.set(false);
    }
  }

  async startSimulation() {
    this.mode.set('DEMO');
    this.isProcessing.set(true);
    this.logs.set([]);
    const demoText = `The Transformer is the first transduction model relying entirely on self-attention...`; 
    this.addLog("Mounting 'Attention Is All You Need.pdf' (Demo)...");
    await this.wait(1000);
    this.addLog("Parsing 15 Pages...");
    const prep = this.viva.analyzeDocumentAndPrepare(demoText);
    await this.wait(1500);
    const success = await prep;
  }

  private wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

  private readTextFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result);
      reader.readAsText(file);
    });
  }

  private async extractPdfText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    // INCREASED LIMIT TO 60 PAGES
    const maxPages = Math.min(pdf.numPages, 60); 
    for (let i = 1; i <= maxPages; i++) {
      if (i % 5 === 0) this.addLog(`Scanning Page ${i}/${pdf.numPages}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  }
}
