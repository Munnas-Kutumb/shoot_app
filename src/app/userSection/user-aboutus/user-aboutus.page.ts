import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-user-aboutus",
  templateUrl: "./user-aboutus.page.html",
  styleUrls: ["./user-aboutus.page.scss"],
})
export class UserAboutusPage implements OnInit {
  options: InAppBrowserOptions = {
    location: "yes", //Or 'no'
    hidden: "no", //Or  'yes'
    clearcache: "yes",
    clearsessioncache: "yes",
    zoom: "yes", //Android only ,shows browser zoom controls
    hardwareback: "yes",
    mediaPlaybackRequiresUserAction: "no",
    shouldPauseOnSuspend: "no", //Android only
    closebuttoncaption: "Close", //iOS only
    disallowoverscroll: "no", //iOS only
    toolbar: "yes", //iOS only
    enableViewportScale: "no", //iOS only
    allowInlineMediaPlayback: "no", //iOS only
    presentationstyle: "pagesheet", //iOS only
    fullscreen: "yes", //Windows only
  };

  constructor(private route: Router, private theInAppBrowser: InAppBrowser) {}

  ngOnInit() {}

  backBtn() {
    this.route.navigateByUrl("/tabs/user-tabs/user-profile");
  }

  public privacy() {
    let target = "_blank";
    this.theInAppBrowser.create(
      "https://shootservices.in/PrivacyPolicy.html",
      target,
      this.options
    );
  }

  public terms() {
    let target = "_blank";
    this.theInAppBrowser.create(
      "https://shootservices.in/term&condition.html",
      target,
      this.options
    );
  }
}
