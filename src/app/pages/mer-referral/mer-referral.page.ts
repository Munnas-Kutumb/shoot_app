import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonService } from 'src/service/commonservice';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mer-referral',
  templateUrl: './mer-referral.page.html',
  styleUrls: ['./mer-referral.page.scss'],
})
export class MerReferralPage implements OnInit {

  view : any = "entercode"
  servicedata : any = {}
  merchant_id : any = ""
  result : any = ""
  inputCode : any = ""

  constructor(private router : Router, private commonservice: CommonService, public alertController: AlertController) {

    var merchant_details = JSON.parse(localStorage.getItem("merchant"));
      this.merchant_id = merchant_details.id;
      console.log( this.merchant_id);
   }

  ngOnInit() {
  }

  skip() {

    this.router.navigateByUrl("/register");
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      // subHeader: 'Subtitle',
      message: 'Referral Code Applied Successfully',
      buttons: [{
        text: 'Okay',
        handler: () => {
         this.router.navigateByUrl("/register");
      }
      }]
    });

    await alert.present();
  }


  submitReferrel() {
  
    this.commonservice.setHeaders();
  
      this.servicedata = {

        merchant_id : this.merchant_id,
        referral_code : this.inputCode
    }
  
    this.commonservice.waitloadershow();
  
    this.commonservice.serverdatapost("merchant/claimReferral", this.servicedata).subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          this.result = data
          console.log(this.result.status);
          if( this.result.status == true){
            this.presentAlert();
          }
        },
  
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }




}
