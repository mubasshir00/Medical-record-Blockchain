import { Component, OnInit } from '@angular/core';
import { InsuranceSerivce } from '../services/insurance.service';


@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.sass'],
})
export class InsuranceComponent implements OnInit {
  model: any = {
    insuranceId: '',
    fName: 'test_name',
    lName: 'test_name',
    phone: '123456789',
    city: 'city',
    state: 'state',
  };

  Insurances: string[] = [];
  InsuranceDetails: any = [];

  show: boolean = false;
  msg_text: string = '';
  warn: boolean = false;
  success: boolean = false;
  progressMsg: string = '';

  showProgressCard: boolean = false;

  ipfs: any;

  constructor(private insuranceService: InsuranceSerivce) {}

  ngOnInit(): void {
    this.GetInsurances();
  }

  loadInsuranceDetails() {
    console.log(this.Insurances);
    this.InsuranceDetails = [];
    for (var i = 0; i <= this.Insurances.length; i++) {
      if (this.Insurances[i])
        this.insuranceService
          .getInsuranceDetails(this.Insurances[i])
          .then((data: any) => {
            this.InsuranceDetails.push(data);
          });
    }
    this.progressMsg = '';
    this.showProgressCard = false;
  }

  GetInsurances(): any {
    this.showProgressCard = true;

    this.InsuranceDetails = [];

    if (this.InsuranceDetails.length >= 1) {
      this.showProgressCard = false;
      return 0;
    }

    this.insuranceService.getInsurances().then((pt: any) => {
      this.Insurances = pt;

      if (this.Insurances.length >= 1) {
        this.loadInsuranceDetails();
        this.progressMsg = 'Found' + this.Insurances.length + ' Accounts';
      } else {
        this.progressMsg = 'No Insurances in the Network....';
        this.showProgressCard = false;
      }
    });
  }
}
