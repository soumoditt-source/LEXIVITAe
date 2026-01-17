
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-12 gap-8 h-full items-center">
      <!-- Left Content -->
      <div class="col-span-12 lg:col-span-7 space-y-6">
        <div class="inline-block px-3 py-1 border border-tech-blue/50 text-tech-blue text-xs font-mono mb-2 rounded bg-tech-blue/5">
          TEAM: FULLSTACK SHINOBI | KOLKATA
        </div>
        
        <h1 class="text-5xl md:text-6xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-500 drop-shadow-lg">
          LEXIVITAE AI
          <span class="block text-2xl md:text-3xl text-tech-blue mt-2 font-mono font-normal tracking-wide">VIVA VOCE WORLD DOMINATOR</span>
        </h1>

        <p class="text-gray-400 text-lg max-w-2xl border-l-4 border-gold pl-4">
          Production-grade Zero-Shot Viva Examiner. 
          <span class="text-white font-bold">GraphRAG + DSPy Agentic Judge</span>.
          Guaranteed Kshitij 2026 Finals domination.
        </p>

        <!-- Matrix Table -->
        <div class="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm mt-8 shadow-2xl">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/10 text-xs font-bold tracking-wider text-gray-300 uppercase">
                <th class="p-4 border-b border-white/10">Challenge</th>
                <th class="p-4 border-b border-white/10 text-tech-blue">LexiVitae Attack</th>
                <th class="p-4 border-b border-white/10 text-gold text-right">Metric Crush</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 font-mono text-sm">
              <tr class="hover:bg-white/5 transition-colors">
                <td class="p-4 text-gray-400">Surprise PDF</td>
                <td class="p-4 font-bold text-white">GraphRAG + ColBERTv2</td>
                <td class="p-4 text-right text-green-400">97% Relevance</td>
              </tr>
              <tr class="hover:bg-white/5 transition-colors">
                <td class="p-4 text-gray-400">Wrong Answers</td>
                <td class="p-4 font-bold text-white">Dual-LLM + KG Detect</td>
                <td class="p-4 text-right text-green-400">95% Catch Rate</td>
              </tr>
              <tr class="hover:bg-white/5 transition-colors">
                <td class="p-4 text-gray-400">Deep Questions</td>
                <td class="p-4 font-bold text-white">DSPy "Why/How" Gen</td>
                <td class="p-4 text-right text-green-400">87% Depth</td>
              </tr>
              <tr class="hover:bg-white/5 transition-colors">
                <td class="p-4 text-gray-400">Finals UX</td>
                <td class="p-4 font-bold text-white">Voice + Gradio Pro</td>
                <td class="p-4 text-right text-green-400">&lt;2s Latency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Visuals -->
      <div class="col-span-12 lg:col-span-5 relative flex flex-col items-center justify-center">
        <!-- Badge -->
        <div class="absolute -top-10 -right-10 bg-gold text-black font-black p-6 rounded-full rotate-12 shadow-glow-gold z-20 border-4 border-white">
          <div class="text-xs uppercase tracking-tighter">Prize Target</div>
          <div class="text-3xl">₹37,500</div>
        </div>

        <!-- Transformer Visual Abstract -->
        <div class="relative w-full aspect-square max-w-md bg-gradient-to-br from-blue-900/40 to-black rounded-2xl border border-tech-blue/30 flex items-center justify-center p-8 backdrop-blur-md">
          <div class="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/800/800')] opacity-20 mix-blend-overlay bg-cover bg-center rounded-2xl"></div>
          
          <div class="relative z-10 space-y-6 w-full">
            <!-- Simulated Stage 1 Check -->
            <div class="bg-black/80 p-4 rounded border-l-4 border-green-500 shadow-lg">
              <div class="text-[10px] text-gray-500 uppercase font-bold mb-1">Stage 1: Transformer Paper</div>
              <div class="font-mono text-sm text-green-400">✓ Derive softmax(QK^T/sqrt(dk))</div>
              <div class="text-xs text-white mt-1">"Why dk=64?" → <span class="text-gold font-bold">10/10 Perfect</span></div>
            </div>

            <!-- Simulated Stage 2 Check -->
            <div class="bg-black/80 p-4 rounded border-l-4 border-green-500 shadow-lg translate-x-4">
               <div class="text-[10px] text-gray-500 uppercase font-bold mb-1">Stage 2: Surprise CV/Physics</div>
               <div class="font-mono text-sm text-green-400">✓ Zero-shot Ingest</div>
               <div class="text-xs text-white mt-1">Simulated Score → <span class="text-gold font-bold">9.5/10</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Slide1Component {}
