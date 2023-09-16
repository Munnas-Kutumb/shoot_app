import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

import {
  Component,
  OnInit,
  ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__,
} from "@angular/core";

declare var RazorpayCheckout: any;

@Component({
  selector: "app-subscription-process",
  templateUrl: "./subscription-process.page.html",
  styleUrls: ["./subscription-process.page.scss"],
})
export class SubscriptionProcessPage implements OnInit {
  merchant_id: any = "";
  amount: any;
  servicedata: any;
  discount: any;
  due_amount: any;
  name: any;

  paydate: any = new Date();
  subscription_id: any;
  duration: any;
  description: any;
  discount_amount: any;

  constructor(private router: Router, private commonservice: CommonService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    let subpay = JSON.parse(localStorage.getItem("subscpon"));
    this.amount = subpay.ammount;
    this.discount_amount = (subpay.ammount * subpay.discount) / 100;
    this.due_amount = subpay.ammount - this.discount_amount;
    this.name = subpay.name;
    this.subscription_id = subpay._id;
    this.duration = subpay.duration;
    this.description = subpay.description;

    console.log(subpay);
    this.getProfile();
    console.log(this.paydate);
  }

  backBtn() {
    this.router.navigateByUrl("/market-yourself");
  }

  paydetail: any;

  merchant: any = {};

  getProfile() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };

    this.commonservice
      .serverdatapost("merchant/getMerchantById", this.servicedata)
      .subscribe(
        (res) => {
          let data: any = res;
          console.log(data);
          this.merchant = data.response;
        },
        (error) => {
          console.log(error);
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  // transaction razor pay
  pay() {
    this.servicedata = {
      amount: this.due_amount * 100,
    };

    this.commonservice.setHeaders();
    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/createOrder", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          this.paydetail = data.response;
          console.log(this.paydetail);
          this.payamount();
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  payamount() {
    var options = {
      key: this.paydetail.key,
      amount: this.paydetail.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: this.paydetail.currency,
      name: "Shoot App",
      description: "Subscription Fee",
      image: "https://razorpay.com/favicon.png",
      order_id: this.paydetail.id,
      prefill: {
        email: this.merchant.business_email,
        contact: this.merchant.phone,
      },
      notes: "merchant pay",
      theme: {
        color: "#01b1ff",
      },
    };

    var successCallback = (success) => {
      console.log("payment_id: " + success.razorpay_payment_id);
      console.log("signature: " + success.razorpay_signature);

      this.paymentDetails(success.razorpay_payment_id);
    };

    var cancelCallback = (error) => {
      console.log(error.description + " (Error " + error.code + ")");
    };

    RazorpayCheckout.on("payment.success", successCallback);
    RazorpayCheckout.on("payment.cancel", cancelCallback);
    RazorpayCheckout.open(options);
  }

  paymentDetails(paymentId) {
    this.servicedata = {
      merchant_id: this.merchant_id,
      payment_id: paymentId,
      subscription_id: this.subscription_id,
      subscription_details: {
        name: this.name,
        discount: this.discount,
        amount: this.amount,
        total_amount: this.due_amount,
        duration: this.duration,
        description: this.description,
        sub_date: this.paydate,
      },
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/subscriptionPaymentDetails", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.status) {
            this.commonservice.toastalert(data.message);
            this.router.navigateByUrl("/market-yourself");
            // this.merchant.payment_id = paymentId;
          } else {
            this.commonservice.toastalert(data.message);
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
