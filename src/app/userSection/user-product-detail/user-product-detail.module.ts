import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProductDetailPageRoutingModule } from './user-product-detail-routing.module';

import { UserProductDetailPage } from './user-product-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProductDetailPageRoutingModule,
  ],
  declarations: [UserProductDetailPage]
})
export class UserProductDetailPageModule {}
