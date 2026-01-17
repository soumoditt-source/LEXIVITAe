
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col gap-6">
      <div class="text-center mb-4">
        <h2 class="text-3xl font-black text-white uppercase tracking-wider">
          <span class="text-tech-blue">🏯</span> Battle-Tested Production Stack
        </h2>
        <div class="text-sm text-gray-400 font-mono mt-1">OFFLINE FIRST | FINALS PROOF | DOCKERIZED</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <!-- Tech Cards -->
        @for (item of stack; track item.title) {
          <div class="bg-white/5 border border-white/10 p-4 rounded-lg hover:border-tech-blue/50 transition-colors group">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-tech-blue font-bold text-sm uppercase">{{item.title}}</h3>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">{{item.type}}</span>
            </div>
            <div class="text-white font-medium mb-1">{{item.tech}}</div>
            <div class="text-xs text-green-400 font-mono border-t border-white/5 pt-2 mt-2">
              {{item.metric}}
            </div>
          </div>
        }
      </div>

      <!-- Code Section -->
      <div class="flex-1 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div class="relative bg-[#1e1e1e] rounded-lg border border-gray-700 p-0 overflow-hidden shadow-2xl font-mono text-sm">
          <div class="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <span class="text-gray-400 text-xs">dspy_optimizer.py</span>
            <div class="flex gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div class="p-4 text-gray-300 leading-relaxed overflow-x-auto">
<pre><code><span class="text-purple-400">import</span> dspy
<span class="text-purple-400">from</span> ragas <span class="text-purple-400">import</span> evaluate

<span class="text-gray-500"># Soumoditya Das - DSPy Optimized QGen</span>
<span class="text-yellow-400">@prompt</span>
<span class="text-blue-400">def</span> <span class="text-yellow-300">shinobi_qs</span>(ctx): 
    <span class="text-orange-300">return</span> <span class="text-green-300">"5x why/how viva Qs w/ citations"</span>

qs = dspy.compile(shinobi_qs, trainset=transformer_data)()

<span class="text-gray-500"># RAGAS Judge: 0.97 faithfulness guaranteed</span>
score = ragas_judge(answer, gold_ctx) 
<span class="text-purple-400">if</span> score > <span class="text-blue-300">0.9</span>:
    <span class="text-yellow-300">print</span>(<span class="text-green-300">"9/10 → ADVANCE"</span>)</code></pre>
          </div>
        </div>

        <div class="flex flex-col justify-center space-y-4">
           <div class="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
             <div class="text-tech-blue font-bold text-lg mb-1">Infrastructure</div>
             <ul class="text-gray-300 text-sm space-y-1 list-disc list-inside">
               <li>Dockerized Containers (Works on any laptop)</li>
               <li>Llama3.1-405B Local (No WiFi dependency)</li>
               <li>Neo4j Graph Database (Knowledge Graph)</li>
               <li>GPU/CPU Hybrid execution</li>
             </ul>
           </div>
           
           <div class="flex items-center gap-4">
             <div class="flex-1 bg-white/5 h-px"></div>
             <div class="text-gold font-black text-xl tracking-widest">350 LOC</div>
             <div class="flex-1 bg-white/5 h-px"></div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class Slide2Component {
  stack = [
    { title: 'PDF Ingest', type: 'INPUT', tech: 'RAGFlow + PyMuPDF + MathPix', metric: '99% Eq. Extraction' },
    { title: 'RAG Core', type: 'MEMORY', tech: 'LlamaIndex + BGE-M3', metric: '0.97 Recall@5' },
    { title: 'KG Layer', type: 'LOGIC', tech: 'Neo4j GraphRAG', metric: '+28% Fact Accuracy' },
    { title: 'LLM Judge', type: 'BRAIN', tech: 'Llama3.1-405B Local', metric: '> GPT-4o on STEM' },
    { title: 'Metrics', type: 'SCORE', tech: 'RAGAS + 4/3/3 Rubric', metric: 'Automated 1-10' },
    { title: 'Voice UI', type: 'INTERFACE', tech: 'Whisper-v3 + Gradio 5.5', metric: '<2s E2E Latency' }
  ];
}
