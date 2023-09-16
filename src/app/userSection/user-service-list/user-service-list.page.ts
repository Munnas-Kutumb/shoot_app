import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-user-service-list",
  templateUrl: "./user-service-list.page.html",
  styleUrls: ["./user-service-list.page.scss"],
})
export class UserServiceListPage implements OnInit {
  servicedata: any;
  categories: any = [];
  subcategories: any = [];
  selected_cat: any;
  baseUrl: any;

  constructor(private router: Router, private common: CommonService) {
    this.baseUrl = this.common.serviceurl;
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getAllCategories();

  }

  toServiceDetails(item) {
    console.log(item);

    if (item.category_type == 0) {
      localStorage.setItem("subcategoryid", item._id);
      localStorage.setItem("subcatname", item.subcategory_name);
      this.router.navigateByUrl("/user-service-detail");
    } else {
      localStorage.setItem("subcategoryid", item._id);
      localStorage.setItem("subcatname", item.subcategory_name);
      localStorage.setItem("userservice","redirect")
      this.router.navigateByUrl("/user-product-list");
    }
  }

  backBtn() {
    if (localStorage.traceback == "booking") {
      localStorage.setItem("traceback", "");
      this.router.navigateByUrl("/tabs/user-tabs/user-booking-list");
    } else {
      localStorage.setItem("categoryid", "");
      this.router.navigateByUrl("/tabs/user-tabs/user-home-page");
    }
  }

  serviceClicked(id, itm) {
    //this.selected_cat = id;

    this.subcategories = []; 

    if (itm.category_name == "All Moments") {
      this.selected_cat = itm.category_name;
    } else {
      this.selected_cat = itm._id;
    }
    this.getSubCategories(itm._id);
    localStorage.setItem("categoryid", id);
  }

  getAllCategories() {
    this.common
      .serverdatapost("service_category/getServiceCategory", "")
      .subscribe(
        (res) => {
          let data: any = res;
          this.categories = data.response.reverse();
          console.log(this.categories);
          if (localStorage.categoryid) {
            this.selected_cat = localStorage.categoryid;
            console.log(this.selected_cat);
          } else {
            this.selected_cat = this.categories[0]._id;
            console.log(this.selected_cat);
          }
          this.getSubCategories(this.selected_cat);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getSubCategories(id) {
    if (this.selected_cat == "All Moments") {
      this.servicedata = {
        query: {},
      };
    } else {
      this.servicedata = {
        query: { service_category_id: this.selected_cat },
      };
    }

    this.common
      .serverdatapost(
        "service_subcategory/getServiceSubCategory",
        this.servicedata
      )
      .subscribe(
        (res) => {
          let data: any = res;
          console.log(data);
          this.subcategories = data.response;
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
