import { Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {
  protected override apiTable: string = "users";
}
