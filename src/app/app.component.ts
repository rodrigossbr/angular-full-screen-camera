import {Component, OnInit} from '@angular/core';
import {DialogCameraService} from "./modules/angular-full-screen-camera/services/dialog-camera.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  imgBase64?: string;

  constructor(private dialogCameraService: DialogCameraService) {
  }

  ngOnInit(): void {
  }

  onOpenCamera() {
    this.dialogCameraService.openCamera()
      .subscribe(value => {
        this.imgBase64 = value;
      });
  }
}
