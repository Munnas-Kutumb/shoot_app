import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PayProcessPage } from "./pay-process.page";

const routes: Routes = [
  {
    path: "",
    component: PayProcessPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayProcessPageRoutingModule {}
