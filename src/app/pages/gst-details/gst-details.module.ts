import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GstDetailsPageRoutingModule } from './gst-details-routing.module';

import { GstDetailsPage } from './gst-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GstDetailsPageRoutingModule
  ],
  declarations: [GstDetailsPage]
})
export class GstDetailsPageModule {}
