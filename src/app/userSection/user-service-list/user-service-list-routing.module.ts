import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserServiceListPage } from './user-service-list.page';

const routes: Routes = [
  {
    path: '',
    component: UserServiceListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserServiceListPageRoutingModule {}
