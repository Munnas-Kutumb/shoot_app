import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryNamePage } from './category-name.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryNamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryNamePageRoutingModule {}
