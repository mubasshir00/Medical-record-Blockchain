import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { PatientService } from 'src/admin/services/patient.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.sass'],
})
export class DashboardHomeComponent implements OnInit {
  DoctorDetails: any = {
    docID: '',
    fName: 'First Name',
    lName: 'Last Name',
    Doj: '',
    emailID: 'test_name@mail.com',
    phone: '123456789',
    city: 'city',
    state: 'state',
    speciality: 'speciality',
    imageHash: null,
  };

  constructor(private doctorService: DoctorService,private patientService:PatientService) {
    this.DoctorDetails = [];
  }

  ngOnInit(): void {
    // this.check();
    setTimeout(() => {
      this.getDoctorDetails();
    }, 3000);

    setTimeout(() => {
      this.getPatientDetails();
    }, 3000);
  }

  async getDoctorDetails() {
    this.doctorService.getDoctor().then((data: any) => {
      this.DoctorDetails = JSON.parse(data);
    });
  }

  async getPatientDetails() {
    this.patientService.getPatients().then((data: any) => {
      this.DoctorDetails = JSON.parse(data);
    });
  }
}
