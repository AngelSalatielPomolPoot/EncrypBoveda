import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentasContrasenias } from 'src/app/shared/interfaces/cuentas-contrasenias';
import { ContraseniasService } from 'src/app/shared/servicios/contrasenias.service';
import swal from'sweetalert2';

//imports jquery    
declare var $: any;

@Component({
  selector: 'app-contrasenias',
  templateUrl: './contrasenias.component.html',
  styleUrls: ['./contrasenias.component.css']
})
export class ContraseniasComponent implements OnInit {
  espera:boolean=false;
  mostrarAviso:boolean=false;
  datosCache;
  idUsuarioTemporal;
  show: boolean;
  mostrar:string;

  activado:boolean;
  listaCuentas:CuentasContrasenias;
  cuentaUsuario:CuentasContrasenias;
  listaUsuarios:any[]=[
    {sitioWeb:'Mercado Libre',usuario:"fulanitodetal@gmail.com"},
    {sitioWeb:'Hotmail',usuario:"desconocido_25@hotmail.com"},
    {sitioWeb:'Gmail',usuario:"computadora@gmail.com"},
    {sitioWeb:'Gmail2',usuario:"computadora2222@gmail.com"},
  ];

  listaOpciones:any[]=[
    {sitioWeb:'Seleccione una opccion',url:""},
    {sitioWeb:'Mercado Libre',url:"www.mercadolibre.com"},
    {sitioWeb:'Hotmail',url:"www.hotmail.com"},
    {sitioWeb:'Gmail',url:"www.gmail.com"},
    {sitioWeb:'Facebook',url:"www.facebook.com"},
    {sitioWeb:'Otro',url:""},
  ];
  
  titularAlerta=""

  mensaje:string;
  seleccionado:number;
  valueOpcion:string;
  valorSitioWeb:string;
  valorUrl:string;
  valorUsuario:string;
  valorContrasenia:string;
  idCuenta:string;
  idUsuario:string;

  constructor(private contraseniasServicio:ContraseniasService,
    private route: ActivatedRoute,
    private router:Router) {
      this.show = false;
      this.mostrar="mostrar";
    }


  //valore iniciales del sistema
  ngOnInit(): void {
    this.datosCache=JSON.parse( sessionStorage.getItem('usuarioData'));
    this.idUsuarioTemporal=this.datosCache.idUsuario;
    this.seleccionado=0;
    this.valorSitioWeb="";
    this.valorUrl="";
    this.valorUsuario="";
    this.valorContrasenia=""
    this.valueOpcion="";
    this.activado=false;
    this.cuentaUsuario=null;
    this.listaCuentas=null;

    this.getDataCuentas();
    $(document).ready(function() {
      $('#exampleModal').hide();
    });
  }

  //indica la opcion seleccionada para las paginas predeterminadas
  public setOpcion(){
    if(this.seleccionado!=(this.listaOpciones.length-1)){
      if(this.seleccionado!=0){
        console.log("seleccionado->",this.seleccionado);
        this.valorSitioWeb=this.listaOpciones[this.seleccionado].sitioWeb;
        console.log("valorSitioWeb->",this.valorSitioWeb);
        this.valorUrl=this.listaOpciones[this.seleccionado].url;
        console.log("valorUrl->",this.valorUrl);
        this.valueOpcion=this.valorSitioWeb;
      }else{
        this.valorSitioWeb="";
        this.valorUrl="";
      }
      
    }else{
      this.valorSitioWeb="";
      this.valorUrl="";
      this.valueOpcion="Otro";
      console.log("valorSitioWeb->",this.valorSitioWeb);
      console.log("valorUrl->",this.valorUrl);
    }
  }

  //se encarga del proceso para guardar datos
  public guardarDatos():void{
    console.log("Datos Guardados----------");
    if(this.valorSitioWeb!=="" && this.valorUrl!=="" && this.valorUsuario!=="" && this.valorContrasenia!==""){
      console.log("valorSitioWeb->",this.valorSitioWeb);
      console.log("valorUrl->",this.valorUrl);
      console.log("valorUsuario->",this.valorUsuario);
      console.log("valorContrasenia->",this.valorContrasenia);
      
      this.mensaje=this.setDataCuentas({'idUsuario':this.idUsuarioTemporal,'sitioWeb':this.valorSitioWeb,'urlSitioWeb':this.valorUrl,'usuario':this.valorUsuario,'contrasenia':this.valorContrasenia});
      
    }else{
      console.log("valorSitioWeb->",this.valorSitioWeb);
      console.log("valorUrl->",this.valorUrl);
      console.log("valorUsuario->",this.valorUsuario);
      console.log("valorContrasenia->",this.valorContrasenia);
      this.titularAlerta='No se pudo guardar los datos';
      swal.fire('Campos imcompletos', this.titularAlerta, 'error');
    }
  }

  //obtener datos de las cuentas en la API 
  private getDataCuentas():void{
    let idUsuarioString=this.idUsuarioTemporal+"";
    this.mostrarAviso=false;
    this.contraseniasServicio.buscarTodasCuentas(idUsuarioString).then((Response)=>{
      if(Response?.cuentas.length){
        this.listaCuentas =Response;
        this.mensaje=Response.Mensaje;
        console.log("datos->",this.listaCuentas);
      } else{
        this.mostrarAviso=true;
        this.listaCuentas=null;   
      }   
    },(error) =>{ 
      this.mostrarAviso=true;
      this.listaCuentas=null;
    });
    
  }

  //añadir datos de las cuentas en la API 
  private setDataCuentas(datos:any):string{
    console.log("datos->",datos);
    let mensajellegada="";
    this.espera=true;
    this.contraseniasServicio.agregarCuenta(datos).then((Response)=>{
      console.log("Mensaje->",Response.Mensaje);
      if(Response.Mensaje==="Guardado"){
        this.titularAlerta='Los datos se guardaron exitosamente';
        this.getDataCuentas();
        this.espera=false;
        $(document).ready(function() { //cerrar modal
          $('#exampleModal').modal('toggle');  
        });
        swal.fire('Registro exitoso', this.titularAlerta, 'success').then((result) => {      
            console.log("desactivado")
            this.show = false;
            this.mostrar="mostrar";
            this.valorSitioWeb="";
            this.valorUrl="";
            this.valorContrasenia=""
            this.valorUsuario=""
            this.seleccionado=0;
          } 
        );
      }else{
        this.espera=false;
        this.titularAlerta='Ocurrio un error inesperado al momento de guardar';
        swal.fire('Error Al Guardar', this.titularAlerta, 'error');
      }
       
    },(error) =>{ 
      this.espera=false;
      this.titularAlerta='Ocurrio un error inesperado al momento de guardar';
      swal.fire('Error Al Guardar', this.titularAlerta, 'error');
      console.log("error->",error);
    });

    return mensajellegada;
  }

  //limpiar campos añadir Module
  limpiarCampos():void{
    this.valorSitioWeb="";
    this.valorUrl="";
    this.valorContrasenia=""
    this.valorUsuario=""
    this.seleccionado=0;
  }

  //activa la obtencion de datos a visualizar
  public getParametrosCuenta(idCuenta:string,idUsuario:string):void{
    this.idCuenta=idCuenta;
    this.idUsuario=idUsuario;
    this.cuentaUsuario=null;
    this.getDataCuentaEspecifica();
  }
  
  //obtener dato especifico de la cuenta en la API 
  private getDataCuentaEspecifica():void{
    this.contraseniasServicio.buscarCuentaEspecifica(this.idCuenta,this.idUsuario).then((Response)=>{
      if(Response?.cuentas.length){
        this.cuentaUsuario =Response;
        console.log("cuentaUsuario:",this.cuentaUsuario);
        this.mensaje=Response.Mensaje;
        console.log("datos->",this.cuentaUsuario);
      } else{
        this.cuentaUsuario;     
      }   
    },(error) =>{ 
      this.cuentaUsuario=null;
    });
  }

  //obtener los valores para eliminar
  getParametrosEliminar(id:number,idUsuario:number):void{
    let datos=({'idUsuario':idUsuario,'id':id});
    this.eliminarCuenta(datos);
  }

  //proceso de eliminacion
  public eliminarCuenta(datos:any):void{
    this.espera=true;
    this.contraseniasServicio.eliminarCuenta(datos).then((Response)=>{
      console.log("Mensaje->",Response.Mensaje);
      this.getDataCuentas();
      if(Response.Mensaje==="Dato eliminado exitosamente"){
        this.titularAlerta='Los datos fueron eliminados exitosamente';
        this.espera=false;
        $(document).ready(function() { //cerrar modal
          $('#exampleModal2').modal('toggle');  
        });
        swal.fire('Eliminacion exitosa', this.titularAlerta, 'success');
      }else{
        this.espera=false;
        this.titularAlerta='Ocurrio un error inesperado al momento de eliminar';
        swal.fire('Error Al Eliminar', this.titularAlerta, 'error');
      }
    },(error) =>{ 
      this.espera=false;
      this.titularAlerta='Ocurrio un error inesperado al momento de eliminar';
      swal.fire('Error Al Eliminar', this.titularAlerta, 'error');
      console.log("error->",error);
    });

  }

  //guarda los datos modificados
  public guardarDatosModificados():void{
    console.log("Datos Modificados Guardados----------");
    if(this.valorSitioWeb!=="" && this.valorUrl!=="" && this.valorUsuario!=="" && this.valorContrasenia!==""){
      console.log("valorSitioWeb->",this.valorSitioWeb);
      console.log("valorUrl->",this.valorUrl);
      console.log("valorUsuario->",this.valorUsuario);
      console.log("valorContrasenia->",this.valorContrasenia);
      
      this.mensaje=this.setDataCuentasModificar({'id':this.cuentaUsuario.cuentas[0].id,'idUsuario':this.cuentaUsuario.cuentas[0].idUsuario,'sitioWeb':this.valorSitioWeb,'urlSitioWeb':this.valorUrl,'usuario':this.valorUsuario,'contrasenia':this.valorContrasenia});
      
    }else{
      console.log("valorSitioWeb->",this.valorSitioWeb);
      console.log("valorUrl->",this.valorUrl);
      console.log("valorUsuario->",this.valorUsuario);
      console.log("valorContrasenia->",this.valorContrasenia);
      this.titularAlerta='No se pudo guardar los datos';
      swal.fire('Campos imcompletos', this.titularAlerta, 'error');
    }
  }

  //inicializar valoresModificar
  setParametroModificar():void{
    let noEncotrarOpcion= true;
    for(let i=1;i<this.listaOpciones.length;i++){
      if(this.listaOpciones[i].sitioWeb===this.cuentaUsuario.cuentas[0].sitioWeb){
        this.seleccionado=i;
        noEncotrarOpcion=false
        
      }
    }

    if(noEncotrarOpcion){
      this.seleccionado=this.listaOpciones.length-1;
    }

    this.valorSitioWeb=this.cuentaUsuario.cuentas[0].sitioWeb;
    this.valorUrl=this.cuentaUsuario.cuentas[0].urlSitioWeb;
    this.valorUsuario=this.cuentaUsuario.cuentas[0].usuario;
    this.valorContrasenia=this.cuentaUsuario.cuentas[0].contrasenia;
  }

  //añadir datos que se han modificado de las cuentas en la API 
  private setDataCuentasModificar(datos:any):string{
    console.log("datos->",datos);
    let mensajellegada="";
    this.espera=true;
    this.contraseniasServicio.actualizarCuenta(datos).then((Response)=>{
      console.log("Mensaje->",Response.Mensaje);
      if(Response.Mensaje==="Dato actualizado exitosamente"){
        this.titularAlerta='Los datos modificados se guardaron exitosamente';
        this.getDataCuentas();
        this.espera=false;

        $(document).ready(function() { //cerrar modal
          $('#exampleModal3').modal('toggle');  
        });
        swal.fire('Modificacion exitosa', this.titularAlerta, 'success').then((result) => {      
            console.log("desactivado");
            this.show = false;
            this.mostrar="mostrar";
            this.valorSitioWeb="";
            this.valorUrl="";
            this.valorContrasenia=""
            this.valorUsuario=""
            this.seleccionado=0;
          } 
        );
      }else{
        this.espera=false;
        this.titularAlerta='Ocurrio un error inesperado al momento de guardar la modificación';
        swal.fire('Error Al Guardar', this.titularAlerta, 'error');
      }
       
    },(error) =>{ 
      this.espera=false;
      this.titularAlerta='Ocurrio un error inesperado al momento de guardar la modificación';
      swal.fire('Error Al Guardar', this.titularAlerta, 'error');
      console.log("error->",error);
    });

    return mensajellegada;
  }

  goToLink(url: string){
    console.log(url)
    window.open("https:"+url, "_blank");
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
  
}
