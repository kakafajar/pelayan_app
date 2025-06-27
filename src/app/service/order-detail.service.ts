import { Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService extends ApiService {
  protected override apiTable: string = "order_details";
}
