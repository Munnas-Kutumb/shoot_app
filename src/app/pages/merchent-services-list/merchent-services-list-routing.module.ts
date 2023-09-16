import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerchentServicesListPage } from './merchent-services-list.page';

const routes: Routes = [
  {
    path: '',
    component: MerchentServicesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchentServicesListPageRoutingModule {}
