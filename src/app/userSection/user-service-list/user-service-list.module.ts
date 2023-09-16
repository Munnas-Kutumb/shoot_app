import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserServiceListPageRoutingModule } from './user-service-list-routing.module';

import { UserServiceListPage } from './user-service-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserServiceListPageRoutingModule
  ],
  declarations: [UserServiceListPage]
})
export class UserServiceListPageModule {}
