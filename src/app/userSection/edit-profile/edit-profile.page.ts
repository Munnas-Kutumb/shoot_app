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
import { ModalController, ToastController } from "@ionic/angular";
declare var cordova: any;

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage implements OnInit {
  first_name: any = "";
  last_name: any = "";
  email: any = "";
  phone: any = "";
  servicedata: any = {};
  user: any;
  user_id: any;
  details: any = [];

  lastImage: string = null;
  image: any = "";
  baseUrl: any = "";

  constructor(
    private commonservice: CommonService,
    private router: Router,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalCtrl: ModalController,

    private camera: Camera,
    private actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    public platform: Platform
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.baseUrl = this.commonservice.serviceurl;
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user_id = this.user.user_id;
    this.getUserDetails();
  }

  backBtn() {
    this.router.navigateByUrl("/tabs/user-tabs/user-profile");
  }

  email_valid: boolean = false;

  checkEmail(val) {
    console.log(val);
    var re = /[^@]+@[^@]+\.[^@]+/;
    var check = re.test(this[val]);
    // console.log(check);
    this.email_valid = false;
    // console.log(!check );

    // if (!check) this.email_valid = true;
    
  }

  getUserDetails() {
    this.servicedata = {
      user_id: this.user_id,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("user/getUserById", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data.response);
          this.details = data.response;
          this.first_name = data.response.first_name;
          this.last_name = data.response.last_name;
          this.email = data.response.email;
          this.phone = data.response.phone;
          this.image = data.response.image;
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }

  updateUserDetails() {
    this.commonservice.setHeaders();
    var re = /[^@]+@[^@]+\.[^@]+/;
    if( !re.test(this.email)){
      alert("Please enter valid email.");
      return;
    }

    this.servicedata = {
      user_id: this.user_id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      image: this.image,
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("user/updatePersonalDetails", this.servicedata)
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

  async uploadImg() {
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
    var url = this.commonservice.serviceurl + "user/upload_image";
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
          this.image = data.image;
          //  this.uploadProfileImage();
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
