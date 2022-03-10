import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Documentos } from 'src/app/shared/interfaces/documentos';
import { DocumentosService } from 'src/app/shared/servicios/documentos.service';
import swal from'sweetalert2';

//imports jquery    
declare var $: any;

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {
 
  espera:boolean=false;
  mostrarAviso:boolean=false;
  datosCache;
  idUsuarioTemporal;
  show: boolean;
  mostrar:string;

  activado:boolean;
  listaDocumentos:Documentos;
  documento:Documentos;
  
  
  titularAlerta=""

  mensaje:string;
  valorNombreDocumento:string;
  valorNota:string;
  valorArchivoData:string;
  idDocumento:string;
  idUsuario:string;

  constructor(private documentoServicio: DocumentosService,
    private route: ActivatedRoute,
    private router:Router) {
      this.show = false;
      this.mostrar="mostrar";
    }


  //valore iniciales del sistema
  ngOnInit(): void {
    this.datosCache=JSON.parse( sessionStorage.getItem('usuarioData'));
    this.idUsuarioTemporal=this.datosCache.idUsuario;
    this.valorNombreDocumento="";
    this.valorNota=""
    this.activado=false;
    this.documento=null;
    this.listaDocumentos=null;

    this.getDataDocumentos();
    $(document).ready(function() {
      $('#exampleModal').hide();
    });
  }


  //se encarga del proceso para guardar datos
  public guardarDatos():void{
    console.log("Datos Guardados----------");
    if(this.valorNombreDocumento!=="" && this.valorNota!=="" && this.valorArchivoData!==""){
      console.log("valorNombreDocumento->",this.valorNombreDocumento);
      console.log("valorNota->",this.valorNota);
      
      this.mensaje=this.setDataDocumentos({'idUsuario':this.idUsuarioTemporal,'nombreDocumento':this.valorNombreDocumento,"archivoData":this.valorArchivoData,'nota':this.valorNota});
      
    }else{
      console.log("valorNombreDocumento->",this.valorNombreDocumento);
      console.log("valorNota->",this.valorNota);
      this.titularAlerta='No se pudo guardar los datos';
      swal.fire('Campos imcompletos', this.titularAlerta, 'error');
    }
  }

  //obtener datos de las cuentas en la API 
  private getDataDocumentos():void{
    let idUsuarioString=this.idUsuarioTemporal+"";
    this.mostrarAviso=false;
    this.documentoServicio.buscarTodosDocumentos(idUsuarioString).then((Response)=>{
      if(Response?.documentos.length){
        this.listaDocumentos =Response;
        this.mensaje=Response.Mensaje;
        console.log("datos->",this.listaDocumentos);
      } else{
        this.mostrarAviso=true;
        this.listaDocumentos=null;   
      }   
    },(error) =>{ 
      this.mostrarAviso=true;
      this.listaDocumentos=null;
    });
    
  }

  //añadir datos de las cuentas en la API 
  private setDataDocumentos(datos:any):string{
    console.log("datos->",datos);
    let mensajellegada="";
    this.espera=true;
    this.documentoServicio.agregarDocumento(datos).then((Response)=>{
      console.log("Mensaje->",Response.Mensaje);
      if(Response.Mensaje==="Guardado"){
        this.titularAlerta='Los datos se guardaron exitosamente';
        this.getDataDocumentos();
        this.espera=false;
        $(document).ready(function() { //cerrar modal
          $('#exampleModal').modal('toggle');  
        });
        swal.fire('Registro exitoso', this.titularAlerta, 'success').then((result) => {      
            console.log("desactivado")
            this.show = false;
            this.mostrar="mostrar";
            this.valorNota=""
            this.valorNombreDocumento=""
    
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
    this.valorNota=""
    this.valorNombreDocumento=""
  
  }

  //activa la obtencion de datos a visualizar
  public getParametrosDocumento(idCuenta:string,idUsuario:string):void{
    this.idDocumento=idCuenta;
    this.idUsuario=idUsuario;
    this.documento=null;
    this.getDataDocumentoEspecifica();
  }
  
  //obtener dato especifico de la cuenta en la API 
  private getDataDocumentoEspecifica():void{
    this.documentoServicio.buscarDocumentoEspecifica(this.idDocumento,this.idUsuario).then((Response)=>{
      if(Response?.documentos.length){
        this.documento =Response;
        console.log("documento:",this.documento);
        this.mensaje=Response.Mensaje;
        console.log("datos->",this.documento);
      } else{
        this.documento;     
      }   
    },(error) =>{ 
      this.documento=null;
    });
  }

  //obtener los valores para eliminar
  getParametrosEliminar(id:number,idUsuario:number):void{
    let datos=({'idUsuario':idUsuario,'id':id});
    this.eliminarDocumento(datos);
  }

  //proceso de eliminacion
  public eliminarDocumento(datos:any):void{
    this.espera=true;
    this.documentoServicio.eliminarDocumento(datos).then((Response)=>{
      console.log("Mensaje->",Response.Mensaje);
      this.getDataDocumentos();
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
    if(this.valorNombreDocumento!=="" && this.valorNota!=="" && this.valorArchivoData!==""){
      console.log("valorNombreDocumento->",this.valorNombreDocumento);
      console.log("valorNota->",this.valorNota);
      
      this.mensaje=this.setDataDocumentoModificar({'id':this.documento.documentos[0].id,'idUsuario':this.documento.documentos[0].idUsuario,'nombreDocumento':this.valorNombreDocumento,'archivoData':this.documento.documentos[0].archivoData,'nota':this.valorNota});
      
    }else{
      console.log("valorNombredocumento->",this.valorNombreDocumento);
      console.log("valorNota->",this.valorNota);
      this.titularAlerta='No se pudo guardar los datos';
      swal.fire('Campos imcompletos', this.titularAlerta, 'error');
    }
  }

  //inicializar valoresModificar
  setParametroModificar():void{
    this.valorNombreDocumento=this.documento.documentos[0].nombreDocumento;
    this.valorNota=this.documento.documentos[0].nota;
  }

  //añadir datos que se han modificado de las cuentas en la API 
  private setDataDocumentoModificar(datos:any):string{
    console.log("datos->",datos);
    let mensajellegada="";
    this.espera=true;
    this.documentoServicio.actualizarDocumento(datos).then((Response)=>{
      console.log("Mensaje->",Response.Mensaje);
      if(Response.Mensaje==="Dato actualizado exitosamente"){
        this.titularAlerta='Los datos modificados se guardaron exitosamente';
        this.getDataDocumentos();
        this.espera=false;

        $(document).ready(function() { //cerrar modal
          $('#exampleModal3').modal('toggle');  
        });
        swal.fire('Modificacion exitosa', this.titularAlerta, 'success').then((result) => {      
            console.log("desactivado");
            this.show = false;
            this.mostrar="mostrar";
            this.valorNota=""
            this.valorNombreDocumento=""
     
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


  //archivos

  capturarDocumento(event){
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        console.log(reader.result);
        let resultado=reader.result+"";
        let campos=resultado.split(",");
        this.valorArchivoData=campos[1];
        console.log(this.valorArchivoData);
    };
  }

  downloadPdf(base64String, fileName){
    if(window.navigator && window.navigator.msSaveOrOpenBlob){ 
      // download PDF in IE
      let byteChar = atob(base64String);
      let byteArray = new Array(byteChar.length);
      for(let i = 0; i < byteChar.length; i++){
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], {type : 'application/pdf'});
      window.navigator.msSaveOrOpenBlob(blob, `${fileName}.pdf`);
    } else {
      // Download PDF in Chrome etc.
      const source = `data:application/pdf;base64,${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = `${fileName}.pdf`
      link.click();
    }
  }

  onClickDownloadPdf(){
    let base64String =this.documento.documentos[0].archivoData;
    this.downloadPdf(base64String,this.documento.documentos[0].nombreDocumento);
  }


}
