import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  Platform,
  PopoverController,
} from "@ionic/angular";
import { CommonService } from "src/service/commonservice";
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
  selector: "app-product-details",
  templateUrl: "./product-details.page.html",
  styleUrls: ["./product-details.page.scss"],
})
export class ProductDetailsPage implements OnInit {
  name: any;
  no_of_print: any;
  charges: any;
  discount: any = 0;
  print_type: any = "Not Applicable";

  album: any = [];
  lastImage: string = null;

  sizeCard: any = [
    {
      size: "",
      price: "",
    },
  ];

  description: any = "";
  delivery_day: any;
  embossing: any = "Not Applicable";

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private commonservice: CommonService,
    public alertController: AlertController,
    private actionSheetController: ActionSheetController,
    public platform: Platform,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    private ngzone: NgZone
  ) {}

  merchant_id: any;
  subcatId: any;
  subcatName: any = "";
  catId: any;

  product_id: any;
  procatName: any;
  cat_name: any = "";
  city:any;

  ngOnInit() {}

  ionViewWillEnter() {
    this.getProductSize();
    this.merchant_id = localStorage.getItem("merchant_id");
    this.catId = localStorage.getItem("mainCategoryId");
    this.subcatId = localStorage.getItem("mainSubCategoryId");
    this.subcatName = localStorage.getItem("subcatName");
    this.procatName = localStorage.getItem("prosub_name");
    this.city= JSON.parse(localStorage.getItem('merchant')).city?.name;

    console.log(this.city);
    
    // this.product_id=localStorage.getItem('mainSubCategoryId');
    // console.log(this.product_id);

    if (localStorage.getItem("editproduct")) {
      let data = JSON.parse(localStorage.getItem("editproduct"));
      this.product_id = data._id;
      this.name = data.name;
      this.no_of_print = data.prints;
      this.album = data.image;
      this.subcatName = localStorage.getItem("subcatName");

      this.charges = parseInt(data.delivery_charge);
      this.discount = parseInt(data.discount);
      this.description = data.description;
      this.print_type = data.print_type;
      this.delivery_day = data.delivery_day;
      this.embossing = data.embossing;
      // this.city=data.city
    } else {
      // this.product_id = "";
      this.name = "";
      this.no_of_print = "";
      this.album = [];
      this.sizeCard = [
        {
          size: "",
          price: "",
        },
      ];
      this.charges = "";
      this.discount = 0;
      this.description = "";
      this.print_type = "Not Applicable";
      this.delivery_day = "";
      this.embossing = "Not Applicable";
    }
  }

  backBtn() {
    if (localStorage.traceback == "selected-services")
      this.router.navigateByUrl("/merchent-services-list");
    else this.router.navigateByUrl("/product-list");
  }

  addMoreSize() {
    this.sizeCard.push({ size: "", price: "" });
  }

  servicedata: any;

  addProduct() {
    // alert(JSON.parse(localStorage.getItem('merchant')).city)
    this.commonservice.setHeaders();
    this.servicedata = {
      merchant_id: this.merchant_id,
      category_id: this.catId,
      subcategory_id: this.subcatId,
      name: this.name,
      prints: this.no_of_print,
      image: this.album,
      price: this.sizeCard,
      delivery_charge: this.charges,
      discount: this.discount,
      print_type: this.print_type,
      description: this.description,
      delivery_day: this.delivery_day,
      embossing: this.embossing,
      city: JSON.parse(localStorage.getItem('merchant')).city?.name

      // product_id:this.subcatId
    };

    let service = "addproduct";

    if (this.product_id) {
      this.servicedata.product_id = this.product_id;
      service = "updateproduct";
    } else {
      this.servicedata.product_id = this.subcatId;
    }

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("product/" + service, this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          console.log(data);
          if (data.status) {
            this.commonservice.toastalert(data.message );
            this.backBtn();
          } else this.commonservice.toastalert(data.message);
        },
        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
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
          this.album.push(data.image);
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

  async removeImage(index) {
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
                    if (this.product_id) this.addProduct();
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

  productSize: any = [];
  getProductSize() {
    this.commonservice.setHeaders();
    // this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("product_size/getallproduct_size", this.servicedata)
      .subscribe(
        (res) => {
          //  this.commonservice.waitloaderhide();
          let data: any = res;

          if (localStorage.getItem("editproduct")) {
            let data = JSON.parse(localStorage.getItem("editproduct"));
            // this.sizeCard = data.price;
            this.sizeCard = data.price.filter(
              (item) => item.size && item.price
            );
            console.log(this.sizeCard);
          }

          this.ngzone.run(() => {
            this.productSize = data.response;
          });
        },

        (error) => {
          console.log(error);
          //  this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }
}
