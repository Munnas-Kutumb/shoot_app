import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/service/commonservice";

@Component({
  selector: "app-report",
  templateUrl: "./report.page.html",
  styleUrls: ["./report.page.scss"],
})
export class ReportPage implements OnInit {
  constructor(private commonservice: CommonService) {}

  m_id: any;
  servicedata: any;
  ngOnInit() {
    this.m_id = JSON.parse(localStorage.getItem("merchant"));
  }

  getRepotsStat() {
    this.servicedata = {
      query: { merchant_id: this.m_id, booking_status: "completed" },
    };

    this.commonservice.waitloadershow();

    this.commonservice
      .serverdatapost("booking/bookingCountByQuery", this.servicedata)
      .subscribe(
        (res) => {
          this.commonservice.waitloaderhide();
          let data: any = res;
          // this.status = data.response
          // console.log(this.status);
          //  this.bankdetails = this.status.bank_detail_status
          //  this.businessDetails = this.status.business_detail_status
          //  this.onBoardingDoc = this.status.identity_proof_detail_status
        },

        (error) => {
          console.log(error);
          this.commonservice.waitloaderhide();
          this.commonservice.toastalert("Something went wrong!");
        }
      );
  }
}
