import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-intro-to-shoot",
  templateUrl: "./intro-to-shoot.page.html",
  styleUrls: ["./intro-to-shoot.page.scss"],
})
export class IntroToShootPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  back() {
    this.router.navigateByUrl("/register");
  }

  proceed() {
    this.router.navigateByUrl("/profile-approval");
  }
}
