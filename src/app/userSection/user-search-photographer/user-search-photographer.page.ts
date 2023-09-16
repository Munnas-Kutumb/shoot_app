import { Component, OnInit } from '@angular/core';
import{Router} from '@angular/router'
import { CommonService } from 'src/service/commonservice';

@Component({
  selector: 'app-user-search-photographer',
  templateUrl: './user-search-photographer.page.html',
  styleUrls: ['./user-search-photographer.page.scss'],
})
export class UserSearchPhotographerPage implements OnInit {

  constructor(private route:Router, private common:CommonService) { }

  searchtext:any = '';
  servicedata:any;
  items:any = [];
  loc:any;
  city:any;
  sample:any;

  ngOnInit() {
  }

  ionViewWillEnter(){
  //  var loc = JSON.parse(localStorage.getItem('choosed_location'));
  //  this.searchtext = { city: loc.name };
   this.sample= JSON.parse(localStorage.getItem('choosed_location'))
    this.city=this.sample.name;
    console.log(this.city);

   this.search();

  }

  backBtn(){
    this.route.navigate(['/tabs/user-tabs/user-home-page'])
  }

  tomProfile(id) {
    localStorage.setItem("merchantid", id);
    localStorage.setItem('backto', 'search');
    this.route.navigateByUrl("/use-merchant-profile");
  }

  search(){
    console.log(this.searchtext);    
    console.log(this.searchtext.length); 
    
    if( this.searchtext.length >= 3 || this.searchtext == ''){
      this.servicedata = {
       
       city:this.city
      };
      if(this.searchtext) this.servicedata.brand_name=this.searchtext
      this.common
        .serverdata("merchant/search", [this.servicedata])
        .subscribe(
          (res) => {
            var data;
            data = res;
            this.items = data.response;
            console.log(this.items);
          },
          (err) => {
            console.log(err);
          }
      );
    }
    
  }

}
