import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroToShootPageRoutingModule } from './intro-to-shoot-routing.module';

import { IntroToShootPage } from './intro-to-shoot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroToShootPageRoutingModule
  ],
  declarations: [IntroToShootPage]
})
export class IntroToShootPageModule {}
