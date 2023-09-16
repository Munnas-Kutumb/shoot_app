import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserBookingListPage } from './user-booking-list.page';

const routes: Routes = [
  {
    path: '',
    component: UserBookingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserBookingListPageRoutingModule {}
