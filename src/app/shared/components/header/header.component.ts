import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioSesion } from '../../interfaces/usuario-sesion';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuarioSesion:any;
  constructor(
    private router:Router
  ) {
    
  }

  ngOnInit(): void {
    console.log("Tiene dato:",sessionStorage.getItem('usuarioData'))
    this.usuarioSesion=JSON.parse( sessionStorage.getItem('usuarioData'));
  }

  cerrarSesion():void{
    console.log("Cerrar sesion")
    sessionStorage.removeItem("usuarioData");
    this.router.navigate(['/login']);
  }
  
}
