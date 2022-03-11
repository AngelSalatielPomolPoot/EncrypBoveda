import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioSesion } from '../interfaces/usuario-sesion';

@Injectable({
  providedIn: 'root'
})
export class AutentificacionService {
  cachedValues:Array<{
    [usuario:string]:UsuarioSesion
  }>=[];

  constructor(private http: HttpClient) { }


  registrarUsuario = (dato:any):Promise<UsuarioSesion> =>{
    const filter= `/api/usuario_add`;
    let promise= new Promise<UsuarioSesion>((resolve,reject) =>{
      this.http.post(
        filter,dato
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as UsuarioSesion)
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }

  loginUsuario = (dato:any):Promise<UsuarioSesion> =>{
    const filter= `/api/usuario_login`;
    let promise= new Promise<UsuarioSesion>((resolve,reject) =>{
      this.http.post(
        filter,dato
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as UsuarioSesion)
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }

  
}
