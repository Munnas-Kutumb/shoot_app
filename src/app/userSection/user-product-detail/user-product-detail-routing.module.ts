import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProductDetailPage } from './user-product-detail.page';

const routes: Routes = [
  {
    path: '',
    component: UserProductDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProductDetailPageRoutingModule {}
