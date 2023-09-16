import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerchentServicesListPageRoutingModule } from './merchent-services-list-routing.module';

import { MerchentServicesListPage } from './merchent-services-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MerchentServicesListPageRoutingModule
  ],
  declarations: [MerchentServicesListPage]
})
export class MerchentServicesListPageModule {}
