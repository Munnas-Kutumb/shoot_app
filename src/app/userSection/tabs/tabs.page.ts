import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.page.html",
  styleUrls: ["./tabs.page.scss"],
})
export class TabsPage implements OnInit {
  constructor(public route: Router) {}

  ngOnInit() {}

  opencart() {
    localStorage.removeItem("byCheckout");
    this.route.navigateByUrl("/user-cart");
  }
}
