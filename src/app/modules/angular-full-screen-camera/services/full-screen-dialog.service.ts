import { ComponentRef, Injectable, Type } from '@angular/core';

import { Subject } from 'rxjs';
import { ComponentCreatorService } from './component-creator.service';

@Injectable()
export class FullScreenDialogService {

  public dialogSub = new Subject<any>();
  public dialog$ = this.dialogSub.asObservable();


  componentRef!: ComponentRef<any>;
  constructor(private componentCreatorService: ComponentCreatorService) {
  }

  showDialog<T>(component: Type<T>, params?: any) {
    this.componentRef = this.componentCreatorService.appendComponentToBody(component, params);
    return this.dialog$;
  }

  closeDialog(response?: any) {
    this.componentCreatorService.removeComponentFromBody(this.componentRef);
    this.dialogSub.next(response);
  }
}
