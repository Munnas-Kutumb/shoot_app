import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-gst-details',
  templateUrl: './add-gst-details.page.html',
  styleUrls: ['./add-gst-details.page.scss'],
})
export class AddGstDetailsPage implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }

  backBtn() {

    this.router.navigateByUrl("/gst-details")
  }

}
