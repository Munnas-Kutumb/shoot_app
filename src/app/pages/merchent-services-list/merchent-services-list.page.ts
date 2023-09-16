import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { ToastController, IonContent } from "@ionic/angular";

@Component({
  selector: "app-merchent-services-list",
  templateUrl: "./merchent-services-list.page.html",
  styleUrls: ["./merchent-services-list.page.scss"],
})
export class MerchentServicesListPage implements OnInit {
  servicedata: any = {};
  merchant_details: any;
  serviceList: any = [];
  merchant_id: any = "";
  service_name: any = "";
  selected_id: any = "";
  makeServiceFavorite: any = false;
  favSelected: any = "";
  baseUrl: any = "";
  servicelistShow: boolean;
  setView: any = "service";

  @ViewChild("content", { static: false }) content: IonContent;

  constructor(
    private router: Router,
    private commonservice: CommonService,
    public toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    this.baseUrl = this.commonservice.serviceurl;
    // this.getServiceList();
    this.setView = "service";
    this.getPortfolioCategory();
    // this.getProductList();
    //this.getSubCategory();
  }

  ngOnInit() {}

  segmentChanged(event) {
    this.setView = event.target.value;
    console.log(this.setView);
    if (this.setView == "service") this.getPortfolioCategory();
    if (this.setView == "product") this.getProductList();
  }

  backBtn() {
    this.router.navigateByUrl("/tab/tabs/home-page");
    this.scrollToBottomOnInit();
  }

  starClicked(val, favstatus) {
    console.log("Selected");
    this.selected_id = val;
    console.log(this.selected_id);
    this.makeServiceFavorite = favstatus;
    //this.makeServiceFavorite = true;
    this.makeFavorite();
  }

  scrollToBottomOnInit() {
    this.content.scrollToTop(0);
  }

  makeFavorite() {
    this.servicedata = {
      merchant_id: this.merchant_id,
      service_id: this.selected_id,
      favourite_service: this.makeServiceFavorite,
    };

    // this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("service/favouriteService", this.servicedata)
      .subscribe(
        (res) => {
          // this.commonservice.waitloaderhide();
          let subdata: any = res;
          this.favSelected = subdata;
          console.info(this.favSelected);
          // this.getServiceList();
          this.getPortfolioCategory();
          this.commonservice.toastalert(subdata.message);
        },

        (error) => {
          console.log(error);
          // this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  // getServiceList() {
  //   this.servicedata = {
  //     merchant_id: this.merchant_id,
  //   };

  //   this.commonservice.waitloadershow();
  //   this.commonservice
  //     .serverdatapost("service/getServiceByMerchantId", this.servicedata)
  //     .subscribe(
  //       (res) => {
  //         this.commonservice.waitloaderhide();
  //         let subdata: any = res;
  //         this.serviceList = subdata.response;
  //         console.log(this.serviceList.length);

  //         if (this.serviceList.length == 0) this.servicelistShow = true;
  //       },

  //       (error) => {
  //         console.log(error);
  //         this.commonservice.waitloaderhide();
  //         this.commonservice.toastalert("Something went wrong!");
  //       }
  //     );
  // }

  serviceInfo(info) {
    localStorage.setItem("service_id", info.service_id);
    localStorage.setItem(
      "mainCategoryId",
      info.service_subcategory[0].service_category_id
    );
    localStorage.setItem("mainSubCategoryId", info.service_subcategory[0]._id);
    localStorage.setItem("cName", info.service_subcategory[0].subcategory_name);
    localStorage.setItem(
      "subcatName",
      info.service_subcategory[0].subcategory_name
    );

    localStorage.removeItem("back");
    this.router.navigateByUrl("/service-request");
  }

  //Get service list provided by Merchant **
  getPortfolioCategory() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };
    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/getPortfolioCategory", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          if (data.status) {
            this.serviceList = data.response;
            console.log(this.serviceList);
          } else {
            console.log(data);
          }
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  productList: any = [];

  getProductList() {
    this.commonservice.setHeaders();

    this.servicedata = {
      query: {
        merchant_id: this.merchant_id,
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
  service_category_id: any;

  editproduct(data) {
    console.log(data);
    this.service_category_id = data.category_id;
    console.log(this.service_category_id);
    localStorage.setItem("traceback", "selected-services");
    localStorage.setItem("editproduct", JSON.stringify(data));
    // localStorage.setItem("editproduct", JSON.stringify(data));
    this.getSubCategory();

    this.router.navigateByUrl("/product-details");
  }

  categorySubList: any = [];
  sub_name: any;

  getSubCategory() {
    this.servicedata = {
      service_category_id: this.service_category_id,
    };

    this.commonservice
      .serverdatapost(
        "service_subcategory/getServiceSubCategory",
        this.servicedata
      )
      .subscribe((res) => {
        let Subdata: any = res;
        console.log(Subdata.response);
        this.categorySubList = Subdata.response;

        for (let i = 0; i <= this.categorySubList.length; i++) {
          if (
            this.categorySubList[i].service_category_id ==
            this.service_category_id
          ) {
            console.log(i);
            this.sub_name = this.categorySubList[i].subcategory_name;
          }
          localStorage.setItem("prosub_name", this.sub_name);
        }
      });
  }
}
