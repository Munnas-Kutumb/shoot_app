import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-profile-approval",
  templateUrl: "./profile-approval.page.html",
  styleUrls: ["./profile-approval.page.scss"],
})
export class ProfileApprovalPage implements OnInit {
  status: any = {};
  servicedata: any = {};
  merchant_details: any = {};

  bankdetails: boolean = false;
  businessDetails: boolean = false;
  onBoardingDoc: boolean = false;
  registration_payment_status: boolean = false;

  merchant_id: any = "";

  constructor(private router: Router, private commonservice: CommonService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    this.merchant_details = JSON.parse(localStorage.getItem("merchant"));

    this.commonservice.setHeaders();

    this.getAllStatus();
  }

  toDoc() {
    this.router.navigateByUrl("/identity-verification");
  }

  toBank() {
    this.router.navigateByUrl("/bank-account-details");
  }

  toPay() {
    this.router.navigateByUrl("/pay-process");
  }

  proceed() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/updateSubmitStatus", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          this.status = data.status;
          console.log(this.status);
          if (this.status) {
            this.commonservice.toastalert(data.message);
            localStorage.setItem("logged_in", "1");
            this.router.navigateByUrl("/tab/tabs/home-page");
          } else this.commonservice.toastalert(data.message);
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  backBtn() {
    this.router.navigateByUrl("/intro-to-shoot");
  }

  toBusinessDeatils() {
    this.router.navigateByUrl("/business-details");
  }

  getAllStatus() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/getMerchantAllStatus", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          this.status = data.response;
          console.log(this.status.identity_proof_detail_status);
          this.bankdetails = this.status.bank_detail_status;
          this.businessDetails = this.status.business_detail_status;
          this.onBoardingDoc = this.status.identity_proof_detail_status;
          this.registration_payment_status = this.status.registration_payment_status;
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }
}
