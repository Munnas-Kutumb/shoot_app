import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-account-details",
  templateUrl: "./account-details.page.html",
  styleUrls: ["./account-details.page.scss"],
})
export class AccountDetailsPage implements OnInit {
  view: any = "";

  servicedata: any = {};
  merchantDetails: any = {};
  merchant_id: any = "";

  constructor(private router: Router, private commonservice: CommonService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.commonservice.setHeaders();
    this.merchant_id = localStorage.getItem("merchant_id");
    this.getMerchanDetails();
  }

  backBtn() {
    this.router.navigateByUrl("/tab/tabs/profile");
  }

  edit() {
    localStorage.setItem("traceback", "profile");
    this.router.navigateByUrl("/bank-account-details");
  }

  dropdown(val) {
    if (val == this.view) {
      this.view = "";
      return;
    } else this.view = val;
    // if (this.view == "") {
    //   this.view = val;
    //   console.log(val);
    // } else {
    //   this.view = "";
    // }
  }

  getMerchanDetails() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/getMerchantById", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let details: any = res;
          this.merchantDetails = details.response;
          console.log(this.merchantDetails);
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }
}
