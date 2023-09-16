import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutusVendorPageRoutingModule } from './aboutus-vendor-routing.module';

import { AboutusVendorPage } from './aboutus-vendor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutusVendorPageRoutingModule
  ],
  declarations: [AboutusVendorPage]
})
export class AboutusVendorPageModule {}
