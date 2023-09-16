import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-slides",
  templateUrl: "./slides.page.html",
  styleUrls: ["./slides.page.scss"],
})
export class SlidesPage implements OnInit {
  slidefor: any = "customer";

  constructor(private router: Router) {}

  ngOnInit() {}

  customerLogin() {
    localStorage.setItem("userType", "customer");
    this.router.navigateByUrl("/login-main");
  }

  merchatLogin() {
    localStorage.setItem("userType", "merchant");
    this.router.navigateByUrl("/login");
  }

  changesliderfor(val) {
    this.slidefor = val;
  }

  moveToNext(slides) {
    console.log(slides);
    slides.slideNext();
  }
}
