import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
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
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  servicedata: any = {};

  fullName: any = "";
  brandName: any = "";
  email: any = "";
  merchant_id: any = "";
  profileimage: any = "";

  merchant_details: any = {};

  lastImage: string = null;
  referred_from: any;
  referral_code: any;

  constructor(
    private router: Router,
    public toastController: ToastController,
    private commonservice: CommonService,
    private camera: Camera,
    private actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    public platform: Platform
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.merchant_id = localStorage.getItem("merchant_id");
    this.merchant_details = JSON.parse(localStorage.getItem("merchant"));
    if (this.merchant_details.referred_from)
      this.referred_from = this.merchant_details.referred_from;
    if (this.merchant_details.personal_detail_status) {
      this.fullName = this.merchant_details.name;
      this.brandName = this.merchant_details.brand_name;
      this.email = this.merchant_details.email;
      this.profileimage = this.merchant_details.image;
    }
  }

  cancelBtn() {
    this.router.navigateByUrl("/login");
  }

  email_valid: boolean = false;

  checkEmail(val) {
    //console.log(val);
    var re = /\S+@\S+\.\S+/;
    var check = re.test(this[val]);
    this.email_valid = false;

    if (!check && val == "email") this.email_valid = true;
  }

  titlecase(e) {
    if (e.key != " " || e.keyCode != 32) {
      this.fullName = e.target.value
        .split(" ")
        .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(" ");
      return;
    }
  }

  register() {
    if (this.fullName == "" || this.brandName == "" || this.email == "")
      return this.commonservice.toastalert("All fields are required.");

    if (!this.email_valid) {
      this.servicedata = {
        merchant_id: this.merchant_id,
        name: this.fullName,
        brand_name: this.brandName,
        business_email: this.email,
        image: this.profileimage,
      };

      this.commonservice.setHeaders();
      this.commonservice.waitloadershow();
      this.commonservice
        .serverdatapost("merchant/updatePersonalDetails", this.servicedata)
        .subscribe(
          (res) => {
            this.commonservice.waitloaderhide();
            let data: any = res;
            console.log(data);

            if (data.status == true) {
              this.merchant_details.name = this.fullName;
              this.merchant_details.brand_name = this.brandName;
              this.merchant_details.email = this.email;
              this.merchant_details.personal_detail_status = true;
              this.merchant_details.image = this.profileimage;
              localStorage.setItem(
                "merchant",
                JSON.stringify(this.merchant_details)
              );
              this.router.navigateByUrl("/intro-to-shoot");
            } else {
              console.log(data.response);
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

  applyReferral() {
    this.servicedata = {
      merchant_id: this.merchant_id,
      referral_code: this.referred_from,
    };

    this.commonservice.setHeaders();
    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/claimReferral", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);

          if (data.status == true) {
            this.merchant_details.referred_from = this.referred_from;
            localStorage.setItem(
              "merchant",
              JSON.stringify(this.merchant_details)
            );
            this.commonservice.toastalert(data.message);
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

  // upload profile image
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
          this.profileimage = data.image;
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
}
