import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, single } from 'rxjs';
import { SingletonService } from './singleton.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  constructor(private singleton: SingletonService, private router:Router){}

  login(email:string, password:string): Observable<any> 
  {
    return this.http.post(this.singleton.apiUrl+"/api/login", {
      "email" : email,
      'password' :password
    });
  }

  register(username:string, email:string, no_hp:string, password:string): Observable<any>
  {
    return this.http.post(this.singleton.apiUrl+"/api/register", {
      "username" : username,
      "email" : email,
      "no_hp" : no_hp,
      'password' :password
    });
  }

  logout()
  {
    this.http.post(this.singleton.apiUrl+"/api/logout",{}, {
      headers : this.singleton.get_header()})
      .subscribe(response=>{
        localStorage.clear();
        this.router.navigate(['/login']);
      });
  }

  checkUser(username:string|any, password:string|any)
  {
    return this.http.post(this.singleton.apiUrl+"/api/check_user",
      {
        username : username,
        password : password
      }, {headers:this.singleton.get_header()});
  }

  checkToken()
  {
    return this.http.post(this.singleton.apiUrl+"/api/check_token",
      {token : localStorage.getItem("token")}, {headers:this.singleton.get_header()}
    )
  }

  refreshUserInStorage(newUserData:string|object|any)
  {
    let userData = newUserData;
    if ((typeof newUserData) === 'string'){
      userData = JSON.parse(newUserData);
      localStorage.setItem("user", newUserData);
    }else if((typeof newUserData) === 'object'){
      localStorage.setItem("user", JSON.stringify(newUserData));
    }
    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("username", userData.username);
  }
  
}
