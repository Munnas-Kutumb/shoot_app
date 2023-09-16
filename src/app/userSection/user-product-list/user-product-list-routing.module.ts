import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProductListPage } from './user-product-list.page';

const routes: Routes = [
  {
    path: '',
    component: UserProductListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProductListPageRoutingModule {}
