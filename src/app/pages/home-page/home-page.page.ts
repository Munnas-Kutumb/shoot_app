import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
  ActionSheetController,
  Platform,
} from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
//  import {IonContent} from 'ionic-angular';

declare var cordova: any;

import { ModalController, ToastController, IonContent } from "@ionic/angular";
import { CalendarComponentOptions } from "ion2-calendar";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.page.html",
  styleUrls: ["./home-page.page.scss"],
})
export class HomePagePage implements OnInit {
  servicedata: any = {};
  merchant_details: any = "";
  merchant_id: any = "";
  service_toggle: boolean = false;
  instant_avail_toggle: boolean = false;
  type: "string"; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  merchantDetails: any = "";
  booking_number: any = "";
  rating_mer: any = "";
  brand_name: any = "";

  date_avail: any = "";
  uncalev: any = "";

  temp_brand_name: any = "";

  available_timing: any = {
    from_time: "",
    to_time: "",
  };

  date_avail_from: any = "";
  date_avail_to: any = "";
  lastImage: string = null;
  bannerimage: any = "";
  setUrl: any;
  booking_count: any = [];
  unavdate:any=[];

  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  dateRange: {
    from: Date;
    to: Date;
  } = {
    from: this.firstDay,
    to: this.lastDay,
  };

  optionsRange: CalendarComponentOptions = {
    pickMode: "range",
  };

  @ViewChild("content", { static: false }) content: IonContent;
  constructor(
    private router: Router,
    private commonservice: CommonService,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalCtrl: ModalController,

    private camera: Camera,
    private actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    public platform: Platform
  ) {}

  scrollToBottomOnInit() {
    this.content.scrollToTop(500);
    // this.content.scrollTop=0;
  }

  months = [[], []];
  dates = [];
  year: any;

  ngOnInit() {
    var today = new Date();
    var nextDate = new Date().setDate(today.getDate() + 30);
    this.year = today.getFullYear();
    this.getDate(today, nextDate);
  }

  ionViewWillEnter() {
    this.setUrl = this.commonservice.serviceurl;
    this.merchant_id = localStorage.getItem("merchant_id");
    this.getMerchant();

    var prevDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.getAllDates(prevDate.toISOString(), new Date());
    this.leads();
    this.scrollToBottomOnInit();
  }

  ionViewWillLeave() {
    console.log("***");
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

  getDate(today, nextDate) {
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
        });
      } else {
        this.months[1].push({
          date: new Date(dt).getDate(),
          day: this.day(new Date(dt).getDay()),
          month: this.month(new Date(dt).getMonth()),
          month_num: new Date(dt).getMonth(),
          selected: false,
        });
      }
    }
    console.log(this.months);
  }

  setUnavailable(date, month, index) {
    var d = month + 1 + "-" + date + "-" + this.year;
    console.log(d);

    var x = this.months[index].find((e) => e.date == date);

    if (x.selected) {
      for (let index = 0; index < this.unavdate.length; index++) {
        if(this.unavdate[index].date==x.date&&this.unavdate[index].day==x.day&&this.unavdate[index].month_num==x.month_num){
          var dateId=this.unavdate[index].id
        }
        
      }
     
      console.log("in");
      console.log(dateId,x)
      
      x.selected = false;
      this.removeAvailabilityDays(dateId);
    } else {
      x.selected = true;
      this.AddAvailabilityDays(d, index, date);
    }
  }

  getMerchant() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/getMerchantById", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let details: any = res;
          this.merchantDetails = details.response;
          console.log(this.merchantDetails);
          this.brand_name = this.merchantDetails.brand_name;
          this.bannerimage = this.merchantDetails.banner_image;
          this.rating_mer = this.merchantDetails.rating;
          this.service_toggle = this.merchantDetails.online_status;
          if (this.merchantDetails.temp_brand_name)
            this.temp_brand_name = this.merchantDetails.temp_brand_name;
          this.instant_avail_toggle = this.merchantDetails.instant_available;
          if (this.merchantDetails.available_timing)
            this.available_timing.from_time =
              this.merchantDetails.available_timing.from_time;
          else
            this.available_timing.from_time = "2021-09-17T10:00:33.484+05:30";

          if (this.merchantDetails.available_timing)
            this.available_timing.to_time =
              this.merchantDetails.available_timing.to_time;
          else this.available_timing.to_time = "2021-09-17T20:00:33.484+05:30";

          if (localStorage.getItem("view_count")) {
            this.merchantDetails.view_count =
              parseInt(localStorage.getItem("view_count")) + 1;
            localStorage.setItem("view_count", this.merchantDetails.view_count);
            localStorage.setItem("view_count_date", "" + new Date());
          } else {
            localStorage.setItem("view_count", this.merchantDetails.view_count);
            localStorage.setItem("view_count_date", "" + new Date());
          }
          // console.log(JSON.stringify(this.date_avail_from));
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  toMarketPage() {
    this.router.navigateByUrl("/market-yourself");
  }

  toMerServices() {
    this.router.navigateByUrl("/merchent-services-list");
  }

  toMarket() {
    this.router.navigateByUrl("/market-yourself");
  }

  serviceToggle() {
    if (this.instant_avail_toggle) {
      this.service_toggle = !this.service_toggle;
      return this.commonservice.toastalert(
        "Please disable instant availability first"
      );
    } else {
      this.servicedata = {
        merchant_id: this.merchant_id,
        online_status: !this.service_toggle,
      };

      this.commonservice.waitloadershow();
      this.commonservice
        .serverdatapost("merchant/updateOnlineStatus", this.servicedata)
        .subscribe(
          (res) => {
            this.commonservice.waitloaderhide();
            let data: any = res;
            console.log(data);
            if (data.status)
              if (this.servicedata.online_status == true) {
                //this.commonservice.toastalert(data.message);

                this.commonservice.toastalert("Now you are online!");
              } else {
                this.commonservice.toastalert("Now you are offline!");
              }
            else this.service_toggle = false;
          },

          (error) => {
            console.log(error);
            this.commonservice.waitloaderhide();
            this.commonservice.toastalert("Something went wrong!");
          }
        );
    }
  }

  async instantAvailabilty() {
    if (!this.service_toggle) {
      this.instant_avail_toggle = !this.instant_avail_toggle;
      return this.commonservice.toastalert("Please enable the service first");
    } else {
      console.log(this.instant_avail_toggle);

      this.servicedata = {
        merchant_id: this.merchant_id,
        instant_available: !this.instant_avail_toggle,
      };

      if (!this.instant_avail_toggle) {
        const alert = await this.alertController.create({
          cssClass: "my-custom-class",
          header: "Instant Availablity!",
          message: "Are you sure you want to use instant service?",
          buttons: [
            {
              text: "No",
              role: "cancel",
              cssClass: "secondary",
              handler: (blah) => {
                console.log("Cancel called");
                this.getMerchant();
              },
            },
            {
              text: "Yes",
              handler: () => {
                console.log("Confirm Okay");

                this.commonservice.waitloadershow();
                this.commonservice
                  .serverdatapost(
                    "merchant/instanceAvailableMerchant",
                    this.servicedata
                  )
                  .subscribe(
                    (res) => {
                      this.commonservice.waitloaderhide();
                      let data: any = res;
                      console.log(data);
                      this.commonservice.toastalert(data.message);
                    },

                    (error) => {
                      console.log(error);
                      this.commonservice.waitloaderhide();
                      this.commonservice.toastalert("Something went wrong!");
                    }
                  );
              },
            },
          ],
        });

        await alert.present();
      } else {
        this.commonservice.waitloadershow();
        this.commonservice
          .serverdatapost(
            "merchant/instanceAvailableMerchant",
            this.servicedata
          )
          .subscribe(
            (res) => {
              this.commonservice.waitloaderhide();
              let data: any = res;
              console.log(data);
              this.commonservice.toastalert(data.message);
            },

            (error) => {
              console.log(error);
              this.commonservice.waitloaderhide();
              this.commonservice.toastalert("Something went wrong!");
            }
          );
      }
    }
  }

  getBookingDetails() {
    this.servicedata = {
      query: {
        merchant_id: this.merchant_id,
      },
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("booking/bookingCountByQuery", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let result: any = res;
          this.booking_number = result.no_of_booking;
          console.log(this.booking_number);
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  updateTodayTime(val, timing) {
    console.log(val, timing);
    let a = val.substring(10,val.length)
    console.log(a);
    var d =new Date().toISOString().slice(0,10);
    var dateTime=d+a;
    console.log(dateTime)
    
    

    
    if (timing == 1) {
      this.available_timing.from_time = dateTime;
    }
    if (timing == 2) {
      this.available_timing.to_time = dateTime;
    }

    this.servicedata = {
      merchant_id: this.merchant_id,
      available_timing: this.available_timing,
    };

    if (this.available_timing.from_time == "")
      return this.commonservice.toastalert("From time required!");

    if (this.available_timing.to_time == "")
      return this.commonservice.toastalert("To time required!");

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/updateAvailableTime", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let details: any = res;
          console.log(details);
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  async availTimeUpdated() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Online Status",
      // subHeader: 'Subtitle',
      message: "Available Time Updated.",
      buttons: ["OK"],
    });

    await alert.present();
  }

  async tempFunc() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Name approval",
      message: "Already gone for admin approval",
      buttons: ["OK"],
    });

    await alert.present();
  }

  //calender image

  AddAvailabilityDays(date, index, d) {
    this.servicedata = {
      merchant_id: this.merchant_id,
      date: date,
    };

    this.commonservice
      .serverdatapost("unavailable_date/addUnavailable_Date", this.servicedata)
      .subscribe(
        (res) => {
          console.log(res);
          var data;
          data = res;

          var x = this.months[index].find((e) => e.date == d);
          x.id = data.response._id;
          console.log(x);
          this.unavdate.push(x);
          console.log(this.unavdate)
          
        },
        (error) => {
          console.log(error);
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  removeAvailabilityDays(id) {
    this.servicedata = {
      unavailable_date_id: id,
    };

    this.commonservice
      .serverdatapost("unavailable_date/removeDate", this.servicedata)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  //Upload Banner Image
  async uploadimg() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Cover Image",
      message:
        "This will go for admin approval, will be updated within 2 days.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: false");
          },
        },
        {
          text: "Proceed",
          handler: () => {
            this.confirmuploadimg();
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmuploadimg() {
    const actionSheet = await this.actionSheetController.create({
      header: "Image Upload",
      buttons: [
        {
          text: "Load from Library",
          icon: "images",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Use Camera",
          icon: "camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
        },
      ],
    });
    await actionSheet.present();
  }

  public takePicture(sourceType) {
    var options = {
      quality: 30,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(
      (imagePath) => {
        if (
          this.platform.is("android") &&
          sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
        ) {
          this.filePath.resolveNativePath(imagePath).then((filePath) => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
            let currentName = imagePath.substring(
              imagePath.lastIndexOf("/") + 1,
              imagePath.lastIndexOf("?")
            );
            this.copyFileToLocalDir(
              correctPath,
              currentName,
              this.createFileName()
            );
          });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
          this.copyFileToLocalDir(
            correctPath,
            currentName,
            this.createFileName()
          );
        }
      },
      (err) => {}
    );
  }
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";

    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file
      .copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
      .then(
        (success) => {
          this.lastImage = newFileName;
          this.uploadImage();
        },
        (error) => {}
      );
  }

  public pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  uploadImage() {
    this.commonservice.waitloadershow();
    var url = this.commonservice.serviceurl + "merchant/upload_image";
    var targetPath = this.pathForImage(this.lastImage);

    var options = {
      fileKey: "avatar",
      fileName: this.lastImage,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {
        avatar: this.lastImage,
      },
    };

    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.upload(targetPath, url, options).then(
      (res) => {
        let data: any = JSON.parse(res.response);
        console.log(data);
        this.commonservice.waitloaderhide();

        if (data.status) {
          this.bannerimage = data.image;
          this.uploadbannerimage();
        } else {
          this.commonservice.toastalert("Image not found.");
        }
      },
      (err) => {
        console.log(err);
        this.commonservice.waitloaderhide();
      }
    );
  }

  // upload image
  uploadbannerimage() {
    this.servicedata = {
      merchant_id: this.merchant_id,
      temp_banner_image: this.bannerimage,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/updateBannerImage", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          this.commonservice.toastalert(data.message);
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  calenderEvent(val) {
    console.log(val);
    var date = new Date(val.time).getDate();
    var month = new Date(val.time).getMonth() + 1;
    var year = new Date(val.time).getFullYear();
    console.log(date + "/" + month + "/" + year);
  }

  //Alert Box for input
  async brandNameUpdate() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Update Brand Name",
      message:
        "Note: This will go for admin approval, will be updated within 2 days.",
      inputs: [
        {
          name: "brand_name",
          type: "text",
          value: this.brand_name,
          placeholder: "Update Here",
          cssClass: "specialClass",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Ok",
          handler: (data) => {
            if (data) {
              // data = data.brand_name.replace(/[^a-z0-9]/gi, "");
              data = data.brand_name;

              console.log(data);
              this.updateBrandName(data);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  updateBrandName(brandname) {
    this.servicedata = {
      merchant_id: this.merchant_id,
      name: this.merchantDetails.name,
      brand_name: this.merchantDetails.brand_name,
      temp_brand_name: brandname,
      business_email: this.merchantDetails.business_email,
      image: this.merchantDetails.image,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/updatePersonalDetails", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          this.getMerchant();
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  leads() {
    this.servicedata = {
      query: { merchant_id: this.merchant_id },
    };

    // this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("booking/bookingCountByQuery", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;

          console.log(data);
          this.booking_count = data.response;
          console.log(this.booking_count);
        },

        (error) => {
          console.log(error);
          // this.commonservice.waitloaderhide();
          // this.commonservice.toastalert("Something went wrong!");
        }
      );
  }
}
