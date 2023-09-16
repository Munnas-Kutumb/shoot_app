import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerReferralPageRoutingModule } from './mer-referral-routing.module';

import { MerReferralPage } from './mer-referral.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MerReferralPageRoutingModule
  ],
  declarations: [MerReferralPage]
})
export class MerReferralPageModule {}
