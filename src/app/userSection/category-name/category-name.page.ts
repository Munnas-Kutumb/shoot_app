import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-category-name",
  templateUrl: "./category-name.page.html",
  styleUrls: ["./category-name.page.scss"],
})
export class CategoryNamePage {
  servicedata: any;
  name:any;

  constructor(private router: Router, private common: CommonService) {}

  ionViewWillEnter(){
    this.getProductsCategory();
    localStorage.setItem('pro_list','category-name');
  }

  backBtn() {
    this.router.navigate(["/tabs/user-tabs/user-home-page"]);
  }

  navprolist(id, category) {
    this.name=category
    localStorage.setItem('category',this.name)
    localStorage.setItem('product_cat_id', id)
    this.router.navigate(["/user-product-list"]);
  }

  pro_categry: any = [];
  getProductsCategory() {
    this.servicedata = {
      query: { category_type: 1 },
    };
    this.common
      .serverdatapost(
        "service_subcategory/getServiceSubCategory",
        this.servicedata
      )
      .subscribe(
        (res) => {
          var data;
          data = res;
          this.pro_categry = data.response;
          console.log(this.pro_categry);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
