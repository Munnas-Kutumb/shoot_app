import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserBookingListPageRoutingModule } from './user-booking-list-routing.module';

import { UserBookingListPage } from './user-booking-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserBookingListPageRoutingModule
  ],
  declarations: [UserBookingListPage]
})
export class UserBookingListPageModule {}
