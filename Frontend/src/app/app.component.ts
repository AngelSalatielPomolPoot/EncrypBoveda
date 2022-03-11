import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BovedaEncriptacion';

  
  activarBarra=false;
  contador=0;
  
  constructor( private router: Router){
    
  }

  ngOnInit(): void {
    this.router.events.subscribe(value => {
      if(this.router.url.toString()!="/" && this.router.url.toString()!="/login" && this.router.url.toString()!="/registrar"){
        this.activarBarra=true;
      }
      else{
        this.activarBarra=false;
      }
    });
  }
}
