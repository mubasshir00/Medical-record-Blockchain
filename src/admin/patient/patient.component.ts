import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.sass'],
})
export class PatientComponent implements OnInit {
  model: any = {
    patID: '',
    fName: 'test_name',
    lName: 'test_name',
    phone: '123456789',
    city: 'city',
    state: 'state',
  };

  show: boolean = false;
  msg_text: string = '';
  warn: boolean = false;
  success:boolean = false

  ipfs: any;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.show = true
    this.msg_text = "Adding Patient to the Network..."
    console.log(this.model);
    this.checkAddProgress()
    this.warn = false;
    this.success = false;
    this.patientService
      .addPatient(this.model.patID, this.model)
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

  checkAddProgress(){
    console.log("Checking progress");
    
    let checkProgress = setInterval(() => {
      if(this.patientService.added){
        this.msg_text = "Patient Added to the network"
        this.success = true
        clearInterval(checkProgress)
      }
      if(this.patientService.failed){
        this.warn = true
        this.msg_text = "Patient adding Failed"
        clearInterval(checkProgress)
      }
    },500)
  }

  onClose() {
    this.show = false
    this.warn = false
  }
}
