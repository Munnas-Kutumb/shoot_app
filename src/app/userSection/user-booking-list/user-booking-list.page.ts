import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { CommonService } from "src/service/commonservice";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-user-booking-list",
  templateUrl: "./user-booking-list.page.html",
  styleUrls: ["./user-booking-list.page.scss"],
})
export class UserBookingListPage implements OnInit {
  view: any = "upcoming";
  optionSec: any = "upcoming";
  servicedata: any;
  user: any;
  user_id: any;
  imgUrl: any;

  pendingBooking: any = [];
  acceptedBooking: any = [];
  completedBooking: any = [];
  rejectedBooking: any = [];
  cancelledBooking: any = [];
  booking_status: any;
  data: any = [];

  constructor(
    private router: Router,
    private navController: NavController,
    private common: CommonService,
    private callNumber: CallNumber
  ) { }

  ionViewWillEnter() {
    this.imgUrl = this.common.serviceurl;
    this.user_id = localStorage.getItem("user_id");
    console.log(this.user_id);

    this.getPendingBooking();
    this.navController.navigateRoot(["/tabs/user-tabs/user-booking-list"]);
    // this.getAcceptedBooking();
    // this.getCancelledBooking();
    // this.getCompletedBooking();
    // this.getRejectedBooking();
  }

  ngOnInit() { }

  optSegment($event) {
    this.view = this.optionSec;
    console.log(this.view);
    this.booking_status = this.optionSec;
  }

  toBookingDeatil(details) {
    localStorage.setItem("bookingDetails", JSON.stringify(details));
    this.router.navigateByUrl("/user-booking");
  }

  bookNow() {
    localStorage.setItem("traceback", "booking");
    this.navController.navigateRoot(["/user-service-list"]);
  }

  getPendingBooking() {
    this.servicedata = {
      user_id: this.user_id,
      booking_status: "pending",
    };

    this.common
      .serverdatapost("booking/getAllBookingByUserId", this.servicedata)
      .subscribe(
        (res) => {
          var data;
          data = res;
          this.pendingBooking = data.response.reverse();

          console.log(this.pendingBooking);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getAcceptedBooking() {
    this.servicedata = {
      user_id: this.user_id,
      booking_status: this.booking_status,
    };

    this.common.serverdatapost("booking/getAllBookingByUserId", this.servicedata).subscribe(
        (res) => {
          this.data = res;
          console.log(this.data)
          if (this.data.status) {
            this.acceptedBooking = this.data.response.reverse();
            console.log(this.acceptedBooking);
            if(this.booking_status=='accepted'){
              this.servicedata.booking_status='ongoing';

              this.common.serverdatapost("booking/getAllBookingByUserId", this.servicedata).subscribe(
                res=>{
                  this.data = res;
                  console.log(this.data);
                  if(this.data.status){
                     var ongoing=this.data.response.reverse();
                     console.log(ongoing);
                     ongoing.map(e=>{
                       this.acceptedBooking=[...this.acceptedBooking,e];
                     })
                     console.log(this.acceptedBooking)
                  }
                }
              )

            }

          }


        },
        (err) => {
          console.log(err);
        }
      );
  }

  getCancelledBooking() {
    this.servicedata = {
      user_id: this.user_id,
      booking_status: "cancelled",
    };

    this.common
      .serverdatapost("booking/getAllBookingByUserId", this.servicedata)
      .subscribe(
        (res) => {
          var data;
          data = res;
          this.cancelledBooking = data.response.reverse();
          this.getCompletedBooking();
          console.log(this.cancelledBooking);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getRejectedBooking() {
    this.servicedata = {
      user_id: this.user_id,
      booking_status: "rejected",
    };

    this.common
      .serverdatapost("booking/getAllBookingByUserId", this.servicedata)
      .subscribe(
        (res) => {
          var data;
          data = res;
          this.rejectedBooking = data.response.reverse();
          console.log(this.rejectedBooking);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getCompletedBooking() {
    this.servicedata = {
      user_id: this.user_id,
      booking_status: "completed",
    };

    this.common
      .serverdatapost("booking/getAllBookingByUserId", this.servicedata)
      .subscribe(
        (res) => {
          var data;
          data = res;
          this.completedBooking = data.response.reverse();
          this.getRejectedBooking();
          console.log(this.completedBooking);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  callNow(number) {
    console.log(number);
    this.callNumber
      .callNumber(number, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }
}
