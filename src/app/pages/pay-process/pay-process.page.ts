import {
  Component,
  OnInit,
  ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__,
} from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

declare var RazorpayCheckout: any;

@Component({
  selector: "app-pay-process",
  templateUrl: "./pay-process.page.html",
  styleUrls: ["./pay-process.page.scss"],
})
export class PayProcessPage implements OnInit {
  status: any = {};
  servicedata: any = {};
  merchant_id: any = "";
  merchant: any = {};
  paydate: any = new Date();
  amount: any;

  constructor(private router: Router, private commonservice: CommonService) {}

  ngOnInit() {}

  backBtn() {
    // if(localStorage.traceback == 'profile'){
    //   localStorage.removeItem('profile');
    //   this.router.navigateByUrl("/account-details");
    // }
    // else

    this.router.navigateByUrl("/profile-approval");
  }

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    this.getProfile();

    // setTimeout(() => {
    //   this.getCityForAmount();
    // }, 1000);
  }

  getProfile() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/getMerchantById", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.status) {
            this.merchant = data.response;
            setTimeout(() => {
              this.getCityForAmount();
            }, 1000);

            if (this.merchant.registration_payment_status) {
              setTimeout(() => {
                this.backBtn();
              }, 2000);
            }
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

  paydetail: any;
  // transaction razor pay
  pay() {
    this.servicedata = {
      amount: this.amount*100,
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
      description: "Registration Fee",
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

  paymentsuccess: boolean = false;
  paymentDetails(paymentId) {
    this.servicedata = {
      merchant_id: this.merchant_id,
      payment_id: paymentId,
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/paymentDetails", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.status) {
            this.commonservice.toastalert(data.message);
            this.getProfile();
            // this.merchant.payment_id = paymentId;
            // console.log(this.merchant.payment_id);
            

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

  getCityForAmount() {
    this.servicedata = {
      // query: { name: this.merchant.city },
      city_id: this.merchant.city?._id
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("city/getCityById", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.response.ammount) {
            this.amount = data.response.ammount;
          } else {
            this.commonservice.toastalert("Please first select city!");
            this.router.navigateByUrl("/business-details");
            // this.amount = data.response[0].Other;
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
