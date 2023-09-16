import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { CommonService } from "src/service/commonservice";
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Platform } from "@ionic/angular";


@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  view: any = "login";
  servicedata: any = {};
  phone_error: any = [];
  timerOn: any = "";
  otp: any;
  myotp1: any;
  myotp2: any;
  myotp3: any;
  myotp4: any;
  token: any;


  phone: any = "";
  merchant_id: any;

  resend_status: boolean = false;

  registration_payment_status: boolean = false;

  constructor(
    private router: Router,
    public toastController: ToastController,
    private commonservice: CommonService,
    public ngzone: NgZone, private fcm: FCM,
    private platform: Platform
  ) { }

  ngOnInit() { }

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

  timeleft: any = "00:00";
  clearintrval: any;

  ionViewDidEnter() { }

  startcounter() {
    var time = 0.5 * 60;
    var tmp = time;

    this.ngzone.run(() => {
      this.timeleft = "00:30";
    });

    this.clearintrval = setInterval(() => {
      var c = tmp--;
      var m = (c / 60) >> 0;
      var s = c - m * 60 + "";

      this.timeleft = m + ":" + (s.length > 1 ? "" : "0") + s;
      tmp != 0 || (tmp = time);
    }, 1000);
  }

  loginClicked() {
    this.view = "otp";
  }

  close() {
    this.view = "login";

    this.otp = "";
    this.myotp1 = "";
    this.myotp2 = "";
    this.myotp3 = "";
    this.myotp4 = "";
  }

  otpController(event, next, prev) {
    if (event.target.value.length < 1 && prev) {
      prev.setFocus();
    } else if (next && event.target.value.length > 0) {
      next.setFocus();
    } else {
      return 0;
    }
  }

  async otpSent() {
    const toast = await this.toastController.create({
      message: "OTP Sent Sucessfully.",
      duration: 2000,
      color: "success",
    });
    toast.present();
  }

  validatemobile() {
    if ((this.phone + "").length > 10)
      return this.commonservice.toastalert("Invalid Mobile Number.");
  }

  login() {

    this.resend_status = false;
    console.log(this.phone);
    if (this.phone == "")
      return this.commonservice.toastalert("Mobile mumber is required.");
    if ((this.phone + "").length != 10)
      return this.commonservice.toastalert("Invalid Mobile Number.");

    this.servicedata = {
      phone: this.phone,
    };

    this.commonservice.waitloadershow();


    this.commonservice
      .serverdatapost("merchant/getOTP", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);

          if (data.status == true) {
            localStorage.clear();
            this.view = "otp";
            this.merchant_id = data.response.merchant_id;
            localStorage.setItem("userType", "merchant");
            localStorage.setItem("merchant_id", this.merchant_id);

            if (this.clearintrval) clearInterval(this.clearintrval);

            this.startcounter();
            setTimeout(() => {
              this.resend_status = true;
            }, 30000);
            this.otpSent();
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
    this.servicedata = {
      merchant_id: this.merchant_id,
      phone: this.phone,
      otp: this.myotp1 + this.myotp2 + this.myotp3 + this.myotp4,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/verifyOTP", this.servicedata)
      .subscribe(
        (res) => {
          let data: any;
          data = res;

          localStorage.setItem("token", data.token);


          this.commonservice.waitloaderhide();
          if (data.status == true) {
            this.getToken();

            console.log(data.response);
            this.registration_payment_status =
              data.response.registration_payment_status;
            localStorage.setItem("merchant", JSON.stringify(data.response));
            // this.commonservice.toastalert(data.message);
            if (this.clearintrval) clearInterval(this.clearintrval);

            if (this.registration_payment_status) {
              localStorage.setItem("userType", "merchant");
              localStorage.setItem("logged_in", "1");
              this.router.navigateByUrl("/tab/tabs/home-page");
            } else {
              this.router.navigateByUrl("/register");
            }
          } else {
            this.myotp1 = "";
            this.myotp2 = "";
            this.myotp3 = "";
            this.myotp4 = "";
            this.commonservice.toastalert(data.message);
          }
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong");
        }
      );
  }

  touserLogin() {
    this.router.navigateByUrl("/login-main");
  }

  //token
  async getToken() {
    await this.platform.ready();

    console.log('FCM SETUP INIT');
    if (!this.platform.is('cordova')) {
      console.log('init')
      return;
    }

    this.token = await this.fcm.getToken();
    console.log('CHECK getToken: ' + this.token);
    localStorage.setItem('fcm_token', this.token);
    this.setFCMToken();
  }



  //fcm token

  setFCMToken() {
    this.servicedata = {
      merchant_id: localStorage.getItem('merchant_id'),
      fcm_token: this.token
    }
    this.commonservice.serverdatapost('merchant/setFCM', this.servicedata).subscribe(
      (res) => {
        let data: any;
        data = res;
        console.log(data);


      },
      (err) => {
        console.log(err);

      }
    )
  }
}
