import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SingletonService {
    public apiUrl:string = "https://trihar.my.id";
    public temps:any ={};

    public get_header(){
        return new HttpHeaders({
            "Authorization" : "Bearer " + localStorage.getItem("token")
        });  
    }

    public clearTemps(){
        this.temps = {};
    }
}