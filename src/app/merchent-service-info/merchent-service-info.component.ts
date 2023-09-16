import { Component, OnInit } from "@angular/core";
import { NavParams, PopoverController } from "@ionic/angular";

@Component({
  selector: "app-merchent-service-info",
  templateUrl: "./merchent-service-info.component.html",
  styleUrls: ["./merchent-service-info.component.scss"],
})
export class MerchentServiceInfoComponent implements OnInit {
  photos: any;
  softcopy: any;
  hours: any;

  constructor(
    public popoverController: PopoverController,
    public navParams: NavParams
  ) {}

  ionViewWillEnter() {
    this.photos = this.navParams.data.photos;
    //this.softcopy = this.navParams.data.softcopy;
    this.hours = this.navParams.data.hours;
    if (this.navParams.data.softcopy) {
      this.softcopy = "YES";
    } else {
      this.softcopy = "NO";
    }
    console.log(this.photos);
    console.log(this.softcopy);
    console.log(this.hours);
  }

  ngOnInit() {}

  async closePopOver() {
    await this.popoverController.dismiss();
  }
}
