import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutusVendorPage } from './aboutus-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: AboutusVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutusVendorPageRoutingModule {}
