
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide3',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-12 gap-8 h-full">
      <!-- Left: The Ninja Flow -->
      <div class="col-span-12 lg:col-span-7 flex flex-col h-full">
        <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
          <span class="text-red-500">⚔️</span> EXECUTION FLOW
        </h2>
        
        <div class="relative flex-1 pl-4 border-l-2 border-white/10 space-y-6">
          <!-- Step 1 -->
          <div class="relative pl-8">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-tech-blue shadow-glow-blue"></div>
            <div class="bg-white/5 p-3 rounded border border-white/10">
              <div class="flex justify-between items-center text-xs mb-1">
                <span class="text-tech-blue font-bold">[0s] UPLOAD</span>
                <span class="text-gray-500">RAGFlow</span>
              </div>
              <div class="text-sm font-medium">Surprise PDF (CV/Physics) → Parse → BGE-M3 Embed</div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="relative pl-8">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-700"></div>
            <div class="bg-white/5 p-3 rounded border border-white/10">
              <div class="flex justify-between items-center text-xs mb-1">
                <span class="text-purple-400 font-bold">[5s] GENERATE</span>
                <span class="text-gray-500">Llama405B + DSPy</span>
              </div>
              <div class="text-sm font-medium">5x Deep "Why/How" Questions with Citations</div>
              <div class="text-xs text-gray-400 italic mt-1">"Why sin(10000...) for positional encoding?"</div>
            </div>
          </div>

          <!-- Step 3 Loop -->
          <div class="relative pl-8">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gold shadow-glow-gold animate-pulse"></div>
            <div class="bg-gradient-to-r from-gold/10 to-transparent p-3 rounded border border-gold/30">
              <div class="flex justify-between items-center text-xs mb-1">
                <span class="text-gold font-bold">🔄 VOICE LOOP</span>
                <span class="text-gray-500">Gradio Pro</span>
              </div>
              <div class="text-sm">Judge Speaks → Whisper STT → <span class="text-tech-blue">Dual Shinobi Judge</span></div>
              
              <!-- Sub Logic -->
              <div class="mt-2 space-y-1">
                <div class="flex items-center gap-2 text-xs">
                   <span class="text-green-400">✓</span> RAGAS Faithfulness: 0.97
                </div>
                <div class="flex items-center gap-2 text-xs">
                   <span class="text-red-400">⚠</span> KG Contradiction Check
                </div>
              </div>
            </div>
          </div>

           <!-- Step 4 Result -->
           <div class="relative pl-8">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
            <div class="bg-green-900/20 p-3 rounded border border-green-500/30">
              <div class="text-sm font-bold text-green-400">RESULT: 10/10 ADVANCE</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Metrics & Results -->
      <div class="col-span-12 lg:col-span-5 space-y-6">
        <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2 text-right">
          DOMINATION METRICS
        </h2>

        <!-- Progress Bars -->
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-xs font-bold mb-1">
              <span class="text-white">RELEVANCE (Chunk-Cited)</span>
              <span class="text-tech-blue">97%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2">
              <div class="bg-tech-blue h-2 rounded-full shadow-glow-blue" style="width: 97%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs font-bold mb-1">
              <span class="text-white">FACT-CHECK (Wrong Detect)</span>
              <span class="text-gold">95%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2">
              <div class="bg-gold h-2 rounded-full shadow-glow-gold" style="width: 95%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs font-bold mb-1">
              <span class="text-white">DEPTH (DSPy Why/How)</span>
              <span class="text-purple-500">87%</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full" style="width: 87%"></div>
            </div>
          </div>
        </div>

        <!-- Final Results Table -->
        <div class="bg-black/40 rounded-lg p-4 border border-white/10">
          <table class="w-full text-center text-sm">
            <thead>
              <tr class="text-gray-500 text-xs uppercase">
                <th class="pb-2 text-left">Dataset</th>
                <th class="pb-2">Rel</th>
                <th class="pb-2">Fact</th>
                <th class="pb-2 text-gold">Final</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 font-mono">
              <tr>
                <td class="py-2 text-left">Transformer</td>
                <td class="py-2">98%</td>
                <td class="py-2">96%</td>
                <td class="py-2 font-bold text-gold">9.5/10</td>
              </tr>
              <tr>
                <td class="py-2 text-left">CV Surprise</td>
                <td class="py-2">97%</td>
                <td class="py-2">94%</td>
                <td class="py-2 font-bold text-gold">9.3/10</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-center pt-4">
          <div class="inline-block px-4 py-2 border border-tech-blue text-tech-blue font-bold tracking-widest text-sm hover:bg-tech-blue hover:text-black transition-colors cursor-pointer">
            LIVE DEMO: GRADIO.LIVE/SHINOBI
          </div>
        </div>
      </div>
    </div>
  `
})
export class Slide3Component {}
