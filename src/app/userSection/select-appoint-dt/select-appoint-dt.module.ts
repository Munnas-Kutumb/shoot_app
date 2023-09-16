import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectAppointDtPageRoutingModule } from './select-appoint-dt-routing.module';

import { SelectAppointDtPage } from './select-appoint-dt.page';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectAppointDtPageRoutingModule,
    CalendarModule
  ],
  declarations: [SelectAppointDtPage]
})
export class SelectAppointDtPageModule {}
