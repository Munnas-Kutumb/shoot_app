import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddGstDetailsPage } from './add-gst-details.page';

const routes: Routes = [
  {
    path: '',
    component: AddGstDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddGstDetailsPageRoutingModule {}
