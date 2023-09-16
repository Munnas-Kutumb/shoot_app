import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PayProcessPageRoutingModule } from "./pay-process-routing.module";
import { PayProcessPage } from "./pay-process.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayProcessPageRoutingModule,
  ],
  declarations: [PayProcessPage],
})
export class PayProcessPageModule {}
