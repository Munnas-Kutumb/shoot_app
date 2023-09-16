import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  Platform,
  PopoverController,
} from "@ionic/angular";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.page.html",
  styleUrls: ["./product-list.page.scss"],
})
export class ProductListPage implements OnInit {
  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private commonservice: CommonService,
    public alertController: AlertController,
    private actionSheetController: ActionSheetController,
    public platform: Platform
  ) {}

  merchant_id: any;
  subcatId: any;
  subcatName: any = "";
  baseUrl: any;
  product_id:any;
  city:any;

  ngOnInit() {
    this.product_id=localStorage.getItem('mainSubCategoryId');
    console.log(this.product_id);
  }

  ionViewWillEnter() {
    this.baseUrl = this.commonservice.serviceurl;
    this.merchant_id = localStorage.getItem("merchant_id");
    this.subcatId = localStorage.getItem("mainSubCategoryId");
    this.subcatName = localStorage.getItem("subcatName");
    this.getProductList();
    this.city= JSON.parse(localStorage.getItem('merchant')).city?.name;
     console.log(this.city);
     
  }

  backBtn() {
    this.router.navigateByUrl("/tab/tabs/services");
  }

  addProduct() {
    localStorage.removeItem("editproduct");
    this.router.navigateByUrl("/product-details");
  }
  servicedata: any;
  productList: any = [];

  getProductList() {
    this.commonservice.setHeaders();

    this.servicedata = {
      query: {
        merchant_id: this.merchant_id,
        subcategory_id: this.subcatId,
        // city:this.city
      },
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("product/getallproduct", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let Subdata: any = res;
          this.productList = Subdata.response;
          console.log(this.productList);
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  editproduct(data) {
    localStorage.setItem("editproduct", JSON.stringify(data));
    this.router.navigateByUrl("/product-details");
  }

  async removeProduct(id) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Remove Product",
      message: "Do you want to delete this product ?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Cancel called");
          },
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Confirm Okay");

            this.commonservice.setHeaders();

            this.servicedata = {
              product_id: id,
            };

            this.commonservice.waitloadershow();

            this.commonservice
              .serverdatapost("product/removeproduct", this.servicedata)
              .subscribe(
                (res) => {
                  this.commonservice.waitloaderhide();
                  let data: any = res;
                  if (data.status) {
                    this.commonservice.toastalert(data.message);
                    this.getProductList();
                  } else this.commonservice.toastalert(data.message);
                },

                (error) => {
                  console.log(error);
                  this.commonservice.waitloaderhide();
                  this.commonservice.toastalert("Something went wrong!");
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }
}
