import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: 'app-end-serviceotp',
  templateUrl: './end-serviceotp.page.html',
  styleUrls: ['./end-serviceotp.page.scss'],
})
export class EndServiceotpPage implements OnInit {
  view: any = "login";
  servicedata: any = {};
  login_details: any = {};
  phone_error: any = [];
  timerOn: any = "";

  otp: any;
  myotp1: any;
  myotp2: any;
  myotp3: any;
  myotp4: any;
  booking_id: any = "";
  dummy: any;
  choosed_loc: any;
  selected_loc: any;

  constructor(private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.booking_id = localStorage.getItem("endBookingId");
    console.log(this.booking_id);
  }

  closePage() {
    this.router.navigateByUrl("/booking-info");
  }

  otpController(event, next, prev) {
    if (event.target.value.length < 1 && prev) {
      prev.setFocus();
    } else if (next && event.target.value.length > 0) {
      next.setFocus();
    } else {
      return 0;
      //event.path[0].value = '';
    }
  }

  endBooking() {
    this.choosed_loc = JSON.parse(localStorage.getItem('merchant'))
    this.selected_loc = this.choosed_loc?.city?._id;
    this.servicedata = {
      booking_id: this.booking_id,
      otp: this.myotp1 + this.myotp2 + this.myotp3 + this.myotp4,
      city_id: this.selected_loc
    };

    this.commonservice.waitloadershow();
    this.commonservice.serverdatapost("booking/endService", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.message == "Invalid OTP") {
            console.log("1");
            alert("Enter Valid OTP")
  
          }
          else{
            this.router.navigateByUrl('/tab/tabs/booking');

          }
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }


}
