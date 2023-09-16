import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CommonService } from "src/service/commonservice";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-user-register",
  templateUrl: "./user-register.page.html",
  styleUrls: ["./user-register.page.scss"],
})
export class UserRegisterPage implements OnInit {
  servicedata: any = {};
  user_phone: any;
  first_name: any = "";
  last_name: any = "";
  email: any = "";
  user_id: any;

  constructor(
    private router: Router,
    private commonservice: CommonService,
    public alertController: AlertController
  ) {}

  ionViewWillEnter() {
    var user_details = JSON.parse(localStorage.getItem("user"));
    this.user_id = user_details.user_id;
    this.user_phone = user_details.phone;
    console.log(user_details);
  }

  ngOnInit() {}

  skipBtn() {
    this.router.navigateByUrl("/tabs/user-tabs/user-home-page");
  }

  updateProfile() {
    this.commonservice.setHeaders();

    this.servicedata = {
      user_id: this.user_id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.user_phone,
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("user/updatePersonalDetails", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          this.commonservice.toastalert(data.message);
          this.router.navigateByUrl("/tabs/user-tabs/user-home-page");
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  async profileUpdated() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Congratulations",
      message: "Updated Succesfully",
      buttons: [
        {
          text: "Next",
          handler: () => {
            this.router.navigateByUrl("/tabs/user-tabs/user-home-page");
          },
        },
      ],
    });

    await alert.present();
  }
}
