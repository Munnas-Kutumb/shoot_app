import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-add-link-portfolio',
  templateUrl: './add-link-portfolio.component.html',
  styleUrls: ['./add-link-portfolio.component.scss'],
})
export class AddLinkPortfolioComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}


  async submit() {
    await this.popoverController.dismiss();
      }

}
