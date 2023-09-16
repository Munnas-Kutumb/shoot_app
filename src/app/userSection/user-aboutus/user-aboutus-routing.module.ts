import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAboutusPage } from './user-aboutus.page';

const routes: Routes = [
  {
    path: '',
    component: UserAboutusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAboutusPageRoutingModule {}
