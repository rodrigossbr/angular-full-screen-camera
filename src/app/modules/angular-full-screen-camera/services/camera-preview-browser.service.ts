import {Injectable} from '@angular/core';
import {CameraPreviewService} from './camera-preview.service';
import {CameraDirection} from '../models/enums/camera-direction.enum';
import {rules} from '../helpers/image';
import {PermissionError} from '../models/errors/permission-error';
import {PermissionType} from '../models/enums/permission-type.enum';
import {LayoutOrientation} from "../models/enums/layout-orientation.enum";

@Injectable()
export class CameraPreviewBrowserService extends CameraPreviewService {

  private _videoElement?: HTMLVideoElement;
  private _stream?: MediaStream;

  override async initialize(): Promise<void> {
    const videoElement: HTMLVideoElement = this._renderer.createElement("video");
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsInline = true;

    this._renderer.setStyle(videoElement, "width", "100%");
    this._renderer.setStyle(videoElement, "height", "100%");
    this._renderer.setStyle(videoElement, "objectFit", "cover");
    this._renderer.setStyle(videoElement, "objectPosition", "center");
    this._renderer.appendChild(this._element, videoElement);

    this._videoElement = videoElement;
  }

  async hasTwoCameras(): Promise<boolean> {
    const mediaDevices = navigator.mediaDevices;
    const devices = await mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === 'videoinput');
    return videoInputs.length >= 2;
  }

  async startCamera(direction: CameraDirection): Promise<void> {
    const stream = this._stream = await this.startCameraDevice(direction);
    this._videoElement!.srcObject = stream;
    this._videoElement!.onloadedmetadata = () => {
      this._videoElement!.play();
    };
  }

  async stopCamera(): Promise<void> {
    if (!this._stream) {
      return;
    }

    this._videoElement!.pause();
    this._videoElement!.srcObject = null;

    const tracks = this._stream.getTracks();
    for (const track of tracks) {
      track.stop();
    }
  }

  override async destroy(): Promise<void> {
    await super.destroy();

    this._videoElement?.remove();
  }

  protected async getRawData(): Promise<string> {
    const { videoWidth: width, videoHeight: height } = this._videoElement!;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context!.clearRect(0, 0, width, height);
    context!.fillStyle = "rgb(255, 255, 255)";
    context!.fillRect(0, 0, width, height);
    context!.drawImage(this._videoElement!, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', rules.image.quality / 100);
  }

  private async startCameraDevice(direction: CameraDirection, forceConstraints: boolean = true): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: direction === CameraDirection.Back ? "environment" : "user",
        width: {
          min: forceConstraints ? rules.image.minWidth : undefined,
          ideal: rules.image.maxWidth
        },
        height: {
          min: forceConstraints ? rules.image.minHeight : undefined,
          ideal: rules.image.maxHeight
        }
      },
      audio: false
    };

    try {
      if (navigator.mediaDevices) {
        return await navigator.mediaDevices.getUserMedia(constraints);
      }

      // Navegadores que não possuem as APIs padrões recomendadas poderão não ter suporte ao "mediaDevices",
      // sendo que deverão utilizar a API anterior, que é desaconselhada atualmente

      return await new Promise((resolve, reject) => {
        const device = navigator as any;
        const getUserMedia = (device.getUserMedia || device.webkitGetUserMedia || device.mozGetUserMedia).bind(navigator);
        getUserMedia(constraints, resolve, reject);
      });
    }
    catch (error) {
      const { name } = error as any;

      if (error instanceof OverconstrainedError && forceConstraints) {
        return await this.startCameraDevice(direction, false);
      }

      if (error instanceof OverconstrainedError || name === "NotAllowedError" || name === "NotFoundError") {
        throw new PermissionError(PermissionType.Camera, "Permissão de acesso à câmera não concedida ou câmera não suportada.");
      }

      throw error;
    }
  }
}
