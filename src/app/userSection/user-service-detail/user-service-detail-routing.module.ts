import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserServiceDetailPage } from './user-service-detail.page';

const routes: Routes = [
  {
    path: '',
    component: UserServiceDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserServiceDetailPageRoutingModule {}
