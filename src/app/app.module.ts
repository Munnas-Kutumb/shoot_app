import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CalendarModule } from "ion2-calendar";
import { CommonService } from "src/service/commonservice";

import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

// import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { CallNumber } from "@ionic-native/call-number/ngx";
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import { DatePipe } from "@angular/common";

import {FCM} from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Network, } from '@awesome-cordova-plugins/network/ngx';


// import { SearchfilterPipe } from './searchfilter.pipe';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({mode: 'md'}),
    AppRoutingModule,
    CalendarModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CommonService,
    Camera,
    FileTransfer,
    File,
    FilePath,
    SocialSharing,
    Clipboard,
    Geolocation,
    CallNumber,
    InAppBrowser,
    DatePipe,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PhotoViewer,
    Network
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
// NativeGeocoder,
