import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EndServiceotpPage } from './end-serviceotp.page';

const routes: Routes = [
  {
    path: '',
    component: EndServiceotpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EndServiceotpPageRoutingModule {}
