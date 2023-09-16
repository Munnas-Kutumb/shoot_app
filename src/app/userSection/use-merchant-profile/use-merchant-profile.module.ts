import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UseMerchantProfilePageRoutingModule } from './use-merchant-profile-routing.module';

import { UseMerchantProfilePage } from './use-merchant-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UseMerchantProfilePageRoutingModule
  ],
  declarations: [UseMerchantProfilePage]
})
export class UseMerchantProfilePageModule {}
