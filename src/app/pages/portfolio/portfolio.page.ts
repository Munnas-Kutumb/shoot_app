import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PopoverController } from "@ionic/angular";
import { AddLinkPortfolioComponent } from "src/app/add-link-portfolio/add-link-portfolio.component";
import { CommonService } from "src/service/commonservice";
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
declare var cordova: any;

@Component({
  selector: "app-portfolio",
  templateUrl: "./portfolio.page.html",
  styleUrls: ["./portfolio.page.scss"],
})
export class PortfolioPage implements OnInit {
  servicedata: any = {};

  merchant_id: any = "";
  service_id: any = "";

  service_list: any = [];

  album: any = [];
  vediolink: any = [];

  lastImage: string = null;
  serviceview: boolean = false;

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private commonservice: CommonService,
    public alertController: AlertController,
    private camera: Camera,
    private actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    public platform: Platform
  ) { }

  ngOnInit() {
    // this.getBookings();
  }

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    this.getPortfolioCategory();
  }

  //Get service list provided by Merchant **
  getPortfolioCategory() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };
    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/getPortfolioCategory", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          if (data.status) {
            this.service_list = data.response;
            console.log(this.service_list);
            if (this.service_list.length) {
              this.service_id = this.service_list[0].service_id;
              this.getPortfolio();
            }
          } else {
            console.log(data);
          }
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  astatus: any = false;
  portfolio_id: any;

  // get portfolio
  getPortfolio() {
    console.log(this.service_id);
    this.serviceview = false;

    this.servicedata = {
      query: {
        merchant_id: this.merchant_id,
        service_id: this.service_id,
      },
    };

    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/getPortfolioByQuery", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.status) {
            this.serviceview = true;
            this.album = data.response[0].album;
            this.vediolink = data.response[0].video_link;
            this.astatus = data.response[0].approve_status;
            this.portfolio_id = data.response[0]._id;
            // localStorage.setItem('pid', this.portfolio_id);


          } else {
            this.commonservice.toastalert(data.message);
          }
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  async approvalMessage(id) {
    console.log(id);

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
            this.approveStatus(id);
          },
        },
      ],
    });
    await alert.present();
  }

  approveStatus(id) {
    this.servicedata = {
      portfolio_id: id,
      approve_status: false,
    };
    console.log(this.servicedata.portfolio_id);

    this.commonservice
      .serverdatapost("merchant/portfolioApproveStatus", this.servicedata)
      .subscribe(
        (res) => {
          console.log(res);
          let data: any = res;
          this.commonservice.toastalert(data.message);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  //Alert Box for input
  async addvediolink() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Add video link",
      inputs: [
        {
          name: "link",
          type: "text",
          placeholder: "Video URL",
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
            console.log(data.link);
            if (!data.link) {
              return this.commonservice.toastalert("Please provide video url!");
            }
            this.vediolink.push(data.link);
            this.updatePortfolioContent();
          },
        },
      ],
    });

    await alert.present();
  }

  // update Portfolio
  updatePortfolioContent() {
    this.servicedata = {
      merchant_id: this.merchant_id,
      service_id: this.service_id,
      album: this.album,
      video_link: this.vediolink,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/updatePortfolio", this.servicedata)
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

  async removePortfolioImage(index) {
    this.servicedata = {
      image: this.album[index],
    };

    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Delete!",
      message: "Do you want to <strong>Delete</strong>?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Cancel called");
          },
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Confirm Okay");
            this.commonservice.waitloadershow();
            this.commonservice
              .serverdatapost("merchant/del_image", this.servicedata)
              .subscribe(
                (res) => {
                  this.commonservice.waitloaderhide();
                  let data: any;
                  data = res;

                  console.log(data);

                  if (data.status == true) {
                    this.album.splice(index, 1);
                    this.updatePortfolioContent();
                  } else {
                    this.commonservice.toastalert(data.response);
                  }
                },
                (error) => {
                  this.commonservice.waitloaderhide();
                  console.log(error);
                  this.commonservice.toastalert("Something went wrong");
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }

  //Upload Images
  async uploadimg() {
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
      (err) => { }
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
        (error) => { }
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
          this.album.push(data.image);
          this.updatePortfolioContent();
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

  // remove vedio link
  async remove_vedio(index) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Delete!",
      message: "Do you want to <strong>Delete</strong>?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Cancel called");
          },
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Confirm Okay");
            this.vediolink.splice(index, 1);
            this.updatePortfolioContent();
          },
        },
      ],
    });

    await alert.present();
  }

  // youtube thumbnail
  youtube_thumb(url) {
    if (url) {
      var video_id, result;

      if ((result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))) {
        video_id = result.pop();
      } else if ((result = url.match(/youtu.be\/(.{11})/))) {
        video_id = result.pop();
      }

      if (video_id) {
        let quality_key = "sddefault"; // mqdefault // hqdefault
        let thumbnail =
          "http://img.youtube.com/vi/" + video_id + "/" + quality_key + ".jpg";
        return thumbnail;
      }
    }
    return "no image url";
  }
}
