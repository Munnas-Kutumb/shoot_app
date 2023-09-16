import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SubscriptionProcessPageRoutingModule } from "./subscription-process-routing.module";

import { SubscriptionProcessPage } from "./subscription-process.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriptionProcessPageRoutingModule,
  ],
  declarations: [SubscriptionProcessPage],
})
export class SubscriptionProcessPageModule {}
