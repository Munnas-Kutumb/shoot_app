import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonService } from "src/service/commonservice";
import { AlertController } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";
declare var google;

@Component({
  selector: "app-business-details",
  templateUrl: "./business-details.page.html",
  styleUrls: ["./business-details.page.scss"],
})
export class BusinessDetailsPage implements OnInit {
  servicedata: any = {};
  sel_value: any = "";

  gstnumber: any = "";
  discription: any = "";

  merchant_id: any = "";

  location: any = [];
  city: any;

  // map
  workingarea: any = {
    address: "",
    lat: "",
    lng: "",
  };

  pickuplocation: any = "";
  sourcemarker: any = "";
  map: any;
  geoLatitude: any;
  geoLongitude: any;

  sourcecirle: any = "";

  work_radius: any = 5000;
  merchant_details:any = {};

  constructor(
    private router: Router,
    private commonservice: CommonService,
    public alertController: AlertController,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getAllCities();

    this.merchant_id = localStorage.getItem("merchant_id");
    this.commonservice.setHeaders();
    this.getProfile();
    this.loadMap();

    this.merchant_details = JSON.parse(localStorage.getItem("merchant"));

  }

  ngAfterViewInit() {
    this.loadMapforaddress();
  }

  loadMapforaddress() {
    let mapOptions = {
      componentRestrictions: { country: "IN" },
    };

    let componentForm = {
      administrative_area_level_2: "long_name",
      administrative_area_level_1: "short_name",
    };

    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("pic_location"),
      mapOptions
    );
    google.maps.event.addListener(autocomplete, "place_changed", () => {
      let place = autocomplete.getPlace();
      this.workingarea.lat = place.geometry.location.lat();
      this.workingarea.lng = place.geometry.location.lng();
      this.workingarea.address = place.formatted_address;
      this.location = [this.workingarea.lat, this.workingarea.lng];
      console.log(this.workingarea.address);

      this.addsourceMarker2(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    });
  }

  loadMap() {
    console.log(this.work_radius);
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      let latLng = new google.maps.LatLng(this.geoLatitude, this.geoLongitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
      };

      this.map = new google.maps.Map(
        document.getElementById("map_canvas"),
        mapOptions
      );
      this.addsourceMarker();
      this.dragmap();
    });
  }

  dragmap() {
    google.maps.event.addListener(this.map, "drag", () => {
      this.sourcemarker.setPosition(this.map.getCenter());
    });

    google.maps.event.addListener(this.map, "dragend", () => {
      let componentForm = {
        administrative_area_level_2: "long_name",
        administrative_area_level_1: "short_name",
      };

      let geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: {
            lat: this.map.getCenter().lat(),
            lng: this.map.getCenter().lng(),
          },
        },
        (result, status) => {
          let lat: any = this.map.getCenter().lat();
          let lng: any = this.map.getCenter().lng();

          console.log(lat, lng);
          this.location = [lat, lng];
          this.workingarea.address = result[0].formatted_address;
          this.workingarea.lat = lat;
          this.workingarea.lng = lng;

          console.log(result);
          // localStorage.setItem("picaddress", result[0].formatted_address);
          // this.workingarea.address = localStorage.getItem("picaddress");
        }
      );
    });
  }

  addsourceMarker() {
    this.sourcemarker = new google.maps.Marker({
      map: this.map,
      icon: "assets/img/marker.png",
      animation: google.maps.Animation.DROP,
      position: {
        lat: parseFloat(this.geoLatitude),
        lng: parseFloat(this.geoLongitude),
      },
    });

    this.map.setZoom(11);

    if (this.sourcecirle) this.sourcecirle.setMap(null);

    // Add circle overlay and bind to marker
    this.sourcecirle = new google.maps.Circle({
      map: this.map,
      radius: this.work_radius, // 5km in meters
      fillColor: "#0D83EE",
      strokeColor: "#0D83EE",
      strokeOpacity: 0.8,
      strokeWeight: 0.8,
    });

    this.sourcecirle.bindTo("center", this.sourcemarker, "position");
  }

  addsourceMarker2(piclat, piclng) {
    console.log(piclat, piclng);
    if (this.sourcemarker && this.sourcemarker.setMap) {
      this.sourcemarker.setMap(null);
    }
    this.sourcemarker = new google.maps.Marker({
      map: this.map,
      icon: "assets/img/marker.png",
      animation: google.maps.Animation.DROP,
      position: {
        lat: piclat,
        lng: piclng,
      },
    });
    this.map.setZoom(11);
    this.map.panTo(this.sourcemarker.position);

    if (this.sourcecirle) this.sourcecirle.setMap(null);

    // Add circle overlay and bind to marker
    this.sourcecirle = new google.maps.Circle({
      map: this.map,
      radius: this.work_radius, // 5km in meters
      fillColor: "#0D83EE",
      strokeColor: "#0D83EE",
      strokeOpacity: 0.8,
      strokeWeight: 0.8,
    });

    this.sourcecirle.bindTo("center", this.sourcemarker, "position");
  }
  // map work end

  backBtn() {
    this.router.navigateByUrl("/profile-approval");
  }

  submitDetails() {
    if (this.sel_value == "")
      return this.commonservice.toastalert("Please select business type.");
    if (this.location == "")
      return this.commonservice.toastalert("Please set location.");

    if (!this.city) return this.commonservice.toastalert("Please select city");

    this.servicedata = {
      merchant_id: this.merchant_id,
      type: parseInt(this.sel_value),
      gst_number: this.gstnumber,
      location: this.location,
      address: this.workingarea,
      city: this.city,
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/updateBusinessDetails", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.status) {
            this.commonservice.toastalert(data.message);

            this.merchant_details.city = this.cities && this.cities.length ? this.cities?.find(c => c._id === this.city) : this.city;
            localStorage.setItem("merchant", JSON.stringify(this.merchant_details));
            
            this.router.navigateByUrl("/profile-approval");
          } else this.commonservice.toastalert("Something went wrong!");
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  getProfile() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };
    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/getMerchantById", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.status) {
            if (data.response.type) this.sel_value = "" + data.response.type;
            if (data.response.gst_number)
              this.gstnumber = data.response.gst_number;

            setTimeout(() => {
              if (data.response.city) this.city = data.response.city;
              console.log(this.city);
            }, 2000);

            if (data.response.address) {
              this.workingarea.address = data.response.address.address;
              this.workingarea.lat = data.response.address.lat;
              this.workingarea.lng = data.response.address.lng;
            }
            if (data.response.location) {
              this.location = data.response.location;
              // load map
              let latLng = new google.maps.LatLng(
                this.location[0],
                this.location[1]
              );
              let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
              };

              this.map = new google.maps.Map(
                document.getElementById("map_canvas"),
                mapOptions
              );
              this.addsourceMarker2(this.location[0], this.location[1]);
              this.dragmap();
            } else {
              this.loadMap();
            }
          } else {
            this.loadMap();
            this.commonservice.toastalert(data.message);
          }
        },
        (error) => {
          console.log(error);
          this.loadMap();
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  cities: any = [];
  getAllCities() {
    this.commonservice.setHeaders();
    this.servicedata = {
      query: {},
    };

    this.commonservice
      .serverdatapost("city/getCity", this.servicedata)
      .subscribe(
        (res) => {
          let data: any;
          data = res;

          console.log(data);

          if (data.status == true) {
            this.cities = data.response;
          } else {
            this.commonservice.toastalert(data.response);
          }
        },
        (error) => {
          console.log(error);
          this.commonservice.toastalert("Something went wrong");
        }
      );
  }
}
