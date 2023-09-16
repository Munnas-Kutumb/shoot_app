import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-m-contact-us",
  templateUrl: "./m-contact-us.page.html",
  styleUrls: ["./m-contact-us.page.scss"],
})
export class MContactUsPage implements OnInit {

  servicedata: any;
  merchant_id: any;
  description: any;

  constructor(private route: Router, private commonservice: CommonService) {}

  ngOnInit() {}

  backBtn() {
    this.route.navigateByUrl("/tab/tabs/profile");
  }

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
  }

  addsupport() {
    this.commonservice.setHeaders();

    this.servicedata = {
        _id: this.merchant_id,
	      type: 0,
        description: this.description
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("support/addSupport", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let Subdata: any = res;
          if(Subdata.status){
            this.commonservice.toastalert(Subdata.message);
            this.description = "";
          }
          else{
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
