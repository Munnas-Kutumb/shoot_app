import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketYourselfPage } from './market-yourself.page';

const routes: Routes = [
  {
    path: '',
    component: MarketYourselfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketYourselfPageRoutingModule {}
