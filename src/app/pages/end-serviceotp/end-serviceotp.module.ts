import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EndServiceotpPageRoutingModule } from './end-serviceotp-routing.module';

import { EndServiceotpPage } from './end-serviceotp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EndServiceotpPageRoutingModule
  ],
  declarations: [EndServiceotpPage]
})
export class EndServiceotpPageModule {}
