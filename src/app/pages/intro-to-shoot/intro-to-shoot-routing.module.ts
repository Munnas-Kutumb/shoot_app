import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroToShootPage } from './intro-to-shoot.page';

const routes: Routes = [
  {
    path: '',
    component: IntroToShootPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroToShootPageRoutingModule {}
