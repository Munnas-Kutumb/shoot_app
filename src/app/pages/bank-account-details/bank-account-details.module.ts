import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankAccountDetailsPageRoutingModule } from './bank-account-details-routing.module';

import { BankAccountDetailsPage } from './bank-account-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BankAccountDetailsPageRoutingModule
  ],
  declarations: [BankAccountDetailsPage]
})
export class BankAccountDetailsPageModule {}
