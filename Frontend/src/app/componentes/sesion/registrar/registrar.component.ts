import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutentificacionService } from 'src/app/shared/servicios/autentificacion.service';
import swal from'sweetalert2';

interface IRegisterForm{
  name: string;
  email: string;
  password: string;
  repeatPass: string;
}

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  titularAlerta="";
  show: boolean;
  show2: boolean;
  mostrar:string;
  mostrar2:string;
  espera:boolean;

  inicioSecionValue:number;
  register: IRegisterForm={
    name: "",
    email: "",
    password: "",
    repeatPass: ""
  };

  constructor(
    private autentificacionServicio:AutentificacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.inicioSecionValue=0;
    this.show = false;
    this.mostrar="mostrar";
    this.show2 = false;
    this.mostrar2="mostrar";
    this.inicioSecionValue=0;
    this.espera=false;
  }

  submit(){

    if(this.inicioSecionValue==0){
      if (this.register.password !== this.register.repeatPass){
          this.authenticate();
      }
    }else{
      this.router.navigate(["/login"]);
    }
  }

  authenticate(){

    let datos={nombreUsuario:this.register.name,correo:this.register.email,contrasenia:this.register.password}
    this.getDatosLogin(datos);

  }

  inicioSesion(){

    this.inicioSecionValue=1;
    //this.router.navigate(["auth/login"]);
  }

  private getDatosLogin(datos:any):void{
    this.espera=true;
    console.log(datos)
    this.autentificacionServicio.registrarUsuario(datos).then((Response)=>{
      if(Response?.Mensaje==="Guardado"){
        this.titularAlerta='Su cuenta fue creada de manera satisfactoria';
        this.espera=false;
        swal.fire('Registro Exitoso', this.titularAlerta, 'success').then((result) => {
            this.router.navigate(["/login"]);
          } 
        );
      } else{
        if(Response?.Mensaje==="Usuario Existente"){
          this.espera=false;
          this.titularAlerta='El correo que desea registrar ya existe';
          swal.fire('Datos Incorrectos', this.titularAlerta, 'error');
        }else{
          this.espera=false;
          this.titularAlerta='sucedio un error inesperado, intente de nuevo';
            swal.fire('Lo Sentimos', this.titularAlerta, 'error');
        }
      }
    },(error) =>{ 
      this.espera=false;
      this.titularAlerta='sucedio un error inesperado, intente de nuevo';
      swal.fire('Lo Sentimos', this.titularAlerta, 'error');
    });

  }

  // click event function toggle
  passwordMostrar():void{
    this.show = !this.show;
    if(this.show){
      this.mostrar="Ocultar"
    }else{
      this.mostrar="Mostrar"
    }
    console.log("Mostrar->",this.show);
  }
  passwordMostrar2():void{
    this.show2 = !this.show2;
    if(this.show2){
      this.mostrar2="Ocultar"
    }else{
      this.mostrar2="Mostrar"
    }
    console.log("Mostrar2->",this.show2);
  }

  registro():void{
    console.log("entra")
    this.router.navigate(["auth/registro"]);
  }

}
