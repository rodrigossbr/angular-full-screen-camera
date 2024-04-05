import { Renderer2 } from '@angular/core';
import {CameraDirection} from '../models/enums/camera-direction.enum';
import {cropImageCenter, resizeImage} from '../helpers/image';
import {LayoutOrientation} from "../models/enums/layout-orientation.enum";

export abstract class CameraPreviewService {

  protected _element!: HTMLElement;
  protected _renderer!: Renderer2;

  protected async initialize(): Promise<void> { /* Apenas para overrides */ }
  protected abstract getRawData(): Promise<string>;

  abstract hasTwoCameras(): Promise<boolean>;
  abstract startCamera(direction: CameraDirection): Promise<void>;
  abstract stopCamera(): Promise<void>;

  async create(renderer: Renderer2, element: HTMLElement): Promise<void> {
    this._element = element;
    this._renderer = renderer;

    await this.initialize();
  }

  async destroy(): Promise<void> {
    await this.stopCamera();
  }

  async getData(): Promise<string> {
    const rawData = await this.getRawData();

    const { offsetWidth: width, offsetHeight: height } = this._element!;

    const cropped = await cropImageCenter(rawData, width, height);

    return await resizeImage(cropped);
  }
}
