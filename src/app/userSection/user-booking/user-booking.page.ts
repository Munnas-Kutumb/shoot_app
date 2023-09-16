import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { AlertController } from "@ionic/angular";
import { CallNumber } from "@ionic-native/call-number/ngx";

@Component({
  selector: "app-user-booking",
  templateUrl: "./user-booking.page.html",
  styleUrls: ["./user-booking.page.scss"],
})
export class UserBookingPage implements OnInit {
  view: any = "booked";
  value: any = "booked";
  details: any;
  servicedata: any;
  star: any;
  user: any;
  user_id: any;
  data: any = [];
  d: any;
  rate: any;
  rates: any = 0;
  amount: any;
  amounts: any = 0
  feedback: any;
  choosed_loc: any;
  selected_loc: any;
  choosed_location: any;
  delivary_charges: any = 0;
  final_delivary_charges: any = 0;

  constructor(
    private router: Router,
    private common: CommonService,
    public alertController: AlertController,
    private callNumber: CallNumber
  ) { }

  ionViewWillEnter() {
    this.details = JSON.parse(localStorage.bookingDetails);
    console.log(this.details);

    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = localStorage.getItem('user_id');
    console.log(this.user_id)

    this.getBooking();
  }

  ngOnInit() {
    // this.choosed_location = JSON.parse(localStorage.getItem("choosed_location"));
    this.servicedata = {
      city_id: JSON.parse(localStorage.getItem("choosed_location"))._id,
    };
    this.common.serverdatapost("city/getCityById", this.servicedata).subscribe(
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
    this.view = this.value;
    console.log(this.value);
  }

  backBtn() {
    localStorage.setItem("bookingDetails", "");
    this.router.navigate(["/user-booking-list"]);
  }

  selectStar(value) {
    this.star = value;

    this.servicedata = {
      booking_id: this.details._id,
      user_id: this.user_id,
      rating: this.star,
    };
    console.log(this.servicedata);


    this.common
      .serverdatapost("booking/feedbackByUser", this.servicedata)
      .subscribe(
        (res) => {
          console.log(res);


          alert("Thank you for your feedback!");
        },
        (err) => {
          console.log(err);
        }
      );
  }

  async confirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Cancel Booking",
      message: `Are you sure you want to <strong>cancel booking</strong>? <br><br>
      If you will cancel the booking, ${this.choosed_location?.user_cancellation_fee}% cancellation charge will apply. <br><br>
      Your money will refund in 2-3 working days.`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel: false");
          },
        },
        {
          text: "Okay",
          handler: () => {
            this.cancelBooking();
          },
        },
      ],
    });

    await alert.present();
  }

  cancelBooking() {
    this.choosed_loc = JSON.parse(localStorage.getItem('choosed_location'))
    this.selected_loc = this.choosed_loc._id;
    this.servicedata = {
      booking_id: this.details._id,
      cancel_by: "user",
      city_id: this.selected_loc
    };

    this.common
      .serverdatapost("booking/cancelBooking", this.servicedata)
      .subscribe(
        (res) => {
          console.log(res);
          this.backBtn();
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

  //get Booking
  getBooking() {
    this.servicedata = {
      booking_number: this.details.booking_number
    }
    this.common.serverdatapost("booking/bookingDetails", this.servicedata).subscribe(
      (res) => {
        this.data = res;
        this.d = this.data.response[0];

        console.log(this.d);
        for (let i = 0; i < this.d.booking_details.length; i++) {
          this.rate = this.d.booking_details[i].rate;
          this.rates += this.rate;
        }

        for (let i = 0; i < this.d.booking_details.length; i++) {
          this.amount = this.d.booking_details[i].final_amount;
          this.amounts += this.amount;
          this.delivary_charges = this.d.booking_details[i].product_delivery_charge ? this.d.booking_details[i].product_delivery_charge : 0;
          this.final_delivary_charges = this.final_delivary_charges + this.delivary_charges;
        }
        for (let i = 0; i < this.d.booking_details.length; i++) {
          this.feedback = this.d.booking_details[i].user_feedback
        }

      },
      (err) => {
        console.log(err);
      }
    )
  }
}
