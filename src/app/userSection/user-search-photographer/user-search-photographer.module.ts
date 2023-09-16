import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSearchPhotographerPageRoutingModule } from './user-search-photographer-routing.module';

import { UserSearchPhotographerPage } from './user-search-photographer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSearchPhotographerPageRoutingModule
  ],
  declarations: [UserSearchPhotographerPage]
})
export class UserSearchPhotographerPageModule {}
