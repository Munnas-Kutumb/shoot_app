import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-user-product-detail",
  templateUrl: "./user-product-detail.page.html",
  styleUrls: ["./user-product-detail.page.scss"],
})
export class UserProductDetailPage {
  baseUrl: any;
  product_details: any;
  cart_product: any = [];
  cart_count: any = 0;
  count: any;
  sellerdetails: any = [];
  address: any;
  size: any;
  products_size: any = [];
  selected_size_price: any = [];

  constructor(private router: Router, private common: CommonService) { }

  slideOpts = {
    initialSlide: 1,
    speed: 50,
    autoplay: true,
  };

  ionViewWillEnter() {
    this.baseUrl = this.common.serviceurl;
    this.getProductById(localStorage.product_id);
    // localStorage.getItem('cart_merchantid')
    // localStorage.getItem('cart_count')
  }

  backBtn() {
    this.router.navigate(["/user-product-list"]);
    this.product_details = [];
  }

  selectSize(e) {
    console.log(e);
    this.selected_size_price = e;
    
  }

  getProductById(id) {
    this.common
      .serverdatapost("product/getproductById", { product_id: id })
      .subscribe(
        (res) => {
          console.log(res);
          let data: any = res;
          this.product_details = data.response;
          this.products_size = this.product_details.price.filter(
            (item) => item.size && item.price
          );
          this.size = this.products_size[0].price;
          this.selected_size_price =this.products_size[0].price;

          console.log(this.product_details);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  addtocart() {

    if (localStorage.cart_product) var cp = JSON.parse(localStorage.cart_product);

    if (cp && cp.length > 0) {
      if (
        this.product_details.merchant_id._id ==
        localStorage.getItem("cart_merchantid")
      ) {
        this.count = localStorage.getItem("cart_count");
        this.count++;
        localStorage.setItem("cart_count", this.count);

        if (localStorage.cart_product)
          this.cart_product = JSON.parse(localStorage.getItem("cart_product"));
        this.product_details["selected_size_price"] = this.selected_size_price;
        console.log(this.cart_product);
        console.log(this.selected_size_price);

        this.cart_product.push(this.product_details);
        // this.cart_product.push(this.product_details.selected_size);
        localStorage.setItem("cart_product", JSON.stringify(this.cart_product));
        localStorage.setItem("byCheckout", "productpage");

        this.router.navigate(["/user-cart"]);
      } else {
        alert("You can choose product from same photographer only");
      }
    } else {
      if (!localStorage.cart_merchantid) {
        localStorage.setItem(
          "cart_merchantid",
          this.product_details.merchant_id._id
        );
        this.cart_count++;
        localStorage.setItem("cart_count", this.cart_count);

        this.product_details["selected_size_price"] = this.selected_size_price;
        this.cart_product.push(this.product_details);
        console.log(this.cart_product);
        // this.cart_product.push(this.product_details.selected_size);
        localStorage.setItem("cart_product", JSON.stringify(this.cart_product));
        this.router.navigate(["/user-cart"]);
      } else {
        alert(
          "You already have service in your cart please confirm for the booking and then add product"
        );
      }
    }
  }
}
