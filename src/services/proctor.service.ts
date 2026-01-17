import { Injectable, signal } from '@angular/core';

declare var cocoSsd: any;
declare var tf: any;

@Injectable({
  providedIn: 'root'
})
export class ProctorService {
  model: any = null;
  isLoaded = signal(false);
  detections = signal<string[]>([]);
  
  // Objects that trigger a warning
  forbiddenObjects = ['cell phone', 'mobile phone', 'book'];

  async loadModel() {
    if (this.model) return;
    try {
      console.log("Loading COCO-SSD Model...");
      this.model = await cocoSsd.load();
      this.isLoaded.set(true);
      console.log("Model Loaded.");
    } catch (e) {
      console.error("Failed to load TensorFlow model", e);
    }
  }

  async detect(videoElement: HTMLVideoElement): Promise<boolean> {
    if (!this.model || !this.isLoaded()) return false;

    try {
      const predictions = await this.model.detect(videoElement);
      const detectedItems: string[] = [];
      let cheatDetected = false;

      predictions.forEach((pred: any) => {
        // Filter logic: Only high confidence
        if (pred.score > 0.6) {
          detectedItems.push(`${pred.class} (${Math.round(pred.score * 100)}%)`);
          
          if (this.forbiddenObjects.includes(pred.class)) {
            cheatDetected = true;
          }
          
          // Logic: "person" count > 1 implies help
          if (pred.class === 'person') {
             // We could count people here, simplified for now
          }
        }
      });

      this.detections.set(detectedItems);
      return cheatDetected;
    } catch (e) {
      return false;
    }
  }
}