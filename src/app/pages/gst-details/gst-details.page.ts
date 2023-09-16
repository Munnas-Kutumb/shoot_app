import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gst-details',
  templateUrl: './gst-details.page.html',
  styleUrls: ['./gst-details.page.scss'],
})
export class GstDetailsPage implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }

  toAddGst() {

    this.router.navigateByUrl("/add-gst-details")
  }

  backBtn() {

    this.router.navigateByUrl("/tab/tabs/profile")
  }

}
