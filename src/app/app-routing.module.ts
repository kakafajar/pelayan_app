import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'layanan/:jenis',
    loadChildren: () => import('./layanan/layanan.module').then( m => m.LayananPageModule)
  },  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'konfirmasi',
    loadChildren: () => import('./konfirmasi/konfirmasi.module').then( m => m.KonfirmasiPageModule)
  },
  {
    path: 'pesanan',
    loadChildren: () => import('./pesanan/pesanan.module').then( m => m.PesananPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
