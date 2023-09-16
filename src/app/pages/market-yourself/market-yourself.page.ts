import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { IonContent } from "@ionic/angular";

@Component({
  selector: "app-market-yourself",
  templateUrl: "./market-yourself.page.html",
  styleUrls: ["./market-yourself.page.scss"],
})
export class MarketYourselfPage implements OnInit {
  servicedata: any = {};
  subscription: any = "";
  entryisChecked: any = "";
  merchant: any = {};
  merchant_id: any;
  @ViewChild("content", { static: false }) content: IonContent;

  constructor(private router: Router, private commonservice: CommonService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    this.getProfile();
    this.getSubscription();
  }

  ionViewWillLeave() {}

  backBtn() {
    this.router.navigateByUrl("/tab/tabs/home-page");
    //this.router.navigate(["/tab/tabs/home-page"]);
    // this.scrollToBottomOnInit();
  }

  buySubscription(details) {
    localStorage.setItem("subscpon", JSON.stringify(details));
    this.router.navigateByUrl("/subscription-process");
  }

  scrollToBottomOnInit() {
    this.content.scrollToTop(0);
  }

  getSubscription() {
    this.servicedata = {
      query: {},
    };

    // this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("subscription/getSubscription", this.servicedata)
      .subscribe(
        (res) => {
          // this.commonservice.waitloaderhide();
          let subdata: any = res;
          if (subdata.response) this.subscription = subdata.response;
          console.log(this.subscription);
        },

        (error) => {
          console.log(error);
          // this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  getProfile() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };

    // this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/getMerchantById", this.servicedata)
      .subscribe(
        (res) => {
          // this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.status) {
            this.merchant = data.response;
          } else {
            this.commonservice.toastalert(data.message);
          }
        },
        (error) => {
          console.log(error);
          // this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }
}
