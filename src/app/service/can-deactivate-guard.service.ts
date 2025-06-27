import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface canDeactivateComponent{
  hasUnsavedTasks:boolean;
  askToConfirm(nextState:RouterStateSnapshot):void;
  onDeactivation():void;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuardService implements CanDeactivate<canDeactivateComponent>
{

  constructor() { }

  canDeactivate(component: canDeactivateComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (component.hasUnsavedTasks){
      component.askToConfirm(nextState);
    }else{
      component.onDeactivation();
    }
    return component.hasUnsavedTasks == false;
  }
}
