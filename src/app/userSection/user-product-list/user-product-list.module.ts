import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProductListPageRoutingModule } from './user-product-list-routing.module';

import { UserProductListPage } from './user-product-list.page';
import { SearchfilterPipe } from 'src/app/searchfilter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProductListPageRoutingModule,
   
  ],
  declarations: [UserProductListPage, SearchfilterPipe]
})
export class UserProductListPageModule {}
