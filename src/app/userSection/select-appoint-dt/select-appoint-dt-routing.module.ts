import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectAppointDtPage } from './select-appoint-dt.page';

const routes: Routes = [
  {
    path: '',
    component: SelectAppointDtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectAppointDtPageRoutingModule {}
