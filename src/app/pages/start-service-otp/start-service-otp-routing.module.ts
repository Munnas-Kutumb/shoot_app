import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartServiceOtpPage } from './start-service-otp.page';

const routes: Routes = [
  {
    path: '',
    component: StartServiceOtpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartServiceOtpPageRoutingModule {}
