import { Injectable } from "@angular/core";
import {
  AlertController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { Network } from '@awesome-cordova-plugins/network/ngx';

var httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loading: any;

  // serviceurl: any = "http://35.154.180.245:7001/";
  serviceurl: any = "http://192.168.122.90:7001/";

  servicedataformated: any;

  loadingstatus: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public http: HttpClient,
    public network: Network
  ) {
    // console.log(localStorage.getItem("token"));
  }

  filterBS = new BehaviorSubject("");

  setHeaders() {
    if (localStorage.getItem("token")) {
      console.log("setting headers");
      httpOptions = {
        headers: new HttpHeaders({
          Enctype: "multipart/form-data",
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        }),
      };
    } else {
      console.log("nothing");
    }
  }

  async erroralert(msg) {
    let alerterror = await this.alertCtrl.create({
      header: "Error!",
      message: msg,
      buttons: [
        {
          text: "Ok",
          role: "cancel",
          handler: () => {
            //console.log('Ok clicked');
          },
        },
      ],
    });
    await alerterror.present();
  }

  async successalert(msg) {
    let alerterror = await this.alertCtrl.create({
      header: "success!",
      message: msg,
      buttons: [
        {
          text: "Ok",
          role: "cancel",
          handler: () => {
            //console.log('Ok clicked');
          },
        },
      ],
    });
    await alerterror.present();
  }

  async showAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: "Message",
      message: msg,
      buttons: ["OK"],
    });
    await alert.present();
  }

  async toastalert(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom",
    });

    // toast.onDidDismiss(() => {
    //   console.log('Dismissed toast');
    // });
    toast.onDidDismiss().then(() => {
      console.log("Dismissed toast");
    });

    await toast.present();
  }

  /////////////////////////////////////
  async waitloadershow() {
    this.loadingstatus = true;
    return await this.loadingCtrl
      .create({
        duration: 10000,
        // message: "Loading",
        spinner: "bubbles"
      })
      .then((a) => {
        a.present().then(() => {
          console.log("presented");
          if (!this.loadingstatus) {
            a.dismiss().then(() => console.log("abort presenting"));
          }
        });
      });
  }

  async waitloaderhide() {
    this.loadingstatus = false;
    return await this.loadingCtrl
      .dismiss()
      .then(() => console.log("dismissed"));
  }
  /////////////////////////////////////

  // async waitloaderimageshow() {
  //   const loading = await this.loadingCtrl.create({
  //     message: "Please wait ...",
  //     duration: 10000,
  //   });
  //   await loading.present();
  // }

  serverdata(serviceurl, servicedata) {

    if (!this.networkCheck()) {
      if (servicedata.length > 0) {
        let i = 0;
        console.log(servicedata);

        for (let obj of servicedata) {
          for (let key in obj) {
            console.log(key);
            if (i == 0) {
              this.servicedataformated = serviceurl + "?" + key + "=" + obj[key];
              // this.servicedataformated=obj[key];
            } else {
              this.servicedataformated += "&" + key + "=" + obj[key];
            }
            i++;
          }
        }
      } else {
        this.servicedataformated = serviceurl;
      }

      return this.http.get(
        this.serviceurl + this.servicedataformated,
        httpOptions
      );
    }
    else this.toastalert('Please check your internet connection.')
  }

  serverdatapost(service, servicedata) {
    console.log(this.networkCheck());

    if (!this.networkCheck()) {
      return this.http.post(this.serviceurl + service, servicedata, httpOptions);
    }
    else this.toastalert('Please check your internet connection.')
  }

  serverdatadelete(service) {
    return this.http.delete(this.serviceurl + service, httpOptions);
  }

  httpOptions1 = {
    headers: new HttpHeaders({
      enctype: "multipart/form-data",
    }),
  };

  serverdatapostimage(service, servicedata) {
    return this.http.post(
      this.serviceurl + service,
      servicedata,
      this.httpOptions1
    );
  }

  imageSetHeaders() {
    if (localStorage.getItem("token")) {
      this.httpOptions1 = {
        headers: new HttpHeaders({
          enctype: "multipart/form-data",
          AppToken: "3bb743bbd45d4eb8ae31e16b9f83c9",
          token: localStorage.getItem("token"),
        }),
      };
    }
  }

  disconnected: boolean = false;
  // watch network for a disconnection
  networkCheck() {
    console.log("network function working");

    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.toastalert('Please check your internet connection.')
      this.disconnected = true;

    });
    this.network.onConnect().subscribe(() => {
      this.disconnected = false;
    })
    return this.disconnected;
  }
}
