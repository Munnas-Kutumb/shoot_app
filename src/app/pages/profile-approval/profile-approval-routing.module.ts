import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileApprovalPage } from './profile-approval.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileApprovalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileApprovalPageRoutingModule {}
