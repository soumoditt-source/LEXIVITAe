
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden font-sans relative">
      <!-- Window Controls -->
      <div class="bg-gray-100 p-3 flex gap-2 border-b border-gray-300">
        <div class="w-3 h-3 rounded-full bg-red-400"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div class="w-3 h-3 rounded-full bg-green-400"></div>
      </div>

      <!-- Email Header -->
      <div class="p-6 pb-2">
        <div class="grid grid-cols-[80px_1fr] gap-2 mb-4 text-sm">
          <div class="text-gray-500 text-right font-bold">To:</div>
          <div class="bg-blue-100 text-blue-800 px-2 rounded w-max">lexicognition&#64;ktj.in</div>
          
          <div class="text-gray-500 text-right font-bold">CC:</div>
          <div class="text-gray-700">prikshit.goyal&#64;ktj.in</div>

          <div class="text-gray-500 text-right font-bold">Subject:</div>
          <div class="font-bold">URGENT Round1 Winner Submission - FULLSTACK SHINOBI | LexiVitae</div>
        </div>
        <hr class="border-gray-200">
      </div>

      <!-- Email Body -->
      <div class="p-6 pt-2 text-sm leading-relaxed text-gray-800 h-96 overflow-y-auto">
        <p class="mb-4">尊敬的 Lexicognition Team,</p>
        
        <p class="mb-4">
          <strong class="text-blue-700">FULLSTACK SHINOBI (Kolkata)</strong> proudly submits our production-ready LexiVitae AI:
        </p>

        <div class="bg-gray-50 p-4 rounded border border-gray-200 mb-4 font-mono text-xs">
          <div class="flex items-center gap-2 mb-2">
            <span>📎</span> <span class="font-bold">LexiVitae_R1_Winner_FULLSTACK_SHINOBI.pdf</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span>🔗</span> <span class="text-blue-600 underline">https://lexivitae-shinobi.gradio.live</span>
          </div>
          <div class="flex items-center gap-2">
             <span>🐋</span> <span>DOCKER: shinobi/lexivitae:latest</span>
          </div>
        </div>

        <p class="mb-2 font-bold">TESTED PRODUCTION METRICS:</p>
        <ul class="list-none space-y-1 mb-4 pl-1">
          <li>✅ Transformer Paper: 9.5/10 perfect grading</li>
          <li>✅ Surprise PDF Sim: 9.3/10 zero-shot</li>
          <li>✅ 97% relevance, 95% fact-check, <3s latency</li>
        </ul>

        <p class="mb-4">
          Team: Soumoditya Das + FULLSTACK SHINOBI<br>
          Email: <a href="mailto:soumoditt@gmail.com" class="text-blue-600">soumoditt&#64;gmail.com</a> | Kolkata → IITKGP Finals Jan 18<br>
          Onsite laptop ready. ₹37,500 locked in.
        </p>

        <p>
          Ninja bow,<br>
          <strong>Soumoditya Das</strong><br>
          FULLSTACK SHINOBI
        </p>
      </div>
      
      <!-- Send Button Simulation -->
      <div class="absolute bottom-6 right-6">
        <button class="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2">
          <span>Send Immediately</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class EmailComponent {}
