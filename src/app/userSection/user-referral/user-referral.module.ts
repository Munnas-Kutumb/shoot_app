import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserReferralPageRoutingModule } from './user-referral-routing.module';

import { UserReferralPage } from './user-referral.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserReferralPageRoutingModule
  ],
  declarations: [UserReferralPage]
})
export class UserReferralPageModule {}
