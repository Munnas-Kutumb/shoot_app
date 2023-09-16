import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserContactUsPageRoutingModule } from './user-contact-us-routing.module';

import { UserContactUsPage } from './user-contact-us.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserContactUsPageRoutingModule
  ],
  declarations: [UserContactUsPage]
})
export class UserContactUsPageModule {}
