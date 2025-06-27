import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SingletonService } from './singleton.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected http = inject(HttpClient);
  protected apiTable = "";

  constructor(protected singleton : SingletonService) { }

  all(): Observable<any> 
  {
    return this.http.get(this.singleton.apiUrl+"/api/"+this.apiTable,
      {headers:this.singleton.get_header()}
    );
  }

  find(id:string|number):Observable<any>
  {
    return this.http.get(this.singleton.apiUrl+"/api/"+this.apiTable+"/"+id,
      {headers:this.singleton.get_header()}
    );
  }

  create(params:Object) :Observable<any>
  {
    return this.http.post(this.singleton.apiUrl+"/api/"+this.apiTable, params, 
        {headers:this.singleton.get_header()}
    );
  }

  update(id:string|number, params:Object):Observable<any>
  {
    return this.http.post(this.singleton.apiUrl+"/api/"+this.apiTable+'/'+id, params,
      {headers:this.singleton.get_header()}
    )
  }
}
