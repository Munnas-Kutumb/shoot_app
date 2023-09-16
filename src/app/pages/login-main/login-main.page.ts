import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

import { CommonService } from "src/service/commonservice";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-login-main",
  templateUrl: "./login-main.page.html",
  styleUrls: ["./login-main.page.scss"],
})
export class LoginMainPage implements OnInit {
  view: any = "login";
  servicedata: any = {};
  phone: any = "";
  otp: any;
  myotp1: any;
  myotp2: any;
  myotp3: any;
  myotp4: any;
  error_msg: any = "";
  user_id: any;
  token: any;
  user_details: any = [];

  constructor(
    private router: Router,
    public toastController: ToastController,
    private commonservice: CommonService,

    private fcm: FCM,
    private platform: Platform
  ) { }

  ionViewWillEnter() {


    if (localStorage.getItem('isloggedin')) {
      this.router.navigateByUrl("/tabs/user-tabs/user-home-page");
    }
    else if (localStorage.getItem('logged_in')) {
      this.router.navigateByUrl("/tab/tabs/home-page");
    }
    else {
      this.view = "login";
      this.phone = "";
      this.myotp1 = "";
      this.myotp2 = "";
      this.myotp3 = "";
      this.myotp4 = "";
      this.otp = "";
    }


  }

  ngOnInit() { }



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

  close() {
    this.view = "login";
    this.otp = "";
    this.myotp1 = "";
    this.myotp2 = "";
    this.myotp3 = "";
    this.myotp4 = "";
  }

  redirectToApp() {
    this.router.navigateByUrl("tabs/user-tabs/user-home-page");
  }

  toRegister() {
    this.router.navigateByUrl("/register");
  }

  cancelBtn() {
    this.router.navigateByUrl("/login");
  }

  regVendorPage() {
    this.router.navigateByUrl("/login");
  }

  toUserEnd() {
    this.router.navigateByUrl("tabs/user-tabs/user-home-page");
  }

  resendOtp() {
    this.otpSent();
    this.login();
  }

  async otpSent() {
    const toast = await this.toastController.create({
      message: "OTP Sent Sucessfully.",
      duration: 3000,
    });
    toast.present();
  }

  login() {
    if (this.phone == "")
      return this.commonservice.toastalert("Mobile mumber is required.");
    if ((this.phone + "").length != 10)
      return this.commonservice.toastalert("Invalid Mobile Number.");

    this.servicedata = {
      phone: this.phone,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("user/getOTP", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);

          if (data.status == true) {
            localStorage.clear();
            localStorage.setItem("user", JSON.stringify(data.response));

            this.view = "otp";
            // localStorage.setItem("token", data.token);

            // this.router.navigateByUrl("/home");
          } else {
            console.log(data.response);
          }
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  verifyOTP() {
    this.user_details = JSON.parse(localStorage.getItem("user"));

    console.log(this.user_details);

    this.servicedata = {
      user_id: this.user_details.user_id,
      phone: this.phone,
      otp: this.myotp1 + this.myotp2 + this.myotp3 + this.myotp4,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("user/verifyOTP", this.servicedata)
      .subscribe(
        (res) => {
          let data: any;
          data = res;

          localStorage.setItem("token", data.token);

          console.log(data);

          this.commonservice.waitloaderhide();
          if (data.status == true) {
            // this.commonservice.toastalert(data.message);
            localStorage.setItem("userType", "customer");
            localStorage.setItem("isloggedin", "1");
            localStorage.setItem("user_id", data.response._id);
            console.log(data.response._id);
            this.getToken();

            console.log(data.response.status);
            if (data.response.new_user == true) {
              this.router.navigateByUrl("/user-register");
            } else {
              this.router.navigateByUrl("/tabs/user-tabs/user-home-page");
            }
          } else {
            this.commonservice.showAlert(data.message);
          }
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong");
        }
      );
  }

  //user token

  //token
  async getToken() {
    await this.platform.ready();

    console.log("FCM SETUP INIT");
    if (!this.platform.is("cordova")) {
      console.log("init");
      return;
    }

    this.token = await this.fcm.getToken();
    console.log("CHECK getToken: " + this.token);
    localStorage.setItem("fcm_token_user", this.token);
    this.setFCMToken();
  }

  //fcm token

  setFCMToken() {
    console.log("Set FCM Token");
    this.servicedata = {
      user_id: this.user_details.user_id,
      fcm_token: this.token,
    };
    this.commonservice
      .serverdatapost("merchant/setUserFcm", this.servicedata)
      .subscribe(
        (res) => {
          let data: any;
          data = res;
          console.log(data);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
