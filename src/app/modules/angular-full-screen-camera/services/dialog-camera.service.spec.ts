import { TestBed } from '@angular/core/testing';

import { DialogCameraService } from './dialog-camera.service';

describe('DialogCameraService', () => {
  let service: DialogCameraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogCameraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
