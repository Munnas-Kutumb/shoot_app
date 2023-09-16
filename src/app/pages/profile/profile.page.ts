import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { AlertController } from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Clipboard } from "@ionic-native/clipboard/ngx";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  servicedata: any = {};
  merchantIs: any = {};
  merchantDetails: any = {};
  ref_code: any = "";
  name: any;
  merchant_id: any = "";

  constructor(
    private router: Router,
    private commonservice: CommonService,
    public alertController: AlertController,
    private socialSharing: SocialSharing,
    private clipboard: Clipboard
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {}

  ionViewWillEnter() {
    this.commonservice.setHeaders();
    this.merchant_id = localStorage.getItem("merchant_id");
    this.getMerchant();

    let m_item = JSON.parse(localStorage.getItem("merchant"));
    this.name = m_item.name;
  }

  toMarketPage() {
    this.router.navigateByUrl("/market-yourself");
  }

  toGeneralDetails() {
    this.router.navigateByUrl("/account-details");
  }

  togstDetails() {
    this.router.navigateByUrl("/gst-details");
  }

  toAboutPage() {
    this.router.navigateByUrl("/aboutus-vendor");
  }

  toreportDetails() {
    this.router.navigateByUrl("/detail-page");
  }

  contactus() {
    this.router.navigateByUrl("/m-contact-us");
  }

  getMerchant() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/getMerchantById", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let details: any = res;
          this.merchantDetails = details.response;
          console.log(this.merchantDetails);
          this.ref_code = details.response.referral_code;
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  logout() {
    this.logoutAlertConfirm();
  }

  async logoutAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Logging out?",
      message: "Are you sure about it?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: false");
          },
        },
        {
          text: "Yes, logout",
          handler: () => {
            localStorage.clear();
            this.router.navigateByUrl("/login");
          },
        },
      ],
    });

    await alert.present();
  }

  //Social Share Plugin

  share() {
    var msg =
      "Join me on SHOOT, the best app for photography, videography, gifts and arts." +
      " Enter my code " +
      this.ref_code +
      " to get discount on your first shoot! " +
      "https://play.google.com/store/apps/details?id=com.appshoot.www";

    // "Checkout Shoot App, I found it best for photography. Download : " +
    // "https://play.google.com/store/apps/details?id=com.shootapp.www" +
    // " Use my referral code - " +
    // this.ref_code;
    console.log(msg);
    this.socialSharing.share(msg, null, null, null);
  }

  // Copy Referral Code to Clipboard

  copyCode() {
    this.clipboard.copy(this.ref_code);
    this.commonservice.toastalert("copied!");
    console.log(this.ref_code);
  }

  pasteText() {
    this.clipboard.paste().then(
      (resolve: string) => {
        this.ref_code = resolve;
        //  console.log(resolve);
      },
      (reject: string) => {
        console.error("Error: " + reject);
      }
    );
    this.clipboard.clear();
  }
}
