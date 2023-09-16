import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PhotoViewer } from "@ionic-native/photo-viewer/ngx";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.page.html",
  styleUrls: ["./gallery.page.scss"],
})
export class GalleryPage implements OnInit {
  servicedata: any;
  data: any;
  gallery: any = [];
  merchantid: any;

  constructor(
    private route: Router,
    private viewer: PhotoViewer,
    private common: CommonService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.merchantid = localStorage.merchantid;
    this.getportfolio();
  }

  backBtn() {
    this.route.navigate(["/use-merchant-profile"]);
  }

  view(item) {
    this.viewer.show(this.common.serviceurl + "merchant/" + item);
  }

  getportfolio() {
    this.common.setHeaders();

    this.servicedata = {
      query: {
        merchant_id: this.merchantid,
      },
    };
    this.common
      .serverdatapost("merchant/getPortfolioByQueryforMerchant", this.servicedata)
      .subscribe(
        (res) => {
          this.data = res;
          this.gallery = this.data.response;
          console.log(this.gallery);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  // youtube thumbnail
  youtube_thumb(url) {
    // console.log("**");
    if (url) {
      var video_id, result;

      if ((result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))) {
        video_id = result.pop();
      } else if ((result = url.match(/youtu.be\/(.{11})/))) {
        video_id = result.pop();
      }

      if (video_id) {
        let quality_key = "sddefault"; // mqdefault // hqdefault
        let thumbnail =
          "http://img.youtube.com/vi/" + video_id + "/" + quality_key + ".jpg";
        return thumbnail;
      }
    }
    return "no_image_url";
  }

  sample(i) {
    console.log("in");
    window.open(i, "_blank");
  }
}
