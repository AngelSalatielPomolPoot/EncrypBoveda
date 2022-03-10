import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CuentasContrasenias } from '../interfaces/cuentas-contrasenias';

@Injectable({
  providedIn: 'root'
})
export class ContraseniasService {

  constructor(private http: HttpClient) { }
  cachedValues:Array<{
    [cuentas:string]:CuentasContrasenias
  }>=[];

  buscarTodasCuentas = (idUduario:string):Promise<CuentasContrasenias> =>{
    const filter= `/api/cuentas?id_usuario=${idUduario}`;
    let promise= new Promise<CuentasContrasenias>((resolve,reject) =>{
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
          resolve(response as CuentasContrasenias)
        },(error) =>{
          reject(error);
        })
      }
    })
    return promise;
  }

  buscarCuentaEspecifica = (idCuenta:string,idUduario:string):Promise<CuentasContrasenias> =>{
    const filter= `api/cuentas/busqueda?id_cuenta=${idCuenta}&id_usuario=${idUduario}`;
    let promise= new Promise<CuentasContrasenias>((resolve,reject) =>{
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
          resolve(response as CuentasContrasenias)
        },(error) =>{
          reject(error);
        })
      }
    })
    return promise;
  }

  agregarCuenta = (dato:any):Promise<CuentasContrasenias> =>{
    const filter= `/api/cuentas_add`;
    let promise= new Promise<CuentasContrasenias>((resolve,reject) =>{
      this.http.post(
        filter,dato
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as CuentasContrasenias)
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }

  
  eliminarCuenta = (dato:any):Promise<CuentasContrasenias> =>{
    const filter= `/api/cuentas_delete`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'acceder':'True'
      }),
      body: dato,
    };
    console.log(options);
    let promise= new Promise<CuentasContrasenias>((resolve,reject) =>{
      this.http.delete(
        filter, options  
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as CuentasContrasenias);
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }

  actualizarCuenta = (datos:any):Promise<CuentasContrasenias> =>{
    const filter= `/api/cuentas_update`;
    var optiones = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'acceder':'True'
      }),
    };
    console.log(optiones);
    let promise= new Promise<CuentasContrasenias>((resolve,reject) =>{
      this.http.put(
        filter,datos,optiones, 
      ).toPromise()
      .then((response)=>{
        console.log(response);
        resolve(response as CuentasContrasenias);
      },(error) =>{
        reject(error);
      })
    })
    return promise;
  }


}
