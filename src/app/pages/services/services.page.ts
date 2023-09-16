import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-services",
  templateUrl: "./services.page.html",
  styleUrls: ["./services.page.scss"],
})
export class ServicesPage implements OnInit {
  servicedata: any = {};

  categoryList: any = [];
  categorySubList: any = [];
  baseUrl: any;
  selected_cat: any;
  selected_cat_name: any;

  constructor(private router: Router, private commonservice: CommonService) {}

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.baseUrl = this.commonservice.serviceurl;
    this.commonservice.setHeaders();
    this.getAllCategory();
  }

  selectMenuList(items) {
    this.selected_cat = items._id;
    this.selected_cat_name = items.category_name;
    localStorage.setItem("mainCategoryId", items._id);
    localStorage.setItem("cName", items.category_name);
    console.log(items.category_name);
    this.getSubCategory();
  }

  toServicePage(item) {
    console.log(item);


    if (item.category_type == 0) {
      localStorage.setItem("mainCategoryId", item.service_category_id);
      localStorage.setItem("mainSubCategoryId", item._id);
      localStorage.setItem("subcatName", item.subcategory_name);
      localStorage.setItem("colorCode", item.color_code);
      localStorage.setItem("back", "1");
      console.log(item.category_type);
      this.router.navigateByUrl("/service-request");
    } else {
      localStorage.setItem("mainCategoryId", item.service_category_id);
      localStorage.setItem("mainSubCategoryId", item._id);
      localStorage.setItem("subcatName", item.subcategory_name);
      localStorage.setItem("back", "1");
      console.log(item.category_type);
      this.router.navigateByUrl("/product-list");
    }
  }

  getAllCategory() {
    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("service_category/getServiceCategory", "")
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data.response.reverse());
          this.categoryList = data.response;
          this.categorySubList = [];
          if (this.categoryList.length) {
            this.selected_cat = this.categoryList[0]._id;
            this.selected_cat_name = this.categoryList[0].category_name;
            localStorage.setItem("mainCategoryId", this.selected_cat);
            localStorage.setItem("cName", this.selected_cat_name);
            this.getSubCategory();
          }
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  getSubCategory() {
    if (this.selected_cat_name == "All Moments") {
      this.servicedata = {
        query: {},
      };
    } else {
      this.servicedata = {
        query: { service_category_id: this.selected_cat },
      };
    }

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost(
        "service_subcategory/getServiceSubCategory",
        this.servicedata
      )
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let Subdata: any = res;
          console.log(Subdata.response);
          this.categorySubList = Subdata.response;
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }
}
