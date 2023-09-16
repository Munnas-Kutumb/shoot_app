import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartServiceOtpPageRoutingModule } from './start-service-otp-routing.module';

import { StartServiceOtpPage } from './start-service-otp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartServiceOtpPageRoutingModule
  ],
  declarations: [StartServiceOtpPage]
})
export class StartServiceOtpPageModule {}
