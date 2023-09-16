import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-detail-page",
  templateUrl: "./detail-page.page.html",
  styleUrls: ["./detail-page.page.scss"],
})
export class DetailPagePage implements OnInit {
  merchant_id: any;
  servicedata: any;
  booking_count: any = {};
  total_earning: any = {};
  cmpbooking:any={}
  completed_bookings: any = "0";
  cancelled_booking: any = "0";
  total_service: any = "0";
  referal_earnings: any = "0";
  cancellation_charges: any = "0";
  total_earned: any = "0";
  remaining_count: any = "0";
  merchant: any;
  secure_amount: any = "0";
  shoot_money: any = "0";
  penalty: any = "0";

  constructor(private commonservice: CommonService, private route: Router) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    this.getReportsStat();
    this.totalearning();
    this.getMerchanDetails();
  }

  backBtn() {
    this.route.navigateByUrl("/tab/tabs/profile");
  }

  totalearning() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };
    console.log(this.servicedata.merchant_id);

    this.commonservice.serverdatapost("booking/totalEarning", this.servicedata).subscribe(
      (res) => {
        let data: any = res;
        this.total_earning = data.response[0];
        console.log(this.total_earning);


      }
    )
  }

 

  getReportsStat() {
    this.servicedata = {
      query: { merchant_id: this.merchant_id },
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("booking/bookingCountByQuery", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;

          console.log(data);
          this.booking_count = data.response;
          console.log(this.booking_count);

          // this.completed_bookings = data.no_of_booking;
          // this.cancelled_booking=data.response.
          // this.total_service=data.response.
          // this.referal_earnings=data.response.
          // this.cancellation_charges=data.response.
          // this.total_earned=data.response.
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
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
          this.merchant = details.response;
          this.secure_amount = this.merchant?.secure_amount;
          this.shoot_money = this.merchant?.shoot_money;
          this.penalty = this.merchant?.shoot_penalty;
          this.cancellation_charges = this.merchant?.city?.merchant_cancellation_fee;
          // this.total_earning = this.merchant?.amount_paid;
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }
}
