import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingInfoPageRoutingModule } from './booking-info-routing.module';

import { BookingInfoPage } from './booking-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingInfoPageRoutingModule
  ],
  declarations: [BookingInfoPage]
})
export class BookingInfoPageModule {}
