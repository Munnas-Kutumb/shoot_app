import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { CommonService } from "src/service/commonservice";

declare var RazorpayCheckout: any;


@Component({
  selector: "app-user-cart",
  templateUrl: "./user-cart.page.html",
  styleUrls: ["./user-cart.page.scss"],
})
export class UserCartPage implements OnInit {
  // merchant: any;
  baseUrl: any;
  servicedata: any;
  user: any;
  user_id: any;
  date: any;
  time: any;
  address: any;
  total_amount: any = 0;
  cart_items: any = [];
  order_items: any = [];

  actual_amount: any = 0;
  discount_amount: any = 0;
  isopen: boolean = false;
  openTermCondition: boolean = false;
  open: boolean = false;
  addropen: boolean = false;
  cart_products: any = [];
  // cart_product: any = [];
  cart_count: any;
  selectedItem: any;
  service_category: any;
  service_subcategory: any;
  service_primecategory: any;
  data: any;
  merchant: any = {}
  addr: any;
  delivery_address: any;
  choosed_location: any;
  delivery_charge: any = 0;

  constructor(
    private router: Router,
    private common: CommonService,
    private navController: NavController
  ) { }

  ionViewWillEnter() {
    this.getmerchantbyid();

    // if(localStorage.merchantDetails) this.merchant = JSON.parse(localStorage.merchantDetails);
    // console.log(this.merchant);

    this.baseUrl = this.common.serviceurl;
    this.user_id = localStorage.getItem("user_id");

    if (localStorage.cart_items) this.cart_items = JSON.parse(localStorage.cart_items);
    console.log(this.cart_items);

    if (localStorage.cart_product) this.cart_products = JSON.parse(localStorage.cart_product);
    console.log(this.cart_products);



    this.date = localStorage.bookingDate;
    console.log(this.date);
    this.time = localStorage.bookingTime;
    this.address = localStorage.bookingAddress;
    console.log(this.address);

    this.cart_count = localStorage.cart_count;

    this.calculateCost();
    localStorage.getItem('cart_product')
  }

  ngOnInit() {
    // this.choosed_location = JSON.parse(localStorage.getItem("choosed_location"));
    this.servicedata = {
      city_id: JSON.parse(localStorage.getItem("choosed_location"))._id,
    };
    this.common.serverdatapost("city/getCityById", this.servicedata).subscribe(
      (res) => {
        var data;
        data = res;
        this.choosed_location = data.response;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  backBtn() {
    if (localStorage.byCheckout == "cartpage") {
      this.navController.navigateRoot(["/use-merchant-profile"]);
      localStorage.removeItem('byCheckout');
    }
    else if (localStorage.byCheckout == "productpage") {
      this.navController.navigateRoot(["/user-product-detail"]);
      localStorage.removeItem('byCheckout')

    }

    else {
      this.navController.navigateRoot(["/tabs/user-tabs/user-home-page"]);
    }
  }

  openDetail(item) {
    this.selectedItem = item;
    this.close();
  }
  Detail(product) {
    this.selectedItem = product;
    this.closed();
  }
  shippingaddr() {
    this.addrclosed();
  }


  calculateCost() {

    this.actual_amount = 0;
    this.discount_amount = 0;
    this.total_amount = 0;
    this.order_items = [];


    this.cart_items.map(item => {


      this.order_items.push({
        service_subcategory: item.service_subcategory[0].subcategory_name,
        service_primecategory: item.service_primecategory[0].primecategory_name,
        service_name: item.service_type,
        service_type: item.service_type,
        number_of_photo: item.number_of_photo,
        hours: (item.hours) ? parseInt(item.hours) : '',
        softcopy: item.softcopy,
        rate: item.rate,
        discount: item.discount,
        // isProduct:false
      });

      this.actual_amount = this.actual_amount + item.rate;
      this.discount_amount = this.discount_amount + (item.rate * item.discount) / 100;
      console.log(this.actual_amount)
      console.log(this.discount_amount)
    })

    this.cart_products.map(item => {

      this.order_items.push({
        product_name: item.name,
        product_description: item.description,
        product_delivery_day: item.delivery_day,
        product_delivery_charge: item.delivery_charge,
        rate: item.selected_size_price,
        discount: item.discount,
        // isProduct:true


      });
      this.actual_amount = this.actual_amount + parseInt(item.selected_size_price);
      this.discount_amount = this.discount_amount + (item.selected_size_price * item.discount) / 100;
      this.delivery_charge = item.delivery_charge
      console.log(this.actual_amount)
      console.log(this.discount_amount)


    })

    this.total_amount = this.actual_amount - this.discount_amount + this.delivery_charge;
    console.log(this.total_amount)
    console.log(this.order_items)


  }

  removeSc(item) {
    var result = confirm("Are you sure you want to delete");
    if (result) {
      var index = this.cart_items.findIndex(e => e._id == item._id);
      this.cart_items.splice(index, 1);

      this.cart_count--;

      console.log(this.cart_items);

      localStorage.setItem('cart_items', JSON.stringify(this.cart_items))
      localStorage.setItem('cart_count', JSON.stringify(this.cart_count))


      if (this.cart_count == 0) localStorage.removeItem('cart_merchantid');
      this.calculateCost();
    }

  }
  removeproduct(product) {
    var result = confirm("Are you sure you want to delete");
    if (result) {
      var index = this.cart_products.findIndex(e => e._id == product._id);
      this.cart_products.splice(index, 1);

      this.cart_count--;

      console.log(this.cart_products);

      localStorage.setItem('cart_product', JSON.stringify(this.cart_products))
      localStorage.setItem('cart_count', JSON.stringify(this.cart_count))


      if (this.cart_count == 0) {
        localStorage.removeItem('cart_merchantid')
        localStorage.removeItem('cart_product')

      };
      this.calculateCost();
    }

  }


  addNewBooking() {

    if (this.cart_items.length > 0 && !localStorage.bookingDate) {
      alert('Please select booking date and venue details');
      return;

    }
    else if (this.cart_products.length > 0 && this.delivery_address == undefined) {
      alert('Please enter delivery address');
      return;
    }
    else if ((this.cart_items.length > 0 && this.cart_products.length > 0) && (!localStorage.bookingDate && this.delivery_address == "null")) {
      alert('Please enter required details');
    }
    localStorage.setItem('order_items', JSON.stringify(this.order_items))
    var result = confirm("Are you sure you want to continue");
    if (result) {
      this.servicedata = {
        amount: this.total_amount * 100
      }
      this.common.serverdatapost('booking/createOrder', this.servicedata).subscribe(
        (res) => {
          this.data = res;
          console.log(this.data);
          if (this.data.status) {
            localStorage.setItem('user_order_details', JSON.stringify(this.data.response));
            this.router.navigate(['/user-payment'])
          }

        },
        (err) => {
          console.log(err);

        }
      );
    }
  }



  close() {
    this.isopen = !this.isopen;
  }
  closeTermCondition() {
    this.openTermCondition = !this.openTermCondition;
  }
  closed() {
    this.open = !this.open;
  }
  addrclosed() {
    this.addropen = !this.addropen;
  }
  saveaddr() {
    this.delivery_address = this.delivery_address;
    console.log(this.delivery_address);
    localStorage.setItem('deliveryaddr', this.delivery_address)
    this.addrclosed();
  }
  getmerchantbyid() {
    this.servicedata = {
      "merchant_id": localStorage.getItem('cart_merchantid')
    }
    this.common.serverdatapost('merchant/getMerchantById', this.servicedata).subscribe(
      (res) => {
        this.data = res;
        this.merchant = this.data.response;
        console.log(this.merchant);
        // this.addr = this.merchant.address.address;
        // console.log(this.addr)

      },
      (err) => {
        console.log(err);
      }
    )
  }
}
