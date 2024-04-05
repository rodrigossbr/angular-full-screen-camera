import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Type
} from '@angular/core';

@Injectable()
export class ComponentCreatorService {

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) { }

  appendComponentToBody<T>(component: Type<T>, componentParams?: any): ComponentRef<T> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    if (componentParams) {
      Object.assign(componentRef.instance as any, componentParams);
    }

    return componentRef;
  }

  removeComponentFromBody<T>(componentRef: ComponentRef<T>) {
    document.body.removeChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
  }
}
