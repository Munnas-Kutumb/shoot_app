import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileApprovalPageRoutingModule } from './profile-approval-routing.module';

import { ProfileApprovalPage } from './profile-approval.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileApprovalPageRoutingModule
  ],
  declarations: [ProfileApprovalPage]
})
export class ProfileApprovalPageModule {}
