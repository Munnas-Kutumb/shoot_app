import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAboutusPageRoutingModule } from './user-aboutus-routing.module';

import { UserAboutusPage } from './user-aboutus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserAboutusPageRoutingModule
  ],
  declarations: [UserAboutusPage]
})
export class UserAboutusPageModule {}
