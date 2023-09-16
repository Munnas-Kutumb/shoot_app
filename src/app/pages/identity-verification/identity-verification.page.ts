import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
  selector: "app-identity-verification",
  templateUrl: "./identity-verification.page.html",
  styleUrls: ["./identity-verification.page.scss"],
})
export class IdentityVerificationPage implements OnInit {
  check: boolean = false;
  servicedata: any = {};

  merchant_id: any = "";

  fullName: any = "";
  current_address: any = "";
  permanent_address: any = "";
  aadhar_card_image: any = [];
  pan_card_image: any = "";

  data: any = "";
  image: any = "";
  displayimg: any = "";
  lastImage: string = null;
  sourceimage: any;

  aadhar_card_number: any;
  pan_card_number: any;
  // pan_preview:any = "";
  // adhar_preview_front:any = "";
  // adhar_preview_back:any = "";

  constructor(
    private router: Router,
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
    this.commonservice.setHeaders();
    this.getProfile();
  }

  backBtn() {
    this.router.navigateByUrl("/profile-approval");
  }

  pan_number_valid: boolean = false;
  checkPanNumber(val) {
    var re = /\S+@\S+\.\S+/;
    var check = re.test(this[val]);
    this.pan_number_valid = false;

    if (!check && val == "pan_card_number") this.pan_number_valid = true;
  }

  validAadhar() {
    if ((this.aadhar_card_number + "").length > 12)
      return this.commonservice.toastalert("Aadhar number not valid!");
  }

  validPan() {
    if ((this.pan_card_number + "").length > 10)
      return this.commonservice.toastalert("PAN number not valid!");
  }

  onChange($event) {
    console.log("clicked");
    console.log(this.check);
    if (this.check) this.permanent_address = this.current_address;
    else this.permanent_address="";
    if(this.current_address=="") {
      this.check=!this.check,
      this.permanent_address=""
    }
  }

  

  titlecase(e){
// console.log(e);

    if(e.key != ' ' || e.keyCode != 32){
      this.fullName = e.target.value.split(' ')
      .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(' ')
      return;
    }
    
    // e.target.value.replace(
    //   /\w\S*/g,
    //   (txt: any)=> {
    //     this.fullName = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    //   }
    // );
  }

  getProfile() {
    this.servicedata = {
      merchant_id: this.merchant_id,
    };
    this.commonservice.waitloadershow();
    this.commonservice
      .serverdatapost("merchant/getMerchantById", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.status) {
            if (data.response.pan_card_image)
              this.pan_card_image = data.response.pan_card_image;
            if (data.response.aadhar_card_image[0])
              this.aadhar_card_image[0] = data.response.aadhar_card_image[0];
            if (data.response.aadhar_card_image[1])
              this.aadhar_card_image[1] = data.response.aadhar_card_image[1];
            if (data.response.document_name)
              this.fullName = data.response.document_name;
            if (data.response.current_address)
              this.current_address = data.response.current_address;
            if (data.response.permanent_address)
              this.permanent_address = data.response.permanent_address;
            if (data.response.aadhar_card_number)
              this.aadhar_card_number = data.response.aadhar_card_number;
            if (data.response.pan_card_number)
              this.pan_card_number = data.response.pan_card_number;
            if (this.current_address == this.permanent_address && data.response.current_address)
              this.check = true;
          } else this.commonservice.toastalert(data.message);
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  submitDetails() {
    if (
      this.fullName == "" ||
      this.current_address == "" ||
      this.permanent_address == "" ||
      this.aadhar_card_number == "" ||
      this.pan_card_number == ""
    )
      return this.commonservice.toastalert("All fields are required.");
    this.servicedata = {
      merchant_id: this.merchant_id,
      pan_card_image: this.pan_card_image,
      aadhar_card_image: this.aadhar_card_image,
      document_name: this.fullName,
      current_address: this.current_address,
      permanent_address: this.permanent_address,
      aadhar_card_number: this.aadhar_card_number,
      pan_card_number: this.pan_card_number,
    };

    if ((this.aadhar_card_number + "").length != 12)
      return this.commonservice.toastalert(
        "Aadhar card number is not valid."
      );

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("merchant/updateIdentityProofDetails", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);

          if (data.status == true) {
            this.commonservice.toastalert(data.message);
            this.router.navigateByUrl("/profile-approval");
          } else {
            this.commonservice.toastalert("All fileds are required.");
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

  //Code Submitted by Ayushi And Sir

  imgfor: any = "";
  async uploadimg(val) {
    this.imgfor = val;
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
      // saveToPhotoAlbum: false,
      saveToPhotoAlbum: true,
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
          if (this.imgfor == "pan") this.pan_card_image = data.image;
          if (this.imgfor == "adhar_front")
            this.aadhar_card_image[0] = data.image;
          if (this.imgfor == "adhar_back")
            this.aadhar_card_image[1] = data.image;
          this.imgfor = "";
        } else {
          this.imgfor = "";
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
