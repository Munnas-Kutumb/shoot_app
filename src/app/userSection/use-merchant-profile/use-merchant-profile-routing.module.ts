import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UseMerchantProfilePage } from './use-merchant-profile.page';

const routes: Routes = [
  {
    path: '',
    component: UseMerchantProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UseMerchantProfilePageRoutingModule {}
