import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-user-contact-us",
  templateUrl: "./user-contact-us.page.html",
  styleUrls: ["./user-contact-us.page.scss"],
})
export class UserContactUsPage implements OnInit {
  user_id: any;
  servicedata: any;
  description: any;

  constructor(private route: Router, private commonservice: CommonService) {}

  ngOnInit() {}

  backBtn() {
    this.route.navigateByUrl("/tabs/user-tabs/user-profile");
  }

  ionViewWillEnter() {
    this.user_id = localStorage.user_id;
  }

  addsupport() {
    this.commonservice.setHeaders();

    this.servicedata = {
      _id: this.user_id,
      type: 1,
      description: this.description,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("support/addSupport", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let Subdata: any = res;
          if (Subdata.status) {
            this.commonservice.toastalert(Subdata.message);
            this.description = "";
          } else {
            this.commonservice.toastalert(Subdata.message);
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
