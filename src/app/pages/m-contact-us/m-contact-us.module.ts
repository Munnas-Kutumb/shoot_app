import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MContactUsPageRoutingModule } from './m-contact-us-routing.module';

import { MContactUsPage } from './m-contact-us.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MContactUsPageRoutingModule
  ],
  declarations: [MContactUsPage]
})
export class MContactUsPageModule {}
