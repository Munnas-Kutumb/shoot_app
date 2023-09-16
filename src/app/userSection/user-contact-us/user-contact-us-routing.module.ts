import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContactUsPage } from './user-contact-us.page';

const routes: Routes = [
  {
    path: '',
    component: UserContactUsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserContactUsPageRoutingModule {}
