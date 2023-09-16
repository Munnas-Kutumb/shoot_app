import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  NavController,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import { MerchentServiceInfoComponent } from "src/app/merchent-service-info/merchent-service-info.component";
import { CommonService } from "src/service/commonservice";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

@Component({
  selector: "app-use-merchant-profile",
  templateUrl: "./use-merchant-profile.page.html",
  styleUrls: ["./use-merchant-profile.page.scss"],
})
export class UseMerchantProfilePage implements OnInit {
  view: any = "";
  expandphoto: any = "";
  expandvideo: any = "";
  arrowViewphoto: any = "up";
  arrowViewvideo: any = "up";
  expandid: any = "";
  viewnum: any = 1;

  servicedata: any;
  merchantdetails: any;
  merchantservices: any;
  merchantid: any;
  baseUrl: any = "";
  referral_code: any;
  like: any = false;
  bookingDate: any;
  bookingTime: any;
  user_id: any = '';
  profiledata: any = [];

  constructor(
    private router: Router,
    public popoverController: PopoverController,
    public toastController: ToastController,
    private common: CommonService,
    private navController: NavController,
    private socialSharing: SocialSharing
  ) { }

  ionViewWillEnter() {
    this.baseUrl = this.common.serviceurl;
    this.merchantid = localStorage.merchantid;
    this.getMerchantDetails(this.merchantid);
    this.getMerchantServices(this.merchantid);

    let user_details = JSON.parse(localStorage.getItem("user_details"));
    this.user_id = user_details._id;
    console.log(this.user_id);
    this.getUserProfile();


    this.referral_code = user_details.referral_code;
    // this.getPortfolioById();

    if (localStorage.bookingDate) this.bookingDate = localStorage.bookingDate;
    if (localStorage.bookingTime) this.bookingTime = localStorage.getItem('bookingTime')
  }

  ngOnInit() { }

  expandFrame: any = "up";

  expandView(ew, id) {
    if (this.expandid == id) {
      this.expandid = "";
      return;
    } else {
      this.expandid = id;
      this.expandphoto = ''
      this.arrowViewphoto = "up";

    }

    // if ((this.expandid = "")) {
    //   this.expandid = ew;
    //   this.expandid = id;
    //   this.expandFrame = "down";
    //   return;
    // }
  }

  // viewMore(valView) {
  //   if (this.expandphoto == "") {
  //     this.expandphoto = valView;
  //     this.arrowViewphoto = "down";
  //     return;
  //   } else {
  //     this.expandphoto = "";
  //     this.arrowViewphoto = "up";
  //   }
  // }

  // viewMore1(valView) {
  //   if (this.expandvideo == "") {
  //     this.expandvideo = valView;
  //     this.arrowViewvideo = "down";
  //     return;
  //   } else {
  //     this.expandvideo = "";
  //     this.arrowViewvideo = "up";
  //   }
  // }

  // addToFav() {
  //   if (this.like) this.like = false;
  //   else this.like = true;
  // }

  share() {
    var msg =
      "Join me on SHOOT, the best app for photography, videography, gifts and arts." +
      " Enter my code " +
      this.referral_code +
      " to get discount on your first shoot! " +
      "https://play.google.com/store/apps/details?id=com.appshoot.www";

    // "Checkout Shoot App, I found it best for photography. Download : " +
    // "https://play.google.com/store/apps/details?id=com.shootapp.www" +
    // " Use my referral code - " +
    // this.ref_code;
    console.log(msg);
    this.socialSharing.share(msg, null, null, null);
  }

  backBtn() {
    // localStorage.setItem("merchantid", "");
    // localStorage.setItem("merchantDetails", "");

    if (localStorage.backto == 'search') {
      localStorage.removeItem('backto');
      localStorage.removeItem('bookingTime');
      localStorage.removeItem('bookingDate');
      localStorage.removeItem('bookingAddress');
      this.navController.navigateRoot(["/user-search-photographer"]);

    }
    else if (localStorage.backto == 'home') {
      localStorage.removeItem('backto');
      localStorage.removeItem('bookingTime');
      localStorage.removeItem('bookingDate');
      localStorage.removeItem('bookingAddress');
      this.navController.navigateRoot(["/tabs/user-tabs/user-home-page"]);
    }
    else if (localStorage.backto == 'explore') {
      localStorage.removeItem('backto');
      localStorage.removeItem('bookingTime');
      localStorage.removeItem('bookingDate');
      localStorage.removeItem('bookingAddress');
      this.navController.navigateRoot(["tabs/user-tabs/user-live-event"]);

    }
    // else if(localStorage.bookingTime){
    //   localStorage.removeItem('bookingTime');
    // }
    // else if(localStorage.bookingDate){
    //   localStorage.removeItem('bookingDate');
    // }
    else {
      localStorage.removeItem('bookingTime');
      localStorage.removeItem('bookingDate');
      localStorage.removeItem('bookingAddress');

      this.navController.navigateRoot(["/user-service-detail"]);
    }
  }

  choose: any = false;
  showType: any = 0;

  chooseType() {
    console.log(this.choose);
    if (this.choose) this.showType = 1;
    else this.showType = 0;
  }

  // popover for more Info
  async presentPopover(photo, softcopy, hours) {
    console.log(photo + " " + softcopy + " " + hours);
    const popover = await this.popoverController.create({
      component: MerchentServiceInfoComponent,
      componentProps: { photos: photo, softcopy: softcopy, hours: hours },
      cssClass: "my-custom-class",
      translucent: true,
    });
    return await popover.present();
  }

  async closePopOver() {
    await this.popoverController.dismiss();
  }

  toDateTime() {
    this.router.navigateByUrl("/select-appoint-dt");
  }

  getMerchantDetails(id) {
    this.servicedata = {
      merchant_id: id,
    };

    this.common
      .serverdatapost("merchant/getMerchantById", this.servicedata)
      .subscribe(
        (res) => {
          var data: any = res;
          this.merchantdetails = data.response;
          localStorage.setItem(
            "merchantDetails",
            JSON.stringify(this.merchantdetails)
          );
          console.log(this.merchantdetails);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getMerchantServices(id) {
    this.servicedata = {
      merchant_id: id,
    };

    this.common
      .serverdatapost("service/getServiceByMerchantId", this.servicedata)
      .subscribe(
        (res) => {
          var data;
          data = res;
          this.merchantservices = data.response;
          console.log(this.merchantservices);
          this.merchantservices.map(e => e.selected = false)

          if (localStorage.cart_items && localStorage.cart_items.length > 0) {

            if (localStorage.cart_merchantid == this.merchantid) {
              this.cart_items = JSON.parse(localStorage.cart_items);
              this.cart_count = localStorage.cart_count;

              this.merchantservices.map(e => {
                this.cart_items.map(item => {
                  if (item._id == e._id)
                    e.selected = true;
                })
              });
            }
          }

        },
        (err) => {
          console.log(err);
        }
      );
  }

  // album: any = [];
  // portfolio_album: any = [];
  // getPortfolioById() {
  //   this.servicedata = {
  //     query: {
  //       merchant_id: this.merchantid,
  //     },
  //   };

  //   this.common
  //     .serverdatapost("merchant/getPortfolioByQuery", this.servicedata)
  //     .subscribe((res) => {
  //       let data: any = res;
  //       console.log(data);

  //       this.portfolio_album = data.response;
  //       this.portfolio_album.forEach((it) => {
  //         // console.log(it.album);
  //         this.album = it.album;
  //       });
  //     });
  // }



  //navigating to gallery page


  navigate() {
    this.router.navigate(["/gallery"]);
  }



  // cart section - add/remove items from cart


  cart_count: any = 0;
  cart_items: any = [];
  allSubCategories: any = [];
  added: boolean = true;

  toCart() {
    console.log("check out clicked");
    if (this.profiledata.new_user == true) {
      console.log("checking condition for the skip");
      alert("Please go the edit profile page and fill all the details respectively.");
    }
    if (this.profiledata.first_name == '' && this.profiledata.last_name == '' && this.profiledata.email == '') {
      console.log("checking condition for the continue");
      alert("Please go the edit profile page and fill all the details respectively.");
      return;
    }
    if (!localStorage.bookingDate) {
      alert('Please select booking date and venue details');
      return;
    }
    localStorage.setItem("byCheckout", "cartpage");
    this.router.navigateByUrl("/user-cart");
  }


  async addedSc(item) {
    console.log(item);
    if ((localStorage.cart_product && localStorage.cart_product.length > 0)) {
      alert('You already have product in your cart please confirm for the booking and then add service')
      return;
    }

    if (!localStorage.cart_items || JSON.parse(localStorage.getItem('cart_items')).length == 0) localStorage.setItem('cart_merchantid', this.merchantid);

    if (localStorage.cart_merchantid && localStorage.cart_merchantid == item.merchant_id) {

      var i = this.merchantservices.find(e => e._id == item._id);
      i.selected = true;

      this.cart_items.push(item);

      this.cart_count++;
      console.log(this.cart_items);

      localStorage.setItem('cart_items', JSON.stringify(this.cart_items))
      localStorage.setItem('cart_count', JSON.stringify(this.cart_count))
    }
    else if (localStorage.cart_items && localStorage.cart_items.length > 0) {

      alert('You can choose service from same photographer only.');
    }


  }


  removeSc(item) {
    var i = this.merchantservices.find(e => e._id == item._id);
    i.selected = false;

    var index = this.cart_items.findIndex(e => e._id == item._id);
    this.cart_items.splice(index, 1);

    this.cart_count--;

    console.log(this.cart_items);
    console.log(this.cart_count);

    localStorage.setItem('cart_items', JSON.stringify(this.cart_items))
    localStorage.setItem('cart_count', JSON.stringify(this.cart_count))

    if (this.cart_count == 0) localStorage.removeItem('cart_merchantid');
  }


  //get user profile
  getUserProfile() {
    this.servicedata = {
      user_id: this.user_id,
    };

    this.common.serverdatapost("user/getUserById", this.servicedata).subscribe(
      (res) => {
        var data;
        data = res;
        this.profiledata = data.response;
        console.log(this.profiledata);

      },
      (err) => {
        console.log(err);
      }
    );
  }

}
