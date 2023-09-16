import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryNamePageRoutingModule } from './category-name-routing.module';

import { CategoryNamePage } from './category-name.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryNamePageRoutingModule
  ],
  declarations: [CategoryNamePage]
})
export class CategoryNamePageModule {}
