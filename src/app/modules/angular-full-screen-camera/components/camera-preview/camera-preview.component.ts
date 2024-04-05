import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import {CameraPreviewService} from '../../services/camera-preview.service';
import {CameraDirection} from '../../models/enums/camera-direction.enum';
import {LayoutOrientation} from "../../models/enums/layout-orientation.enum";
import {DeviceOrientationService} from "../../services/device-orientation.service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-camera-preview',
  templateUrl: './camera-preview.component.html',
  styleUrls: ['./camera-preview.component.scss'],
})
export class CameraPreviewComponent implements OnInit, OnDestroy {

  @Input() direction: CameraDirection = CameraDirection.Back;

  constructor(
    private cameraPreviewService: CameraPreviewService,
    private element: ElementRef,
    private renderer: Renderer2
  ) { }

  async ngOnInit(): Promise<void> {
    const rootElement = this.element.nativeElement;
    await this.cameraPreviewService.create(this.renderer, rootElement);

  }

  async ngOnDestroy(): Promise<void> {
    await this.cameraPreviewService.destroy();
  }

  async startCamera() {
    await this.cameraPreviewService.startCamera(this.direction);
  }

  async stopCamera() {
    await this.cameraPreviewService.stopCamera();
  }

  async getData(): Promise<string> {
    return await this.cameraPreviewService.getData();
  }

  async hasTwoCameras(): Promise<boolean> {
    return await this.cameraPreviewService.hasTwoCameras();
  }
}
