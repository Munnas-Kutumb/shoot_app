import { Component, OnInit } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
declare var google;

@Component({
  selector: "app-working-area",
  templateUrl: "./working-area.page.html",
  styleUrls: ["./working-area.page.scss"],
})
export class WorkingAreaPage implements OnInit {
  workingarea: any;
  address: any;
  map: any;
  starttime: any;
  endtime: any;
  lat: any;
  lng: any;

  pickuplocation: any = "";
  sourcemarker: any = "";
  geoLatitude: any;
  geoLongitude: any;

  sourcecirle: any = "";

  constructor(private geolocation: Geolocation) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.loadMap();
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
      // localStorage.setItem("picaddress",place.formatted_address);
      // localStorage.setItem("piclat",place.geometry.location.lat());
      // localStorage.setItem("piclng",place.geometry.location.lng());
      this.workingarea.lat = place.geometry.location.lat();
      this.workingarea.lng = place.geometry.location.lng();
      this.workingarea.address = place.formatted_address;
      this.addsourceMarker2(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    });
  }

  loadMap() {
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

      /***********************************************/
      this.pickuplocation = localStorage.getItem("picaddress");
      this.addsourceMarker();
      this.dragmap();
      /***********************************************/
    });
  }

  dragmap() {
    google.maps.event.addListener(this.map, "drag", () => {
      this.sourcemarker.setPosition(this.map.getCenter());
    });

    google.maps.event.addListener(this.map, "dragend", () => {
      //console.log("comming");
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
          //console.log(result[0].formatted_address);
          let lat: any = this.map.getCenter().lat();
          let lng: any = this.map.getCenter().lng();

          //console.log("first");
          localStorage.setItem("picaddress", result[0].formatted_address);
          localStorage.setItem("pickuplat", lat);
          localStorage.setItem("pickuplng", lng);
          this.workingarea.lat = localStorage.getItem("pickuplat");
          this.workingarea.lng = localStorage.getItem("pickuplng");
          for (let i = 0; i < result[0].address_components.length; i++) {
            var addressType = result[0].address_components[i].types[0];

            if (componentForm[addressType]) {
              let val =
                result[0].address_components[i][componentForm[addressType]];
              if (addressType == "administrative_area_level_2") {
                localStorage.setItem("pickupcity", val);
              }
              if (addressType == "administrative_area_level_1") {
                localStorage.setItem("pickupstate", val);
              }
            }
          }
          localStorage.setItem("picaddress", result[0].formatted_address);
          this.workingarea.address = localStorage.getItem("picaddress");
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
        lat: parseFloat(localStorage.getItem("pickuplat")),
        lng: parseFloat(localStorage.getItem("pickuplng")),
      },
    });

    this.map.setZoom(11);

    if (this.sourcecirle) this.sourcecirle.setMap(null);

    // Add circle overlay and bind to marker
    this.sourcecirle = new google.maps.Circle({
      map: this.map,
      radius: 5000, // 5km in meters
      fillColor: "#0D83EE",
      strokeColor: "#0D83EE",
      strokeOpacity: 0.8,
      strokeWeight: 0.8,
    });

    this.sourcecirle.bindTo("center", this.sourcemarker, "position");
  }
  addsourceMarker2(piclat, piclng) {
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
      radius: 5000, // 5km in meters
      fillColor: "#0D83EE",
      strokeColor: "#0D83EE",
      strokeOpacity: 0.8,
      strokeWeight: 0.8,
    });

    this.sourcecirle.bindTo("center", this.sourcemarker, "position");
  }
}
