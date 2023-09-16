import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusinessDetailsPageRoutingModule } from './business-details-routing.module';

import { BusinessDetailsPage } from './business-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusinessDetailsPageRoutingModule
  ],
  declarations: [BusinessDetailsPage]
})
export class BusinessDetailsPageModule {}
