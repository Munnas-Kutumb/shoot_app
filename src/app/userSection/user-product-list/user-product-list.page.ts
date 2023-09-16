import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-user-product-list",
  templateUrl: "./user-product-list.page.html",
  styleUrls: ["./user-product-list.page.scss"],
})
export class UserProductListPage {

  isopen: boolean = false;
  servicedata: any;
  category: any = '';
  categoryname: any;
  productid: any;
  city: any;
  baseUrl: any;

  constructor(private router: Router, private common: CommonService) { }

  ionViewWillEnter() {
    this.baseUrl = this.common.serviceurl;
    localStorage.getItem('subcategoryid');
    localStorage.getItem('product_cat_id');
    if (localStorage.subcategoryid) {
      this.productid = localStorage.getItem('subcategoryid')
      this.categoryname = localStorage.getItem('subcatname');
    }
    else {
      this.productid = localStorage.getItem('product_cat_id');
      this.categoryname = localStorage.getItem('category');
    }
    this.city = JSON.parse(localStorage.getItem('choosed_location')).name;

    this.getProducts(this.productid);

  }

  backBtn() {
  if(localStorage.getItem("userservice")){
    this.router.navigate(['/user-service-list']);
    localStorage.removeItem("userservice")

  }
    else if (localStorage.pro_list == "pro_list_page") {
      this.router.navigateByUrl("/tabs/user-tabs/user-home-page");
      localStorage.removeItem('subcategoryid');
      localStorage.removeItem('product_cat_id');
      localStorage.removeItem('subcatname')
      localStorage.removeItem('category')

    }
    else {
      this.router.navigateByUrl("/category-name");
      localStorage.removeItem('subcategoryid');
      localStorage.removeItem('product_cat_id');
      localStorage.removeItem('subcatname');
      localStorage.removeItem('category')

    }
    localStorage.removeItem('category');
    // this.router.navigateByUrl("/tabs/user-tabs/user-home-page");
  }

  detailpage(item) {
    console.log(item);
    localStorage.setItem("product_id", item._id);
    this.router.navigate(["/user-product-detail"]);
  }

  info: any = {};
  close(info) {
    this.info = info;
    this.isopen = !this.isopen;
  }

  products: any = [];

  getProducts(id) {
    this.servicedata = {
      query: {
        product_id: id,
        city: this.city
      },
    };
    this.common.serverdatapost("product/getallproduct", this.servicedata).subscribe(
      (res) => {
        var data;
        data = res;
        this.products = data.response;
        console.log(this.products);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  chooseSize(val) {
    console.log(val);
  }
}
