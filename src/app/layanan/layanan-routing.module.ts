import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayananPage } from './layanan.page';

const routes: Routes = [
  {
    path: '',
    component: LayananPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayananPageRoutingModule {}
