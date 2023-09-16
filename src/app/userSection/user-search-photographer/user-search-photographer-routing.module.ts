import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSearchPhotographerPage } from './user-search-photographer.page';

const routes: Routes = [
  {
    path: '',
    component: UserSearchPhotographerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSearchPhotographerPageRoutingModule {}
