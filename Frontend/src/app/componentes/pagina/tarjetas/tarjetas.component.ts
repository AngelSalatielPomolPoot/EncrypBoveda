import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tarjetas } from 'src/app/shared/interfaces/tarjetas';
import { TarjetasService } from 'src/app/shared/servicios/tarjetas.service';
import swal from'sweetalert2';

//imports jquery    
declare var $: any;

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.css']
})
export class TarjetasComponent implements OnInit {

  espera:boolean=false;
  mostrarAviso:boolean=false;
  datosCache;
  idUsuarioTemporal;
  show: boolean;
  mostrar:string;

  activado:boolean;
  listaTarjetas:Tarjetas;
  tarjeta:Tarjetas;
  
  listaOpciones:any[]=[
    {tarjeta:'Seleccione una opción',url:""},
    {tarjeta:'VISA'},
    {tarjeta:'MASTERCARD'},
    {tarjeta:'DISCOVER'},
    {tarjeta:'AMEX'},
    {tarjeta:'DINERS'},
    {tarjeta:'JCB'},
    {tarjeta:'SWITCH'},
    {tarjeta:'SOLO'},
    {tarjeta:'DANKORT'},
    {tarjeta:'MAESTRO'},
    {tarjeta:'Otro'},
  ];
  
  titularAlerta=""

  mensaje:string;
  seleccionado:number;
  valueOpcion:string;

  valorNombreTitular:string;
  valorNombreTarjeta:string;
  valorNumeroTarjeta:string;
  valorFechaExpiracion:string;
  valorCVV:string;
  valorNIP:string;
  valorNota:string;

  idTarjeta:string;
  idUsuario:string;

  constructor(private tarjetasServicio:TarjetasService,
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
    this.valorNombreTitular="";
    this.valorNombreTarjeta="";
    this.valorNumeroTarjeta="";
    this.valorFechaExpiracion="";
    this.valorCVV="";
    this.valorNIP="";
    this.valueOpcion="";
    this.activado=false;
    this.tarjeta=null;
    this.listaTarjetas=null;

    this.getDataTarjetas();
    $(document).ready(function() {
      $('#exampleModal').hide();
    });
  }

  //indica la opcion seleccionada para las paginas predeterminadas
  public setOpcion(){
    if(this.seleccionado!=(this.listaOpciones.length-1)){
      if(this.seleccionado!=0){
        console.log("seleccionado->",this.seleccionado);
        this.valorNombreTarjeta=this.listaOpciones[this.seleccionado].tarjeta;
        console.log("valorNombreTarjeta->",this.valorNombreTarjeta);
        this.valueOpcion=this.valorNombreTarjeta;
      }else{
        this.valorNombreTarjeta="";
      }
      
    }else{
      this.valorNombreTarjeta="";
      this.valueOpcion="Otro";
      console.log(this.seleccionado);
      console.log("valorNombreTarjeta->",this.valorNombreTarjeta);
    }
  }

  //se encarga del proceso para guardar datos
  public guardarDatos():void{
    console.log("Datos Guardados----------");
    if(this.valorNombreTitular!=="" && this.valorNombreTarjeta!=="" && this.valorNumeroTarjeta!=="" && this.valorFechaExpiracion!==""
    && this.valorCVV!=="" && this.valorNIP!=="" && this.valorNota!==""){
      console.log("valorNombreTitular->",this.valorNombreTitular);
      console.log("valorNombreTarjeta->",this.valorNombreTarjeta);
      console.log("valorNumeroTarjeta->",this.valorNumeroTarjeta);
      console.log("valorFechaExpiracion->",this.valorFechaExpiracion);
      console.log("valorCVV->",this.valorCVV);
      console.log("valorNIP->",this.valorNIP);
      console.log("valorNota->",this.valorNota);
      
      this.mensaje=this.setDataTarjetas({'idUsuario':this.idUsuarioTemporal, 'nombreTitular':this.valorNombreTitular,'nombreTarjeta':this.valorNombreTarjeta,
    'numeroTarjeta':this.valorNumeroTarjeta, 'expiracion':this.valorFechaExpiracion, 'cvv':this.valorCVV, 'pin':this.valorNIP, 'nota':this.valorNota});
      
    }else{
      console.log("valorNombreTitular->",this.valorNombreTitular);
      console.log("valorNombreTarjeta->",this.valorNombreTarjeta);
      console.log("valorNumeroTarjeta->",this.valorNumeroTarjeta);
      console.log("valorFechaExpiracion->",this.valorFechaExpiracion);
      console.log("valorCVV->",this.valorCVV);
      console.log("valorNIP->",this.valorNIP);
      console.log("valorNota->",this.valorNota);
      this.titularAlerta='No se pudo guardar los datos';
      swal.fire('Campos imcompletos', this.titularAlerta, 'error');
    }
  }

  //obtener datos de las tarjetas en la API 
  private getDataTarjetas():void{
    let idUsuarioString=this.idUsuarioTemporal+"";
    this.mostrarAviso=false;
    this.tarjetasServicio.buscarTodasTarjetas(idUsuarioString).then((Response)=>{
      if(Response?.tarjetas.length){
        this.listaTarjetas =Response;
        this.mensaje=Response.Mensaje;
        console.log("datos->",this.listaTarjetas);
      } else{
        this.mostrarAviso=true;
        this.listaTarjetas=null;   
      }   
    },(error) =>{ 
      this.mostrarAviso=true;
      this.listaTarjetas=null;
    });
    
  }

  //añadir datos de las tarjetas en la API 
  private setDataTarjetas(datos:any):string{
    console.log("datos->",datos);
    let mensajellegada="";
    this.espera=true;
    this.tarjetasServicio.agregarTarjeta(datos).then((Response)=>{
      console.log("Mensaje->",Response.Mensaje);
      if(Response.Mensaje==="Guardado"){
        this.titularAlerta='Los datos se guardaron exitosamente.';
        this.getDataTarjetas();
        this.espera=false;
        $(document).ready(function() { //cerrar modal
          $('#exampleModal').modal('toggle');  
        });
        swal.fire('Registro exitoso', this.titularAlerta, 'success').then((result) => {      
            console.log("desactivado")
            this.show = false;
            this.mostrar="mostrar";
            this.valorNombreTitular="";
            this.valorNombreTarjeta="";
            this.valorNumeroTarjeta="";
            this.valorFechaExpiracion="";
            this.valorCVV=""
            this.valorNIP=""
            this.valorNota="";
            this.seleccionado=0;
          } 
        );
      }else{
        this.espera=false;
        this.titularAlerta='Ocurrio un error inesperado al momento de guardar.';
        swal.fire('Error al guardar', this.titularAlerta, 'error');
      }
       
    },(error) =>{ 
      this.espera=false;
      this.titularAlerta='Ocurrio un error inesperado al momento de guardar.';
      swal.fire('Error al guardar', this.titularAlerta, 'error');
      console.log("error->",error);
    });

    return mensajellegada;
  }

  //limpiar campos añadir Module
  limpiarCampos():void{
    this.valorNombreTitular="";
    this.valorNombreTarjeta="";
    this.valorNumeroTarjeta="";
    this.valorFechaExpiracion="";
    this.valorCVV=""
    this.valorNIP=""
    this.valorNota="";
    this.seleccionado=0;
  }

  //activa la obtencion de datos a visualizar
  public getParametrosTarjeta(idTarjeta:string,idUsuario:string):void{
    this.idTarjeta=idTarjeta;
    this.idUsuario=idUsuario;
    this.tarjeta=null;
    this.getDataTarjetaEspecifica();
  }
  
  //obtener dato especifico de la cuenta en la API 
  private getDataTarjetaEspecifica():void{
    this.tarjetasServicio.buscarTarjetaEspecifica(this.idTarjeta,this.idUsuario).then((Response)=>{
      console.log("Response:",Response)
      if(Response?.tarjetas.length){
        this.tarjeta =Response;
        console.log("tarjeta:",this.tarjeta);
        this.mensaje=Response.Mensaje;
        console.log("datos->",this.tarjeta);
      } else{
        this.tarjeta;
        console.log("datos->",this.tarjeta);    
      }   
    },(error) =>{ 
      console.log("datos->",this.tarjeta);
      this.tarjeta=null;
    });
  }

  //obtener los valores para eliminar
  getParametrosEliminar(id:number,idUsuario:number):void{
    let datos=({'idUsuario':idUsuario,'id':id});
    this.eliminarTarjeta(datos);
  }

  //proceso de eliminacion
  public eliminarTarjeta(datos:any):void{
    this.espera=true;
    this.tarjetasServicio.eliminarTarjeta(datos).then((Response)=>{
      console.log("Mensaje->",Response.Mensaje);
      this.getDataTarjetas();
      if(Response.Mensaje==="Dato eliminado exitosamente"){
        this.titularAlerta='Los datos fueron eliminados exitosamente';
        this.espera=false;
        $(document).ready(function() { //cerrar modal
          $('#exampleModal2').modal('toggle');  
        });
        swal.fire('Eliminacion exitosa.', this.titularAlerta, 'success');
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
    if(this.valorNombreTitular!=="" && this.valorNombreTarjeta!=="" && this.valorNumeroTarjeta!=="" && this.valorFechaExpiracion!==""
    && this.valorCVV!=="" && this.valorNIP!=="" && this.valorNota!==""){
      console.log("valorNombreTitular->",this.valorNombreTitular);
      console.log("valorNombreTarjeta->",this.valorNombreTarjeta);
      console.log("valorNumeroTarjeta->",this.valorNumeroTarjeta);
      console.log("valorFechaExpiracion->",this.valorFechaExpiracion);
      console.log("valorCVV->",this.valorCVV);
      console.log("valorNIP->",this.valorNIP);
      console.log("valorNota->",this.valorNota);
             
      this.mensaje=this.setDataTarjetasModificar({id:this.tarjeta.tarjetas[0].id,'idUsuario':this.tarjeta.tarjetas[0].idUsuario, 'nombreTitular':this.valorNombreTitular,'nombreTarjeta':this.valorNombreTarjeta,
      'numeroTarjeta':this.valorNumeroTarjeta, 'expiracion':this.valorFechaExpiracion, 'cvv':this.valorCVV, 'pin':this.valorNIP, 'nota':this.valorNota});

    }else{
      console.log("valorNombreTitular->",this.valorNombreTitular);
      console.log("valorNombreTarjeta->",this.valorNombreTarjeta);
      console.log("valorNumeroTarjeta->",this.valorNumeroTarjeta);
      console.log("valorFechaExpiracion->",this.valorFechaExpiracion);
      console.log("valorCVV->",this.valorCVV);
      console.log("valorNIP->",this.valorNIP);
      console.log("valorNota->",this.valorNota);

      this.titularAlerta='No se pudo guardar los datos.';
      swal.fire('Campos imcompletos.', this.titularAlerta, 'error');
    }
  }

  //inicializar valoresModificar
  setParametroModificar():void{
    let noEncotrarOpcion= true;
    for(let i=1;i<this.listaOpciones.length;i++){
      if(this.listaOpciones[i].tarjeta===this.tarjeta.tarjetas[0].nombreTarjeta){
        this.seleccionado=i;
        noEncotrarOpcion=false
        
      }
    }

    if(noEncotrarOpcion){
      this.seleccionado=this.listaOpciones.length-1;
    }
    this.valorNombreTitular=this.tarjeta.tarjetas[0].nombreTitular;
    this.valorNombreTarjeta=this.tarjeta.tarjetas[0].nombreTarjeta;
    this.valorNumeroTarjeta=this.tarjeta.tarjetas[0].numeroTarjeta;
    this.valorFechaExpiracion=this.tarjeta.tarjetas[0].expiracion;
    this.valorCVV=this.tarjeta.tarjetas[0].cvv;
    this.valorNIP=this.tarjeta.tarjetas[0].pin;
    this.valorNota=this.tarjeta.tarjetas[0].nota;
  }

  //añadir datos que se han modificado de las tarjetas en la API 
  private setDataTarjetasModificar(datos:any):string{
    console.log("datos->",datos);
    let mensajellegada="";
    this.espera=true;
    this.tarjetasServicio.actualizarTarjeta(datos).then((Response)=>{
      console.log("Mensaje->",Response.Mensaje);
      if(Response.Mensaje==="Dato actualizado exitosamente"){
        this.titularAlerta='Los datos modificados se guardaron exitosamente.';
        this.getDataTarjetas();
        this.espera=false;

        $(document).ready(function() { //cerrar modal
          $('#exampleModal3').modal('toggle');  
        });
        swal.fire('Modificacion exitosa', this.titularAlerta, 'success').then((result) => {      
            console.log("desactivado");
            this.show = false;
            this.mostrar="mostrar";
            this.valorNombreTitular="";
            this.valorNombreTarjeta="";
            this.valorNumeroTarjeta="";
            this.valorFechaExpiracion="";
            this.valorCVV=""
            this.valorNIP=""
            this.valorNota="";
            this.seleccionado=0;
          } 
        );
      }else{
        this.espera=false;
        this.titularAlerta='Ocurrio un error inesperado al momento de guardar la modificación.';
        swal.fire('Error al guardar.', this.titularAlerta, 'error');
      }
       
    },(error) =>{ 
      this.espera=false;
      this.titularAlerta='Ocurrio un error inesperado al momento de guardar la modificación.';
      swal.fire('Error al guardar.', this.titularAlerta, 'error');
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

