import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private fcm: FCM,
    private commonservice: CommonService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#000000");
      this.splashScreen.hide();

      this.commonservice.networkCheck();

      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener(
          "backbutton",
          function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log("hello");
          },
          false
        );
      });

      // this.fcm.getToken().then((token) => {
      //   // console.log(token);
      // });

      // if (localStorage.getItem("logged_in") == "1") {
      //   if (localStorage.getItem("userType") == "merchant")
      //     this.router.navigateByUrl("/tab/tabs/home-page");
      // } else {
      //   if (localStorage.getItem("userType") == "merchant")
      //     this.router.navigateByUrl("/login");
      //   else if (localStorage.getItem("userType") == "customer")
      //     this.router.navigateByUrl("/login-main");
      //   else this.router.navigateByUrl("/");
      // }
    });
  }
}
