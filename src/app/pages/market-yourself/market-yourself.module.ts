import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketYourselfPageRoutingModule } from './market-yourself-routing.module';

import { MarketYourselfPage } from './market-yourself.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketYourselfPageRoutingModule
  ],
  declarations: [MarketYourselfPage]
})
export class MarketYourselfPageModule {}
