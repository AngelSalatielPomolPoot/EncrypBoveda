import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tarjetas } from '../interfaces/tarjetas';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {

  constructor(private http: HttpClient) { }
  cachedValues:Array<{
    [cuentas:string]:Tarjetas
  }>=[];

  buscarTodasTarjetas = (idUduario:string):Promise<Tarjetas> =>{
    const filter= `/api/tarjetas?id_usuario=${idUduario}`;
    let promise= new Promise<Tarjetas>((resolve,reject) =>{
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
          resolve(response as Tarjetas)
        },(error) =>{
          reject(error);
        })
      }
    })
    return promise;
  }

  buscarTarjetaEspecifica = (idTarjeta:string,idUduario:string):Promise<Tarjetas> =>{
    const filter= `api/tarjetas/busqueda?id_tarjeta=${idTarjeta}&id_usuario=${idUduario}`;
    let promise= new Promise<Tarjetas>((resolve,reject) =>{
      if (this.cachedValues[<string>idTarjeta]){
        resolve(this.cachedValues[idTarjeta])
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
          resolve(response as Tarjetas)
        },(error) =>{
          reject(error);
        })
      }
    })
    return promise;
  }

  agregarTarjeta = (dato:any):Promise<Tarjetas> =>{
    const filter= `/api/tarjetas_add`;
    let promise= new Promise<Tarjetas>((resolve,reject) =>{
      this.http.post(
        filter,dato
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as Tarjetas)
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }

  
  eliminarTarjeta = (dato:any):Promise<Tarjetas> =>{
    const filter= `/api/tarjeta_delete`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'acceder':'True'
      }),
      body: dato,
    };
    console.log(options);
    let promise= new Promise<Tarjetas>((resolve,reject) =>{
      this.http.delete(
        filter, options  
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as Tarjetas);
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }

  actualizarTarjeta = (datos:any):Promise<Tarjetas> =>{
    const filter= `/api/tarjetas_update`;
    var optiones = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'acceder':'True'
      }),
    };
    console.log(optiones);
    let promise= new Promise<Tarjetas>((resolve,reject) =>{
      this.http.put(
        filter,datos,optiones, 
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as Tarjetas);
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }


}
