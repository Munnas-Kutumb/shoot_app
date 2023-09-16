import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-gif",
  templateUrl: "./gif.page.html",
  styleUrls: ["./gif.page.scss"],
})
export class GifPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fire();
  }

  fire() {
    setTimeout(() => {
      if (localStorage.getItem("logged_in") == "1") {
        if (localStorage.getItem("userType") == "merchant")
          this.router.navigateByUrl("/tab/tabs/home-page");
      } else {
        if (localStorage.getItem("userType") == "merchant")
          this.router.navigateByUrl("/login");
        else if (localStorage.getItem("userType") == "customer")
          this.router.navigateByUrl("/login-main");
        else this.router.navigateByUrl("/splash");
      }
    }, 2500);
  }
}
