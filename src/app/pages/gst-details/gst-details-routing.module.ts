import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GstDetailsPage } from './gst-details.page';

const routes: Routes = [
  {
    path: '',
    component: GstDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GstDetailsPageRoutingModule {}
