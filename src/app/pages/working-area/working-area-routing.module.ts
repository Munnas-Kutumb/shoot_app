import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkingAreaPage } from './working-area.page';

const routes: Routes = [
  {
    path: '',
    component: WorkingAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkingAreaPageRoutingModule {}
