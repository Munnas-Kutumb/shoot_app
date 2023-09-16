import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLiveEventPage } from './user-live-event.page';

const routes: Routes = [
  {
    path: '',
    component: UserLiveEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserLiveEventPageRoutingModule {}
