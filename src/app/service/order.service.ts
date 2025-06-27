import { Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiService {
  protected override apiTable: string = "orders";
}
