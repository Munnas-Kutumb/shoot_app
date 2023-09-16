import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentityVerificationPage } from './identity-verification.page';

const routes: Routes = [
  {
    path: '',
    component: IdentityVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentityVerificationPageRoutingModule {}
