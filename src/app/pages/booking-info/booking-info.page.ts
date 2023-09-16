import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CommonService } from "src/service/commonservice";

import { AlertController } from "@ionic/angular";
import { NavController } from "@ionic/angular";
import { CallNumber } from "@ionic-native/call-number/ngx";


@Component({
  selector: "app-booking-info",
  templateUrl: "./booking-info.page.html",
  styleUrls: ["./booking-info.page.scss"],
})
export class BookingInfoPage implements OnInit {
  view: any = "incoming";
  value: any = "incoming";
  servicedata: any = {};
  booking_info: any = [];
  booking_number: any = "";
  booking_status: any = "";
  customer_details: any = {};
  booking_address: any = {};
  merchant_id: any = "";
  accept_booking: any = "";
  booking_id: any = "";
  startotp: any = "";
  otpview: any = "";
  data: any;
  rate: any = 0;
  rates: any = 0;
  amount: any = 0;
  amounts: any = 0;
  choosed_loc: any;
  selected_loc: any;
  choosed_location: any;
  delivary_charges: any = 0;
  final_delivary_charges: any = 0;
  constructor(
    private router: Router,
    private navController: NavController,

    private commonservice: CommonService,
    public alertController: AlertController,
    private callNumber: CallNumber
  ) { }

  //booking status and booking Id gets undefines when changed.

  ionViewWillEnter() {
    this.booking_number = localStorage.getItem("booking_number");
    this.merchant_id = localStorage.getItem("merchant_id");
    console.log(this.merchant_id);

    this.booking_status = localStorage.getItem("bookingDetailStatus");
    console.log(this.booking_status);

    this.booking_id = localStorage.getItem("bookinginfo_id");
    console.log(this.booking_id);

    this.getBookings();
  }

  ngOnInit() {
    this.view = this.booking_status;
    // this.choosed_location = JSON.parse(localStorage.getItem("merchant"));
    this.servicedata = {
      city_id: JSON.parse(localStorage.getItem("merchant")).city?._id,
    };
    this.commonservice.serverdatapost("city/getCityById", this.servicedata).subscribe(
      (res) => {
        var data;
        data = res;
        this.choosed_location = data.response;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  segmentChanged($event) {
    console.log(this.value);
  }

  backBtn() {


    // if(localStorage.getItem('goback')==this.value)
    // this.navController.navigateRoot(['/tab/tabs/booking']);
    this.router.navigate(['/bookings']);

  }

  getBookings() {

    this.rate = 0;
    this.rates = 0;
    this.amount = 0;
    this.amounts = 0;
    this.delivary_charges = 0;
    this.final_delivary_charges = 0;

    this.commonservice.setHeaders();

    this.servicedata = {
      booking_number: this.booking_number,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("booking/bookingDetails", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          this.booking_info = data.response[0];
          console.log(this.booking_info);
          this.customer_details = this.booking_info.customer[0];
          this.booking_address = this.booking_info.address[0];
          for (let i = 0; i < this.booking_info.booking_details.length; i++) {
            this.rate = this.booking_info.booking_details[i].rate;
            this.rates = this.rates + this.rate
          }
          console.log(this.rates)
          for (let i = 0; i < this.booking_info.booking_details.length; i++) {
            this.amount = this.booking_info.booking_details[i].final_amount;
            this.amounts = this.amounts + this.amount
            this.delivary_charges = this.booking_info.booking_details[i].product_delivery_charge ? this.booking_info.booking_details[i].product_delivery_charge : 0;
            this.final_delivary_charges = this.final_delivary_charges + this.delivary_charges;
          }
          console.log(this.amounts)
          // if(this.booking_info.booking_details){

          //   this.amount = this.booking_info.booking_details.filter((e) => e.final_amount).map()
          // }
          console.log(this.booking_address);
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  acceptBooking() {
    this.servicedata = {
      merchant_id: this.merchant_id,
      booking_id: this.booking_id,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("booking/acceptBooking", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          // this.navController.navigateRoot(['/tab/tabs/booking']);
          this.backBtn();
          // this.router.navigateByUrl("tab/tabs/booking");
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  rejectBooking(bookid) {
    this.choosed_loc = JSON.parse(localStorage.getItem('merchant'));
    this.selected_loc = this.choosed_loc?.city?._id;
    this.servicedata = {
      booking_id: bookid,
      cancel_by: "merchant",
      city_id: this.selected_loc
    };

    console.log(bookid);

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("booking/cancelBooking", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data.response);
          // this.navController.navigateRoot(['/tab/tabs/booking']);
          this.backBtn();
          // this.router.navigateByUrl("tab/tabs/booking");
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  async cancelAlertConfirm(data?) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Confirm!",
      message: `Are you sure you want to <strong>Cancel Booking</strong>!!!
      <br><br> If you will cancel the booking, ${this.choosed_location?.merchant_cancellation_fee}% cancellation charge will apply.
      `,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Confirm",
          handler: () => {
            this.rejectBooking(data);
            console.log("Confirm Okay");
          },
        },
      ],
    });

    await alert.present();
  }

  async acceptAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Confirm!",
      message: "Are you sure you want to <strong>Cancel Booking</strong>!!!",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Confirm",
          handler: () => {
            this.acceptBooking();
            console.log("Booking Confirmed");
          },
        },
      ],
    });

    await alert.present();
  }

  startBooking() {
    this.servicedata = {
      booking_id: this.booking_id,
      otp: "1234",
    };

    console.log(this.booking_id);

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("booking/cancelBooking", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data.response);
          this.navController.navigateRoot(['/tab/tabs/booking']);

          // this.router.navigateByUrl("tab/tabs/booking");
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  //Start Service From Merchant Alert Box

  startService(showotp, val) {
    console.log(showotp);

    if (this.view == "") {
      this.otpview = showotp;
      console.log("Opened");
      console.log(this.otpview);
    } else {
      this.view = "";

      console.log("Closed");
      console.log(this.otpview);
    }
  }

  toStartService(b_id) {
    console.log(b_id);
    localStorage.setItem("startBookingId", b_id);
    this.router.navigateByUrl("/start-service-otp");
  }

  toEndService(b_id) {
    console.log(b_id);
    localStorage.setItem("endBookingId", b_id);
    this.router.navigateByUrl("/end-serviceotp");
  }

  callNow(number) {
    console.log(number);
    this.callNumber
      .callNumber(number, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => console.log("Error launching dialer", err));
  }

  //end service
  // endService(id){

  //   this.commonservice.setHeaders();
  //   console.log(id);
  //   this.servicedata={
  //     booking_id:id
  //   }
  //   this.commonservice.serverdatapost('booking/endService',this.servicedata).subscribe(
  //     (res)=>{
  //       this.data=res;
  //       console.log(this.data);
  //       this.router.navigateByUrl('/tab/tabs/booking')

  //     },
  //     (err)=>{
  //       console.log(err);

  //     }
  //   )

  // }
}
