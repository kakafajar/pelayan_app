import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransaksiService extends ApiService {
    protected override apiTable: string = "transaksis";

    whereUserId(user_id:any) : Observable<any>
    {
      return this.http.get(this.singleton.apiUrl+"/api/transaksis/user/"+user_id, {
        headers:this.singleton.get_header()
      })
    }

    override update(id: string | number, params: Object): Observable<any> {
      return this.http.post(this.singleton.apiUrl+"/api/transaksis/"+id, params,
        {headers:this.singleton.get_header()}
      );
    }
}
