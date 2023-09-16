import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { NavController } from "@ionic/angular";


declare var RazorpayCheckout: any;


@Component({
  selector: 'app-user-payment',
  templateUrl: './user-payment.page.html',
  styleUrls: ['./user-payment.page.scss'],
})
export class UserPaymentPage {
  user_details: any = [];
  user_order_details: any = [];
  servicedata: any = [];
  order_items: any = [];
  cart_items: any = [];
  cart_products: any = [];
  date: any;
  time: any;
  address: any;
  data: any = [];
  merchant: any = [];
  addr: any;
  order_list: any = [];
  booking_id: any;
  payment_id: any;



  constructor(private commonservice: CommonService, private router: Router, private navController: NavController) { }

  ionViewWillEnter() {

    this.user_details = JSON.parse(localStorage.getItem('user_details'));
    console.log(this.user_details);
    this.user_order_details = JSON.parse(localStorage.getItem('user_order_details'));
    console.log(this.user_order_details);

    localStorage.getItem("user_id")
    if (localStorage.cart_items) this.cart_items = JSON.parse(localStorage.cart_items);
    console.log(this.cart_items);

    if (localStorage.cart_product) this.cart_products = JSON.parse(localStorage.cart_product);
    console.log(this.cart_products);
    this.date = localStorage.bookingDate;
    console.log(this.date);
    this.time = localStorage.bookingTime;
    this.address = localStorage.bookingAddress;
    console.log(this.address);
    this.getmerchantbyid();

    this.order_list = JSON.parse(localStorage.getItem('order_items'));
    console.log(this.order_list);

  }

  getmerchantbyid() {
    this.servicedata = {
      "merchant_id": localStorage.getItem('cart_merchantid')
    }
    this.commonservice.serverdatapost('merchant/getMerchantById', this.servicedata).subscribe(
      (res) => {
        this.data = res;
        this.merchant = this.data.response;
        console.log(this.merchant);
        this.addr = this.merchant.address.address;
        console.log(this.addr)

      },
      (err) => {
        console.log(err);
      }
    )
  }


  pay() {
    console.log("called");

    var options = {
      key: this.user_order_details.key, // Enter the Key ID generated from the Dashboard
      amount: this.user_order_details.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: this.user_order_details.currency,
      name: "Shoot App",
      description: "Payment for order",
      image: "https://razorpay.com/favicon.png",
      order_id: this.user_order_details.id, // Pass the `id` obtained in the response of Step 1
      // "handler": (response) => {
      //   console.log(response);
      // },
      prefill: {
        email: this.user_details.email,
        contact: this.user_details.phone,
      },
      notes: "order payment",
      theme: {
        color: "#ff4600",
      },

    };

    var successCallback = (success) => {
      console.log(success);
      console.log("payment_id: " + success.razorpay_payment_id);
      console.log("signature: " + success.razorpay_signature);

      this.addBooking(success.razorpay_payment_id);
    };

    var cancelCallback = (error) => {
      console.log(error.description + " (Error " + error.code + ")");
    };

    RazorpayCheckout.on("payment.success", successCallback);
    RazorpayCheckout.on("payment.cancel", cancelCallback);
    RazorpayCheckout.open(options);
  }



  addBooking(paymentid) {
    if (paymentid) {
      this.servicedata = {
        merchant_id: localStorage.getItem('cart_merchantid'),
        user_id: localStorage.getItem('user_id'),
        booking_date: localStorage.bookingDate,
        booking_time: localStorage.bookingTime,
        location: this.merchant.location,
        address: this.address,
        delivery_address: localStorage.getItem('deliveryaddr'),
        total_ammount: this.user_details.amount,
        place_order: this.order_list,
        isProduct: this.cart_products.length > 0 ? true : false
      };

      console.log(this.servicedata);

      this.commonservice
        .serverdatapost("booking/addBooking", this.servicedata)
        .subscribe(
          (res) => {

            let data: any;
            data = res;
            console.log(data);

            if (data.status) {
              localStorage.removeItem('merchantDetails');
              localStorage.removeItem('cart_items');
              localStorage.setItem('cart_count', '0');
              localStorage.removeItem('cart_merchantid');
              localStorage.removeItem('cart_product');
              localStorage.removeItem('bookingDate');
              localStorage.removeItem("bookingAddress");
              this.order_items = [];
              localStorage.removeItem('bookingTime');
              this.paymentDetails(paymentid, data.response.booking._id);
            }
            else {
              // alert(JSON.stringify(data));
              this.commonservice.showAlert("Something went wrong while add booking...");
            }
          },
          (err) => {

            console.log(err);
          }
        );
    }
    else {
      alert("error payment details not found!")
    }
  }


  paymentDetails(paymentId, bookingid) {

    this.servicedata = {
      payment_id: paymentId,
      booking_id: bookingid

    };

    this.commonservice.waitloadershow();
    this.commonservice.serverdatapost("booking/paymentdetails", this.servicedata).subscribe(
      (res) => {
        this.commonservice.waitloaderhide();
        let data: any = res;

        if (data.status == true) {
          this.commonservice.toastalert(data.message);
          // alert("i am here");
          // alert('status called in if')
          // this.addBooking();

          this.router.navigate([
            "/tabs/user-tabs/user-booking-list",
          ]);
        }
        else {
          this.commonservice.toastalert(data.message);
          alert('error called in else')
        }
      },
      (error) => {
        console.log(error);

        // console.log('service error');
        // alert('payment error called');

        this.commonservice.waitloaderhide();
        this.commonservice.toastalert("Something went wrong!");
      }
    );
  }



  backBtn() {
    this.router.navigate(['/user-cart']);
  }
}
