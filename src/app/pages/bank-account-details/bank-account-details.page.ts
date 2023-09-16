import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-bank-account-details",
  templateUrl: "./bank-account-details.page.html",
  styleUrls: ["./bank-account-details.page.scss"],
})
export class BankAccountDetailsPage implements OnInit {
  acc_name: any = "";
  bank_name: any = "";
  account_number: any;
  confirm_account_number: any;
  ifsc_code: any = "";

  merchant_id: any = "";

  servicedata: any = {};

  constructor(
    private router: Router,
    private commonservice: CommonService,
    public alertController: AlertController,
    private ngzone: NgZone
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    this.commonservice.setHeaders();
    this.getProfile();
  }

  backBtn() {
    if(localStorage.traceback == 'profile'){
      localStorage.removeItem('profile');
      this.router.navigateByUrl("/account-details");
    }
    else this.router.navigateByUrl("/profile-approval");
  }


  myvalidnum(e) {

    console.log(this['account_number'],
      this.account_number);
    var reg = /^\d+$/
    if (!e.target.value.match(reg)) {
      this.commonservice.toastalert("Invalid Value");
    }
    else {
      // nothing
    }
  }



  pan_number_valid: boolean = false;
  checkPanNumber(val) {
    var re = /\S+@\S+\.\S+/;
    var check = re.test(this[val]);
    this.pan_number_valid = false;

    if (!check && val == "pan_card_number") this.pan_number_valid = true;
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
            if (data.response.bank_name)
              this.bank_name = data.response.bank_name;
            if (data.response.account_holder_name)
              this.acc_name = data.response.account_holder_name;
            if (data.response.account_number)
              this.account_number = data.response.account_number;
            if (data.response.account_number)
              this.confirm_account_number = data.response.account_number;
            if (data.response.ifsc) this.ifsc_code = data.response.ifsc;
          } else this.commonservice.toastalert(data.message);
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  submitDetails() {

    var x = this.account_number;

    if(x.toString().length < 9){
      this.commonservice.toastalert("Invalid Account Number");
      return;
    }
    if (this.account_number != this.confirm_account_number) {
      this.confirm_account_number = "";
      this.commonservice.toastalert(
        "Account Mismatch. Please check and enter correctly."
      );
      return;
    }
    if (!this.bank_name) {
      this.commonservice.toastalert(
        "Bank name is required."
      );
      return;
    }
    if (!this.acc_name) {
      this.commonservice.toastalert(
        "Account holder name is required."
      );
      return;
    }
    if (!this.account_number) {
      this.commonservice.toastalert(
        "Account number is required."
      );
      return;
    }
    if (!this.ifsc_code) {
      this.commonservice.toastalert(
        "IFSC code is required."
      );
      return;
    } else {
      this.servicedata = {
        merchant_id: this.merchant_id,
        bank_name: this.bank_name,
        account_holder_name: this.acc_name,
        account_number: this.account_number,
        ifsc: this.ifsc_code,
      };

      if ((this.ifsc_code + "").length != 11)
        return this.commonservice.toastalert("Please enter valid IFS Code!");

      // if ((this.account_number + "").length > 20)
      //   return this.commonservice.toastalert(
      //     "Account number not more than 20 digits!"
      //   );

      this.commonservice.waitloadershow();
      this.commonservice
        .serverdatapost("merchant/updateBankDetails", this.servicedata)
        .subscribe(
          (res) => {
            this.commonservice.waitloaderhide();
            let data: any = res;
            console.log(data);
            if (data.status) {
              this.commonservice.toastalert(data.message);
              this.backBtn();
            } else this.commonservice.toastalert("Something went wrong!");
          },

          (error) => {
            console.log(error);
            this.commonservice.waitloaderhide();
            this.commonservice.toastalert("Something went wrong!");
          }
        );
    }
  }
}
