import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { IonSlides } from "@ionic/angular";
declare var google;

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.page.html",
  styleUrls: ["./home-page.page.scss"],
})
export class HomePagePage implements OnInit {
  servicedata: any;
  categories: any = [];
  baseUrl: any;
  address: any = "";
  isopen: boolean = false;
  choosed_loc: any;
  name: any;

  himageArr: any = [];
  fimageArr: any = [];

  imageBk: any = 0;
  selected_loc: any;
  city: any;
  location: any = []
  constructor(
    private router: Router,
    private common: CommonService,
    private geolocation: Geolocation,
    private zone: NgZone
  ) { }

  @ViewChild('mySlider') slides: IonSlides;

  ngOnInit() { }
  // navprolist(cat){
  //   console.log(cat);
  //   console.log('im in')
  //   this.name=cat;
  //   console.log(this.name);
  //   localStorage.setItem('category',this.name);
  //   this.router.navigate(["/user-product-list"]);
  // }

  navigate() {
    localStorage.removeItem("pro_list");
    this.router.navigate(["/user-search-photographer"]);
  }

  mprofile(_id) {
    console.log(_id);
    localStorage.setItem("merchantid", _id);
    localStorage.setItem('backto', 'home');
    this.router.navigate(['/use-merchant-profile']);
  }

  goToProduct(id, category) {
    localStorage.setItem('category', category);
    localStorage.setItem("pro_list", "pro_list_page");

    localStorage.setItem("product_cat_id", id);
    this.router.navigate(["/user-product-list"]);
  }

  ionViewWillEnter() {
    this.baseUrl = this.common.serviceurl;




    this.getCities();
    // this.city= JSON.parse(localStorage.getItem('choosed_location')).name;
    this.getProductsCategory();
    this.getAllCategories();
    this.getBanner();
    // this.getInstatPhotographer();
  }

  afterslidesLoad(slides) {
    slides.startAutoplay();
  }

  toServiceDetails(item) {
    console.log(item);
    if (item.category_name == "All Moments") {
      localStorage.setItem("categoryid", item.category_name);
    } else {
      localStorage.setItem("categoryid", item._id);
    }
    this.router.navigateByUrl("/user-service-list");
  }

  getAllCategories() {
    this.common
      .serverdatapost("service_category/getServiceCategory", "")
      .subscribe(
        (res) => {
          var data;
          data = res;
          this.categories = data.response.reverse();
          console.log(this.categories);
          this.getUserDetails();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getUserDetails() {
    this.servicedata = {
      user_id: localStorage.user_id,
    };
    this.common.serverdatapost("user/getUserById", this.servicedata).subscribe(
      (res) => {
        let data: any = res;
        localStorage.setItem("user_details", JSON.stringify(data.response));
      },
      (err) => {
        console.log(err);
      }
    );
  }

  navcategory() {
    this.router.navigate(["/category-name"]);
  }

  close() {
    this.isopen = !this.isopen;
  }

  cities: any = [];
  getCities() {
    this.servicedata = {
      query: {},
    };
    this.common.serverdatapost("city/getCity", this.servicedata).subscribe(
      (res) => {
        var data;
        data = res;
        this.cities = data.response;

        this.cities.map(e => {
          e.selected = false;
        });

        if (localStorage.choosed_location) {

          this.choosed_loc = JSON.parse(localStorage.getItem('choosed_location'))

          this.selected_loc = this.choosed_loc.name;

          var c = this.cities.find(e => e._id == this.choosed_loc._id);
          c.selected = true;
        }
        else {
          this.selected_loc = this.cities.at(-1).name;
          this.cities.at(-1).selected = true;
          localStorage.setItem('choosed_location', JSON.stringify(this.cities.at(-1)));
          JSON.parse(localStorage.getItem('geolocation'));
        }
        this.getInstatPhotographer();

        console.log(this.cities);
      },
      (err) => {
        console.log(err);
      }
    );
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

  photographers: any = [];
  getInstatPhotographer() {
    this.common.setHeaders();
    this.servicedata = {
      query: {
        instant_available: true,
        city: JSON.parse(localStorage.getItem('choosed_location'))._id
      },
    };

    this.common
      .serverdatapost("merchant/getAllMerchantByQuery", this.servicedata)
      .subscribe(
        (res) => {
          var data;
          data = res;
          this.photographers = data.response;
          console.log(this.photographers);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  loc_status: boolean;

  setLocation(loc) {
    console.log(loc);

    this.cities.map(e => {
      e.selected = false;
    });

    this.selected_loc = loc.name;

    var c = this.cities.find(e => e._id == loc._id);
    c.selected = true;

    localStorage.setItem('choosed_location', JSON.stringify(loc));
    this.getInstatPhotographer();

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp);
      this.location = [resp.coords.latitude, resp.coords.longitude]
      console.log(this.location)
      localStorage.setItem('geolocation', JSON.stringify(this.location));




    }).catch((error) => {
      console.log('Error getting location', error);
    });


    this.close();

    // this.loc_status = true;
  }

  getBanner() {

    this.servicedata = {
      query: {
        banner_status: true
      }
    }

    this.common.serverdatapost('banner/getbanner', this.servicedata).subscribe(
      (res) => {
        console.log(res);
        var data;
        data = res;

        data.response.map(e => {
          if (e.type == 0) this.himageArr.push(e);
          else this.fimageArr.push(e);
        })

        if (this.himageArr.length) {
          // image toggle
          let i = 0;
          setInterval(() => {
            if (i == this.himageArr.length) i = 0;
            // console.log(this.imageArr[i]);
            this.imageBk = i;
            i++;
          }, 9000);
        }
        console.log(this.himageArr);
        console.log(this.fimageArr);

      },
      (err) => {
        console.log(err);
      }
    )
  }
  explorepage() {
    console.log('im in');
    this.router.navigate(["/tabs/user-tabs/user-live-event"]);
  }

}
