import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CommonService } from "src/service/commonservice";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-service-request",
  templateUrl: "./service-request.page.html",
  styleUrls: ["./service-request.page.scss"],
})
export class ServiceRequestPage implements OnInit {
  servicedata: any = {};
  city: any;

  view: any = "";
  valued: any = "0";
  primeServices: any = [];
  cat_id: any = "";
  subCat_id: any = "";
  serviceType: any = 0;
  primeId: any = "";

  prime_cat_name: any = "";
  softcopy: any;
  numberOfPhotos: any = "";
  hoursPerDay: any = "";
  price: any = "";
  discount: any;
  merchant_id: any = "";
  service_details: any = "";
  isSelectedService: any = "";
  activeServiceDetails: any = "";

  service_data: any = "";

  arrowShow: any = "";
  catName: any;
  subCatName: any;
  duration: any;

  hoursPerDayHH: any = "00";
  hoursPerDayMM: any = "00";

  durationHH: any = "00";
  durationMM: any = "00";
  durationSS: any = "00";

  constructor(
    private router: Router,
    private commonservice: CommonService,
    public alertController: AlertController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    this.valued = "0";
    this.discount = 0;
    this.cat_id = localStorage.getItem("mainCategoryId");
    this.subCat_id = localStorage.getItem("mainSubCategoryId");
    console.log(this.cat_id, this.subCat_id);
    this.serviceRequest();

    this.catName = localStorage.getItem("cName");
    this.subCatName = localStorage.getItem("subcatName");
    this.city= JSON.parse(localStorage.getItem('merchant')).city?.name;
  }

  backBtn() {
    if (localStorage.getItem("back")) {
      this.router.navigateByUrl("/tab/tabs/services");
    } else {
      this.router.navigateByUrl("/merchent-services-list");
    }
  }

  addOpt(val, val2) {
    this.primeId = val;
    this.getService();

    if (this.view == "") {
      this.view = val;
      this.prime_cat_name = val2;
      console.log(val, val2);
    } else if ((this.view = val)) {
      this.view = "";
      console.log("Close");
    }
  }

  selectSection($event) {
    console.log(this.valued);
    this.serviceType = parseInt(this.valued);
    this.serviceRequest();
  }

  checkSoftCopy($event) {
    console.log(this.softcopy);
  }

  serviceRequest() {
    this.servicedata = {
      query: {
        service_category_id: this.cat_id,
        service_subcategory_id: this.subCat_id,
        service_type: this.serviceType,
      },
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost(
        "service_primecategory/getServicePrimeCategory",
        this.servicedata
      )
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let Subdata: any = res;
          this.primeServices = Subdata.response;
          console.log(this.primeServices);
          if (this.primeServices.length == 0 && this.valued == "0") {
            this.commonservice.toastalert("No photography service available");
          }

          if (this.primeServices.length == 0 && this.valued == "1") {
            this.commonservice.toastalert("No videography service available");
          }

          this.getAllService();

          // this.valued = "1";
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  addService() {
    this.servicedata = {
      merchant_id: this.merchant_id,
      service_category_id: this.cat_id,
      service_subcategory_id: this.subCat_id,
      service_primecategory_id: this.primeId,
      service_type: this.valued,
      number_of_photo: this.numberOfPhotos,
      hours: this.hoursPerDayHH + ":" + this.hoursPerDayMM,
      softcopy: this.softcopy,
      rate: this.price,
      duration: this.durationHH + ":" + this.durationMM + ":" + this.durationSS,
      discount: parseInt(this.discount),
      color_code: localStorage.colorCode,
      city: JSON.parse(localStorage.getItem('merchant')).city?.name
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("service/addService", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);

          if (data.status == true) {
            this.editPrimeform = false;
            this.commonservice.toastalert(data.message);
            this.serviceRequest();
          } else {
            this.commonservice.toastalert(data.message);
          }
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  forUpdateServiceId: any;
  updatePrimeService() {
    this.servicedata = {
      service_id: this.forUpdateServiceId,
      merchant_id: this.merchant_id,
      service_category_id: this.cat_id,
      service_subcategory_id: this.subCat_id,
      service_primecategory_id: this.primeId,
      primecategory_name: this.prime_cat_name,
      service_type: this.valued,
      number_of_photo: this.numberOfPhotos,
      hours: this.hoursPerDayHH + ":" + this.hoursPerDayMM,
      softcopy: this.softcopy,
      rate: this.price,
      city: this.city,
      duration: this.durationHH + ":" + this.durationMM + ":" + this.durationSS,
      discount: parseInt(this.discount),
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("service/updateServicePrimecategory", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);

          if (data.status == true) {
            this.commonservice.toastalert(data.message);
          }
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  //geting Service Details
  editPrimeform: boolean = true;
  getService() {
    this.numberOfPhotos = "";
    this.hoursPerDay = "";
    this.softcopy = false;
    this.price = "";
    this.discount = 0;

    this.hoursPerDayHH = "00";
    this.hoursPerDayMM = "00";
    this.durationHH = "00";
    this.durationMM = "00";
    this.durationSS = "00";

    console.log(this.primeId);
    this.commonservice.setHeaders();
    this.servicedata = {
      query: {
        merchant_id: this.merchant_id,
        service_primecategory_id: this.primeId,
      },
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("service/getService", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          this.service_details = data.response[0];
          console.log(this.service_details);

          if (data.response.length > 0) {
            this.editPrimeform = false;
            this.forUpdateServiceId = this.service_details._id;
            this.numberOfPhotos = this.service_details.number_of_photo;
            this.hoursPerDay = this.service_details.hours;
            this.softcopy = this.service_details.softcopy;
            this.price = this.service_details.rate;
            this.discount = this.service_details.discount;
            // this.city = this.service_details.city;
            var hpd = this.hoursPerDay.split(":");
            this.hoursPerDayHH = hpd[0];
            this.hoursPerDayMM = hpd[1];
            this.duration = this.service_details.duration;
            var du = this.duration.split(":");
            this.durationHH = du[0];
            this.durationMM = du[1];
            this.durationSS = du[2];
          } else {
            this.editPrimeform = true;
          }
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  services: any;

  getAllService() {
    this.servicedata = {
      query: {
        merchant_id: this.merchant_id,
        service_subcategory_id: this.subCat_id,
      },
    };

    this.commonservice
      .serverdatapost("service/getService", this.servicedata)
      .subscribe(
        (res) => {
          let data: any = res;
          this.services = data.response;
          console.log(this.services);

          this.primeServices.forEach((e) => {
            for (let i = 0; i < this.services.length; i++) {
              if (e._id == this.services[i].service_primecategory_id) {
                e.chkStatus = this.services[i].status;
                e.service_id = this.services[i]._id;
              }
            }
          });
        },
        (err) => {
          console.log(err);
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  updateStatus(id, val) {
    console.log(val);

    this.servicedata = {
      service_id: id,
      status: !val,
    };

    this.commonservice
      .serverdatapost("service/updateStatus", this.servicedata)
      .subscribe(
        (res) => {
          console.log(res);
          this.serviceRequest();
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
