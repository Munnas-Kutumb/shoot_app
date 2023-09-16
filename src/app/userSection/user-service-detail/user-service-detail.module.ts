import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserServiceDetailPageRoutingModule } from './user-service-detail-routing.module';

import { UserServiceDetailPage } from './user-service-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserServiceDetailPageRoutingModule
  ],
  declarations: [UserServiceDetailPage]
})
export class UserServiceDetailPageModule {}
