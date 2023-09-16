import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddGstDetailsPageRoutingModule } from './add-gst-details-routing.module';

import { AddGstDetailsPage } from './add-gst-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddGstDetailsPageRoutingModule
  ],
  declarations: [AddGstDetailsPage]
})
export class AddGstDetailsPageModule {}
