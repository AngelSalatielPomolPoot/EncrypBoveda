import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioSesion } from './shared/interfaces/usuario-sesion';

@Injectable({
  providedIn: 'root'
})
export class UserGuard2Guard implements CanActivate {
  
  datosUsuario:UsuarioSesion;
  constructor(private router:Router){

  }

  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      this.datosUsuario=JSON.parse(sessionStorage.getItem('usuarioData'));
      if(this.datosUsuario){
        this.router.navigate(['principal']);
        return false;
      }else{
        return true;
      }
  }
  
}
