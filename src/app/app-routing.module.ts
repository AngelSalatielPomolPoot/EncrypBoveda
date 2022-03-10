import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuardGuard } from './user-guard.guard';
import { UserGuard2Guard } from './user-guard2.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/login',
    pathMatch:'full',
  },
  { path: 'contrasenias',canActivate:[UserGuardGuard], loadChildren: () => import('./componentes/pagina/contrasenias/contrasenias.module').then(m => m.ContraseniasModule) },
  { path: 'principal',canActivate:[UserGuardGuard], loadChildren: () => import('./componentes/pagina/principal/principal.module').then(m => m.PrincipalModule) },
  { path: 'tarjetas',canActivate:[UserGuardGuard], loadChildren: () => import('./componentes/pagina/tarjetas/tarjetas.module').then(m => m.TarjetasModule) },
  { path: 'documentos',canActivate:[UserGuardGuard], loadChildren: () => import('./componentes/pagina/documentos/documentos.module').then(m => m.DocumentosModule) },
  { path: 'login',canActivate:[UserGuard2Guard], loadChildren: () => import('./componentes/sesion/login/login.module').then(m => m.LoginModule) },
  { path: 'registrar',canActivate:[UserGuard2Guard], loadChildren: () => import('./componentes/sesion/registrar/registrar.module').then(m => m.RegistrarModule) },
  { 
    path: '**', redirectTo:'/principal'  //pagina no encontrada
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
