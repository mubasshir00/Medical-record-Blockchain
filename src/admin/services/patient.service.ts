import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPFSHTTPClient } from 'ipfs-http-client/dist/src/types';
import { BlockchainService } from 'src/services/blockchain.service';
import { IpfsService } from 'src/services/ipfs.service';
import { Buffer } from "buffer";
import { IPFS } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  web3: any;
  contract: any;
  account: any;

  ipfs: IPFSHTTPClient;

  addprogress: boolean = false;
  added: boolean = false;
  failed: boolean = false;

  Patients: any;
  PatientDetails: any = [];

  progressMsg: string = '';
  showProgressCard: boolean = false;

  constructor(
    private bs: BlockchainService,
    ipfsService: IpfsService,
    private http: HttpClient
  ) {
    this.contract = bs.getContract().then((c: any) => {
      return c;
    });
    this.progressMsg = 'Loading Doctor Accounts From Blockchain';
    this.ipfs = ipfsService.getIPFS();
  }

  // addPatient(pat_id: any, data: any) {
  //   console.log("adding Patient");
  //   this.contract = this.blockchainService.getContract()

  //   this.ipfs.addJSON(data).then((IPFSHash: any) => {
  //     console.log("IPFS hash : ",IPFSHash);
  //     this.contract.methods
  //       .addPatInfo(pat_id, IPFSHash)
  //       .send({ from: this.account })
  //       .on("confirmation",(result: any) => {
  //         console.log("result",result);
  //         if(result){
  //           this.addprogress = true
  //           this.added = true
  //         }
  //       })
  //       .catch((err: any) => {
  //         console.log("error",err);
  //         this.addprogress = true
  //         this.added = false
  //         this.failed = true
  //       });
  //   });
  // }

  addPatient(pat_id: any, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bs.getContract().then((c) => {
        this.bs.getCurrentAccount().then((a) => {
          this.addRecord(data).then((ipfsHash) => {
            c.methods
              .addPatInfo(pat_id, ipfsHash)
              .send({ from: a })
              .on('confirmation', (result: any) => {
                if (result) {
                  resolve(result);
                }
                reject(false);
              })
              .catch((err: any) => {
                reject(false);
              });
          });
        });
      });
    });
  }

  getPatientDetails(patId: any): Promise<any> {
    return new Promise((resolve) => {
      this.bs.getContract().then((contract:any)=>{
        contract.methods.getPatients(patId).call().then((ipfsHash: string)=>{
          this.http.get(IPFS.localIPFSGet + ipfsHash).subscribe((data: any) => {
            console.log(data);
            resolve(data);
          });
        });
      })
    });
  }

  getAcccount() {
    console.log('geting Account...');
    let getacc = setInterval(() => {
      this.account = this.bs.getAccount();
      if (this.account != null) {
        clearInterval(getacc);
        return this.account;
      }
    }, 1000);
  }

  getPatients(): Promise<any> {
    return new Promise((resolve) => {
      this.bs.getContract().then((c: any) => {
        this.Patients = c.methods
          .getAllPatients()
          .call()
          .then((docs: any) => {
            this.Patients = docs;
            console.log(this.Patients);
            resolve(this.Patients);
          });
      });
    });
  }

  loadPatientDetails() {
    this.PatientDetails = [];
    for (var i = 0; i <= this.Patients.length; i++) {
      if (this.Patients[i])
        this.getPatientDetails(this.Patients[i]).then((data: any) => {
          this.PatientDetails.push(data);
        });
    }
    this.progressMsg = '';
    this.showProgressCard = false;
  }

  async addRecord(data: any) {
    let IPFSHash = await (
      await this.ipfs.add(Buffer.from(JSON.stringify(data)))
    ).path;
    return IPFSHash;
  }
}
