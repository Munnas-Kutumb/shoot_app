import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SubscriptionProcessPage } from "./subscription-process.page";

const routes: Routes = [
  {
    path: "",
    component: SubscriptionProcessPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionProcessPageRoutingModule {}
