import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Clipboard } from "@ionic-native/clipboard/ngx";

import {
  AlertController,
  ActionSheetController,
  Platform,
  NavController,
} from "@ionic/angular";
import { ModalController, ToastController } from "@ionic/angular";
declare var cordova: any;

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.page.html",
  styleUrls: ["./user-profile.page.scss"],
})
export class UserProfilePage implements OnInit {
  servicedata: any = "";
  user_id: any = "";
  userdata: any = "";
  profiledata: any = "";
  first_name: any = "";
  last_name: any = "";
  image: any = "";

  lastImage: string = null;
  baseUrl: any = "";
  referral_code: any = "";

  constructor(
    private router: Router,
    private common: CommonService,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    public platform: Platform,
    private socialSharing: SocialSharing,
    private clipboard: Clipboard,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.baseUrl = this.common.serviceurl;
    this.userdata = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.userdata.user_id;
    this.getUserProfile();
  }

  toEditProfile() {
    this.navController.navigateRoot(['/edit-profile']);
    // this.router.navigateByUrl("/edit-profile");
  }

  toContactUs() {
    this.router.navigateByUrl("/user-contact-us");
  }

  toBackBtn() {
    this.router.navigateByUrl("/user-contact-us");
  }

  toAboutUs() {
    this.router.navigateByUrl("/user-aboutus");
  }

  logout() {
    this.logoutAlertConfirm();
  }

  getUserProfile() {
    this.servicedata = {
      user_id: this.user_id,
    };

    this.common.serverdatapost("user/getUserById", this.servicedata).subscribe(
      (res) => {
        var data;
        data = res;
        this.profiledata = data.response;
        console.log(this.profiledata);

        if (this.profiledata.first_name)
          this.first_name = this.profiledata.first_name;
        if (this.profiledata.last_name)
          this.last_name = this.profiledata.last_name;
        if (this.profiledata.image) this.image = this.profiledata.image;

        this.referral_code = data.response.referral_code;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async logoutAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Logging out?",
      message: "Are you sure you want to log out?",
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
            this.router.navigateByUrl("/login-main");
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
      this.referral_code +
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
    this.clipboard.copy(this.referral_code);
    this.common.toastalert("copied!");
    console.log(this.referral_code);
  }

  pasteText() {
    this.clipboard.paste().then(
      (resolve: string) => {
        this.referral_code = resolve;
        //  console.log(resolve);
      },
      (reject: string) => {
        console.error("Error: " + reject);
      }
    );
    this.clipboard.clear();
  }
}
