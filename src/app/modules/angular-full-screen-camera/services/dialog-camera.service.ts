import { Injectable } from '@angular/core';
import {FullScreenDialogService} from "./full-screen-dialog.service";
import {CameraComponent} from "../components/camera/camera.component";

@Injectable()
export class DialogCameraService {

  constructor(private dialogService: FullScreenDialogService) { }

  openCamera() {
    return this.dialogService.showDialog(CameraComponent);
  }

  closeDialog(response: any) {
    this.dialogService.closeDialog(response);
  }
}
