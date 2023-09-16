import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerReferralPage } from './mer-referral.page';

const routes: Routes = [
  {
    path: '',
    component: MerReferralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerReferralPageRoutingModule {}
