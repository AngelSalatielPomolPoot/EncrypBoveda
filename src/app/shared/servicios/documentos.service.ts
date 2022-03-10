import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Documentos } from '../interfaces/documentos';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  constructor(private http: HttpClient) { }
  cachedValues:Array<{
    [cuentas:string]:Documentos
  }>=[];

  buscarTodosDocumentos = (idUduario:string):Promise<Documentos> =>{
    const filter= `/api/documentos?id_usuario=${idUduario}`;
    let promise= new Promise<Documentos>((resolve,reject) =>{
      if (this.cachedValues[<string>idUduario]){
        resolve(this.cachedValues[idUduario])
      }else{
        this.http.get(
          filter,
          {headers:
            {
              "acceder": "True",
            }
          }
        ).toPromise()
        .then((response)=>{
          resolve(response as Documentos)
        },(error) =>{
          reject(error);
        })
      }
    })
    return promise;
  }

  buscarDocumentoEspecifica = (idCuenta:string,idUduario:string):Promise<Documentos> =>{
    const filter= `api/documentos/busqueda?id_documento=${idCuenta}&id_usuario=${idUduario}`;
    let promise= new Promise<Documentos>((resolve,reject) =>{
      if (this.cachedValues[<string>idCuenta]){
        resolve(this.cachedValues[idCuenta])
      }else{
        this.http.get(
          filter,
          {headers:
            {
              "acceder": "True",
            }
          }
        ).toPromise()
        .then((response)=>{
          resolve(response as Documentos)
        },(error) =>{
          reject(error);
        })
      }
    })
    return promise;
  }

  agregarDocumento = (dato:any):Promise<Documentos> =>{
    const filter= `/api/documento_add`;
    let promise= new Promise<Documentos>((resolve,reject) =>{
      this.http.post(
        filter,dato
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as Documentos)
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }

  
  eliminarDocumento = (dato:any):Promise<Documentos> =>{
    const filter= `/api/documento_delete`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'acceder':'True'
      }),
      body: dato,
    };
    console.log(options);
    let promise= new Promise<Documentos>((resolve,reject) =>{
      this.http.delete(
        filter, options  
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as Documentos);
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }

  actualizarDocumento = (datos:any):Promise<Documentos> =>{
    const filter= `/api/documento_update`;
    var optiones = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'acceder':'True'
      }),
    };
    console.log(optiones);
    let promise= new Promise<Documentos>((resolve,reject) =>{
      this.http.put(
        filter,datos,optiones, 
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as Documentos);
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }

}
