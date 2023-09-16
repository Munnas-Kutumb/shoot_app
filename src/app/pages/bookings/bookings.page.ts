import { compileNgModule } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController, NavController, ToastController } from "@ionic/angular";

import { CommonService } from "src/service/commonservice";


@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"],
})
export class BookingsPage implements OnInit {
  view: any;
  value: any;
  booking_status: any;
  set_status: any = "";

  merchant_id: any = "";

  servicedata: any = {};
  booking_list: any;
  customer_details: any = [];
  // booking_details: any = [];

  imgurl: any;
  itemcount:any=0;

  constructor(
    private router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private commonservice: CommonService,
    private navController:NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.imgurl = this.commonservice.serviceurl;
    this.merchant_id = localStorage.getItem("merchant_id");
    console.log(this.merchant_id);
    if(localStorage.getItem('goback')){
      this.value=localStorage.getItem('goback');
      this.view=localStorage.getItem('goback')
      this.booking_status=localStorage.getItem('goback')
      localStorage.removeItem('goback');
      this.getBookings();

    }
    else {
      this.value = "pending";
      this.view = "pending";
      this.booking_status = "pending";
      this.getBookings(); 
    }
    this.navController.navigateRoot(['/tab/tabs/booking']);
    console.log(this.view, this.value, this.booking_status)
  }

  toPage(val1, val2, val3) {
    console.log(val1, val2, val3);
    localStorage.setItem("booking_number", val1);
    localStorage.setItem("bookingDetailStatus", val2);
    localStorage.setItem("bookinginfo_id", val3);
    localStorage.setItem('goback',this.booking_status)

    // this.router.navigateByUrl("/booking-info");
    this.navController.navigateRoot(['/booking-info']);

  }

  segmentChanged($event) {
    this.view = this.value;
    console.log(this.view);
    
    
    this.booking_status = this.value;
    this.getBookings();
  }

  async acceptBtn() {
    const toast = await this.toastController.create({
      message: "Booking Accepted Succesfully.",
      color: "success",
      duration: 1000,
      cssClass: "toastSucess",
    });
    toast.present();
  }

  async rejectBtn() {
    const toast = await this.toastController.create({
      message: "Booking Rejected Succesfully.",
      color: "danger",
      duration: 1000,
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Please wait...",
      duration: 1000,
    });
    await loading.present();
    this.acceptBtn();
  }

  async getBookings() {

    this.commonservice.setHeaders();

    this.servicedata = {
      merchant_id: this.merchant_id,
      booking_status: this.booking_status,

      
    };
    console.log(this.booking_status);

    // this.commonservice.waitloadershow();

    await this.commonservice.serverdatapost("booking/getAllBookingByMerchantId", this.servicedata).subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if(data.status){
            this.booking_list = data.response.reverse();
            console.log(this.booking_list);
           
            if(this.booking_status == 'accepted'){

              this.servicedata.booking_status = 'ongoing';
            
              this.commonservice.serverdatapost("booking/getAllBookingByMerchantId", this.servicedata).subscribe(
                (res) => {
                  this.commonservice.waitloaderhide();
                  let data: any = res;
                  console.log(data);
                  if(data.status){
      
                    var ongoing = data.response.reverse();
                    console.log(ongoing);
                    
                    ongoing.map( e => {
                      this.booking_list = [...this.booking_list, e];
                    })
                    
                    console.log(this.booking_list);
                  
                  }
                  
                },
      
                (error) => {
                  console.log(error);
                  this.commonservice.waitloaderhide();
                  this.commonservice.toastalert("Something went wrong!");
                }
              );
            }
          }
          
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );

  }
  
}
