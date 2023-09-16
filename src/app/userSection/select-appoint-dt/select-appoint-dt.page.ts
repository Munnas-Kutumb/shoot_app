import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CalendarComponentOptions } from "ion2-calendar";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-select-appoint-dt",
  templateUrl: "./select-appoint-dt.page.html",
  styleUrls: ["./select-appoint-dt.page.scss"],
})
export class SelectAppointDtPage implements OnInit {

  date: any;
  time: any;
  venue: any;

  showdate: any = true;

  address: any = [];
  name: any;
  contact: any;
  building: any;
  location: any;
  city: any;

  merchant_id: any;
  servicedata: any;

  months = [[], []];
  dates = [];
  year: any;

  // dateMulti: string[];
  // type: "string"; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  // optionsMulti: CalendarComponentOptions = {
  //   pickMode: "single",
  // };

  constructor(public router: Router, private commonservice: CommonService) { }

  ionViewWillEnter() {

    var today = new Date();
    var nextDate = new Date().setDate(today.getDate() + 30);
    this.year = today.getFullYear();
    this.getDate(today, nextDate);

    this.merchant_id = localStorage.getItem("merchantid");
    var prevDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.getAllDates(prevDate.toISOString(), new Date());

    if (localStorage.bookingDate) {
      this.date = localStorage.bookingDate;
      console.log(this.date)
      var mon = this.date.substring(3, 4);

      var dt = this.date.split('-')[0];
      console.log(mon + '.....' + dt);

      this.prevBookedDate = dt;
      if (new Date(today).getMonth() === mon - 1) {
        var x = this.months[0].find((el) => el.date == dt);
        console.log(x)
        x.booked = true;
      } else {
        var x = this.months[1].find((e) => e.date == dt);
        console.log(x)

        x.booked = true;
      }
    }
    if (localStorage.bookingTime) this.time = localStorage.bookingTime;
    if (localStorage.bookingAddress) this.venue = localStorage.bookingAddress;

  }

  ngOnInit() { }

  next() {
    console.log(this.date);
    this.showdate = false;

    let user_details = JSON.parse(localStorage.getItem("user_details"));
    this.contact = user_details.phone;
    this.name = user_details.first_name + " " + user_details.last_name;
  }

  back() {
    this.showdate = true;
  }

  save() {
    // if ((this.contact + "").length > 10)
    //   return this.commonservice.toastalert("Invalid Mobile Number.");

    // this.address.push({
    //   name: this.name,
    //   contact: this.contact,
    //   building: this.building,
    //   location: this.location,
    //   city: this.city,
    // });

    if (this.date && this.time && this.venue) {
      localStorage.setItem("bookingDate", this.date);
      localStorage.setItem("bookingTime", this.time);
      localStorage.setItem("bookingAddress", this.venue);
      this.backBtn();
    } else {
      this.commonservice.toastalert("Please provide all details!");
    }
  }

  backBtn() {
    this.router.navigateByUrl("/use-merchant-profile");
  }

  day(day) {
    if (day == 0) return "Sun";
    if (day == 1) return "Mon";
    if (day == 2) return "Tue";
    if (day == 3) return "Wed";
    if (day == 4) return "Thu";
    if (day == 5) return "Fri";
    if (day == 6) return "Sat";
  }

  month(month) {
    if (month == "0") return "January";
    if (month == "1") return "February";
    if (month == "2") return "March";
    if (month == "3") return "April";
    if (month == "4") return "May";
    if (month == "5") return "June";
    if (month == "6") return "July";
    if (month == "7") return "August";
    if (month == "8") return "September";
    if (month == "9") return "October";
    if (month == "10") return "November";
    if (month == "11") return "December";
  }

  getDate(today, nextDate) {

    this.months = [[], []];
    this.dates = [];

    var m = this.month(new Date(today).getMonth());

    console.log(m);
    for (
      var dt = new Date(today);
      dt < nextDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      if (this.month(new Date(dt).getMonth()) === m) {
        this.months[0].push({
          date: new Date(dt).getDate(),
          day: this.day(new Date(dt).getDay()),
          month: this.month(new Date(dt).getMonth()),
          month_num: new Date(dt).getMonth(),
          selected: false,
          booked: false
        });
      } else {
        this.months[1].push({
          date: new Date(dt).getDate(),
          day: this.day(new Date(dt).getDay()),
          month: this.month(new Date(dt).getMonth()),
          month_num: new Date(dt).getMonth(),
          selected: false,
          booked: false
        });
      }
    }
    console.log(this.months);
  }

  prevBookedDate: any;

  setDate(date, mo, idx) {
    this.date = date + "-" + (mo + 1) + "-" + this.year;
    var x = this.months[idx].find((e) => e.date == date);
    if (!x.selected) {

      console.log(this.prevBookedDate);

      if (this.prevBookedDate) {
        var d = this.months[0].find((e) => e.date == this.prevBookedDate);
        console.log(d);

        if (!d) {
          var dt = this.months[1].find((e) => e.date == this.prevBookedDate);
          dt.booked = false;
        }
        else d.booked = false;
      }

      this.prevBookedDate = date;

      if (x.booked) {
        x.booked = false;
      } else {
        x.booked = true;
      }
    }
    else alert('Service not available for this date');
  }

  getAllDates(date, today) {
    this.servicedata = {
      query: {
        merchant_id: this.merchant_id,
        from_date: date,
      },
    };

    this.commonservice
      .serverdatapost("unavailable_date/getAllByQuery", this.servicedata)
      .subscribe(
        (res) => {
          console.log(res);
          var d;
          d = res;

          if (d.status) {
            var dates = d.response;
            dates.forEach((e) => {
              var mon = e.date.substring(5, 7);
              var dt = e.date.substring(8, 10);

              if (new Date(today).getMonth() === mon - 1) {
                var x = this.months[0].find((el) => el.date == dt);
                x.selected = true;
              } else {
                var x = this.months[1].find((e) => e.date == dt);
                x.selected = true;
              }
            });
          } else {
          }
        },
        (error) => {
          console.log(error);
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

}
