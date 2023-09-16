import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-start-service-otp",
  templateUrl: "./start-service-otp.page.html",
  styleUrls: ["./start-service-otp.page.scss"],
})
export class StartServiceOtpPage implements OnInit {
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

  constructor(private router: Router, private commonservice: CommonService) {
    this.booking_id = localStorage.getItem("startBookingId");
    console.log(this.booking_id);
  }

  ngOnInit() {


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

  closePage() {
    this.router.navigateByUrl("/booking-info");
  }

  acceptBooking() {
    this.servicedata = {
      booking_id: this.booking_id,
      otp: this.myotp1 + this.myotp2 + this.myotp3 + this.myotp4,
    };

    this.commonservice.waitloadershow();
    this.commonservice.serverdatapost("booking/startService", this.servicedata).subscribe(
      (res) => {
        this.commonservice.waitloaderhide();
        let data: any = res;
        console.log(data);
        if (data.message == "Invalid OTP") {
          console.log("1");
          alert("Enter Valid OTP")

        }
        else {
          console.log("2");
          this.router.navigateByUrl("/booking-info");
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
