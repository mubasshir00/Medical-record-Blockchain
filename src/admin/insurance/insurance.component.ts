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

  onSubmit() {
    this.show = true;
    this.msg_text = 'Adding Insurance to the Network...';
    console.log(this.model);
    this.checkAddProgress();
    this.warn = false;
    this.success = false;
    this.insuranceService
      .addInsurance(this.model.patID, this.model)
      .then((r: any) => {
        this.success = true;
        this.msg_text = 'Data added to IPFS...';
        this.msg_text += '<br>User Added to the Blockchain';
        console.log('User added Successfully');

        this.model = {};
      })
      .catch((er: any) => {
        this.warn = true;
        this.msg_text =
          'Adding Doctor Failed<br> <small class="fw-light text-danger"><b>"</b>' +
          this.model.docID +
          '<b>"</b></small><br>1.not a valid address or <br>2.Already have a role';
        console.log(er);
      });
  }

  checkAddProgress() {
    console.log('Checking progress');

    let checkProgress = setInterval(() => {
      if (this.insuranceService.added) {
        this.msg_text = 'Patient Added to the network';
        this.success = true;
        clearInterval(checkProgress);
      }
      if (this.insuranceService.failed) {
        this.warn = true;
        this.msg_text = 'Patient adding Failed';
        clearInterval(checkProgress);
      }
    }, 500);
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

  onClose() {
    this.show = false;
    this.warn = false;
  }
}
