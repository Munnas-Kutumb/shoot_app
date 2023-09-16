import { Component, OnInit, ViewChild } from "@angular/core";
import {
  IonSelect,
  AlertController,
  Platform,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-user-service-detail",
  templateUrl: "./user-service-detail.page.html",
  styleUrls: ["./user-service-detail.page.scss"],
})
export class UserServiceDetailPage implements OnInit {
  hidePlaySpeedList = true;
  sub_cat_id: any;
  ratingFilter : any;
  servicedata: any;
  merchants: any = [];
  baseUrl: any;
  sub_cat_name: any = "";
  city: any;
  sample: any;

  @ViewChild("filterOption", { static: true }) filterList: IonSelect;

  constructor(private router: Router, private common: CommonService, private navController: NavController) {
    this.baseUrl = this.common.serviceurl;
  }

  ionViewWillEnter() {
    this.sub_cat_id = localStorage.subcategoryid;
    console.log(this.sub_cat_id);
    this.sub_cat_name = localStorage.getItem("subcatname");

    this.sample = JSON.parse(localStorage.getItem('choosed_location'))
    this.city = this.sample.name;
    console.log(this.city);
    this.getMerchants(this.sub_cat_id, this.city);
    this.ratingFilter = "lowTOhigh"
  }

  ngOnInit() { }

  tomProfile(id) {
    localStorage.setItem("merchantid", id);
    this.router.navigateByUrl("/use-merchant-profile");
  }

  backBtn() {
    localStorage.setItem("subcategoryid", "");
    this.navController.navigateRoot("/user-service-list");
  }

  filterOpen() {
    console.log("open");
    this.filterList.open();
  }

  getMerchants(id, city) {
    this.servicedata = {
      service_subcategory_id: id,
      city: city
    };
    console.log(this.servicedata.city);


    this.common
      .serverdatapost("service/getMerchantBySubCategory", this.servicedata)
      .subscribe(
        (res) => {
          var data;
          data = res;
          console.log(data);
          this.merchants = data.response;
          if (data.status) this.filterChoice('lowTOhigh')
          if (this.merchants.length == 0)
            return this.common.toastalert("Currently Service not available!");
        },
        (err) => {
          console.log(err);
        }
      );
  }

  filter_list: any;

  ratesortig: any = [];

  filterChoice(e) {
    console.log(e);

    //this.merchants.sort();

    if (e == "highToLow") {
      this.ratesortig = this.merchants.sort((a, b) => b.rating - a.rating);
      console.log(this.ratesortig);
    }

    if (e == "lowTOhigh") {
      console.log(this.merchants);

      this.ratesortig = this.merchants.sort((a, b) => a.rating - b.rating);

      console.log(this.ratesortig);
    }

    if (e == "discount") {
      this.ratesortig = this.merchants.sort((a, b) => a.discount - b.discount);
      console.log(this.ratesortig);
    }
  }
}
