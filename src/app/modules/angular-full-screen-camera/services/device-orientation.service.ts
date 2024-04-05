import { Injectable } from '@angular/core';
import {Subject} from "rxjs/internal/Subject";
import {LayoutOrientation} from '../models/enums/layout-orientation.enum';

@Injectable()
export class DeviceOrientationService {

  private orientationSub = new Subject<LayoutOrientation>();
  private orientation$ = this.orientationSub.asObservable();

  private orientationMediaSub = new Subject<LayoutOrientation>();
  private orientationMedia$ = this.orientationMediaSub.asObservable();

  constructor() {}

  public orientationHandler() {
    // Só funciona em HTTPS
    window.addEventListener('deviceorientation', event => {
      const alpha = event.alpha || 0; // Rotação em torno do eixo z, em graus
      const beta = event.beta || 0;  // Rotação em torno do eixo x, em graus
      const gamma = event.gamma || 0; // Rotação em torno do eixo y, em graus

      // Verificar se o dispositivo está em modo retrato ou paisagem
      if (Math.abs(gamma) > Math.abs(beta)) {
        this.orientationSub.next(LayoutOrientation.Landscape);
        console.log("Landscape")
      } else {
        this.orientationSub.next(LayoutOrientation.Portrait);
        console.log("Portrait")
      }
    }, true);
    return this.orientation$;
  }

  public orientationMediaHandler() {
    const portrait = window.matchMedia('(orientation: portrait)');
    portrait.addEventListener('change', (event) => {
      if (event.matches) {
        this.orientationMediaSub.next(LayoutOrientation.Portrait);
      } else {
        this.orientationMediaSub.next(LayoutOrientation.Landscape);
      }
      console.log("FUNC: ", event)
    });
    return this.orientationMedia$
  }
}
