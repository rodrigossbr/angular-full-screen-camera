import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CameraPreviewComponent} from "../camera-preview/camera-preview.component";
import {DialogCameraService} from "../../services/dialog-camera.service";
import {CameraDirection} from "../../models/enums/camera-direction.enum";
import {DeviceOrientationService} from "../../services/device-orientation.service";
import {LayoutOrientation} from "../../models/enums/layout-orientation.enum";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent implements OnInit {

  BACK = CameraDirection.Back;
  FRONT = CameraDirection.Front;
  hasTwoCameras?: boolean = false;

  @ViewChild('container') container!: ElementRef;
  @ViewChild('preview', { read: CameraPreviewComponent, static: true }) cameraPreview?: CameraPreviewComponent;

  pictureBase64?: string;
  overlayPath: string = 'assets/overlays/smartphone_1.png';
  // overlayPath: string = 'assets/overlays/smartphone_universal.png';
  // overlayPath: string = 'assets/overlays/smartphone_universal_2.png';
  direction: CameraDirection = CameraDirection.Back;

  layoutOrientation: LayoutOrientation = LayoutOrientation.Portrait;
  screenWidth!: number;
  screenHeight!: number;

  constructor(
    private dialogCameraService: DialogCameraService,
    private deviceOrientationService: DeviceOrientationService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.startCamera();
    this.hasTwoCameras = await this.cameraPreview?.hasTwoCameras();

    this.deviceOrientationService?.orientationMediaHandler()
      .subscribe(value => {
        this.layoutOrientation = value;
      });
  }

  closeDialog(data?: string) {
    this.cameraPreview!.stopCamera();
    this.dialogCameraService.closeDialog(data);
  }

  async takePicture() {
    this.pictureBase64 = await this.cameraPreview?.getData();
    this.cameraPreview!.stopCamera();
  }

  changeCamera() {
    if (this.direction == CameraDirection.Front) {
      this.direction = CameraDirection.Back;
    } else {
      this.direction = CameraDirection.Front;
    }
  }
  reTryPicture() {
    this.startCamera();
  }

  acceptPicture() {
    this.closeDialog(this.pictureBase64);
  }

  private async startCamera() {
    // this.container.nativeElement.requestFullscreen();
    this.pictureBase64 = undefined;
    await this.cameraPreview!.startCamera();
  }
}
