import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserLiveEventPageRoutingModule } from './user-live-event-routing.module';

import { UserLiveEventPage } from './user-live-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserLiveEventPageRoutingModule
  ],
  declarations: [UserLiveEventPage]
})
export class UserLiveEventPageModule {}
