import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkingAreaPageRoutingModule } from './working-area-routing.module';

import { WorkingAreaPage } from './working-area.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkingAreaPageRoutingModule
  ],
  declarations: [WorkingAreaPage]
})
export class WorkingAreaPageModule {}
