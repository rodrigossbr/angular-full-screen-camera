import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CameraPreviewComponent} from "./components/camera-preview/camera-preview.component";
import {CameraPreviewService} from "./services/camera-preview.service";
import {CameraPreviewBrowserService} from "./services/camera-preview-browser.service";
import {ComponentCreatorService} from "./services/component-creator.service";
import {FullScreenDialogService} from "./services/full-screen-dialog.service";
import {DialogCameraService} from "./services/dialog-camera.service";
import { CameraComponent } from './components/camera/camera.component';
import {MatIcon} from "@angular/material/icon";
import {MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {DeviceOrientationService} from "./services/device-orientation.service";



@NgModule({
  declarations: [
    CameraPreviewComponent,
    CameraComponent
  ],
  imports: [
    CommonModule,
    MatIcon,
    MatFabButton,
    MatMiniFabButton
  ],
  exports: [
    CameraPreviewComponent
  ],
  providers: [
    ComponentCreatorService,
    FullScreenDialogService,
    DialogCameraService,
    DeviceOrientationService,
    {
      provide: CameraPreviewService,
      useClass: CameraPreviewBrowserService
    }
  ]
})
export class AngularFullScreenCameraModule { }
