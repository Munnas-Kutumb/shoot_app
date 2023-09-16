import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: "app-user-live-event",
  templateUrl: "./user-live-event.page.html",
  styleUrls: ["./user-live-event.page.scss"],
})
export class UserLiveEventPage implements OnInit {
  user: any;
  user_id: any;
  servicedata: any = {};
  ongoingBooking: any = [];
  data: any = [];
  instant_photographer: any = [];
  sample: any;
  city: any;
  location: any = [];
  nearby: any = [];
  live: any = []

  constructor(private common: CommonService, private router: Router, private geolocation: Geolocation) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user;
    this.sample = JSON.parse(localStorage.getItem('choosed_location'))
    this.city = this.sample._id;
    console.log(this.city);
    //this.ongoingBookings();

    // this.getPhotographer();
    this.exploreMerchant()

    //geolocation
    // this.geolocation.getCurrentPosition().then((resp) => {

    //   console.log(resp);
    //   this.location = [resp.coords.latitude, resp.coords.longitude]
    //   console.log(this.location)
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
    JSON.parse(localStorage.getItem('geolocation'));
    this.getNearbyMercahnt()
    this.getLiveEvent()


    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    //   console.log(data);



    // });
  }

  ngOnInit() { }

  toServiceDetails() { }

  // ongoingBookings() {
  //   this.servicedata = {
  //     query: {
  //       booking_status: "ongoing",
  //     },
  //   };

  //   this.common
  //     .serverdatapost("booking/getBooking", this.servicedata)
  //     .subscribe(
  //       (res) => {
  //         console.log(res);
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  // }

  // photographers: any = [];
  // getPhotographer() {
  //   this.common.setHeaders();
  //   this.servicedata = {
  //     query: { instant_available: true },
  //   };

  //   this.common.serverdatapost("merchant/getAllMerchantByQuery", this.servicedata).subscribe(
  //       (res) => {
  //         var data;
  //         data = res;
  //         this.photographers = data.response;
  //         console.log(this.photographers);
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  // }

  exploreMerchant() {
    // let query:any={instant_available:true}
    this.common.setHeaders();
    this.servicedata = {
      city: this.city,
      // location: this.location

    }
    // this.servicedata={'query':query}
    this.common.serverdatapost('merchant/getExploreMerchant', this.servicedata).subscribe(
      (res) => {
        this.data = res;
        this.instant_photographer = this.data.response.instant;
        console.log(this.instant_photographer);
      },
      err => {
        console.log(err);
      }
    );
  }

  tomProfile(id) {
    localStorage.setItem("merchantid", id);
    localStorage.setItem('backto', 'explore');
    this.router.navigateByUrl("/use-merchant-profile");
  }

  getNearbyMercahnt() {
    this.servicedata = {
      city: this.city,
      // location: this.location
      location: JSON.parse(localStorage.getItem('geolocation'))


    }

    this.common.serverdatapost('merchant/getNearbyMerchant', this.servicedata).subscribe(
      res => {
        this.data = res;
        this.nearby = this.data.response

        console.log(this.nearby)
      },
      err => {
        console.log(err)
      }
    );
  }

  getLiveEvent() {
    this.servicedata = {
      // location: this.location,
      location: JSON.parse(localStorage.getItem('geolocation')),
      booking_status: 'ongoing',
      city: this.city

    }

    this.common.serverdatapost('booking/getLiveEvent', this.servicedata).subscribe(
      res => {
        this.data = res;
        this.live = this.data.response

        console.log(this.live)
      },
      err => {
        console.log(err)
      }
    );
  }

}
