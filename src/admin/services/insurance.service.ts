import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPFSHTTPClient } from 'ipfs-http-client/dist/src/types';
import { BlockchainService } from "src/services/blockchain.service";
import { IpfsService } from "src/services/ipfs.service";
import { IPFS } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class InsuranceSerivce {
  web3: any;
  contract: any;
  account: any;

  ipfs: IPFSHTTPClient;

  addprogress: boolean = false;
  added: boolean = false;
  failed: boolean = false;

  Insurances: any;
  InsuranceDetails: any = [];

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

  addInsurance(insurance_id: any, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bs.getContract().then((c) => {
        this.bs.getCurrentAccount().then((a) => {
          this.addRecord(data).then((ipfsHash) => {
            c.methods
              .addPatInfo(insurance_id, ipfsHash)
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

  getInsuranceDetails(patId: any): Promise<any> {
    return new Promise((resolve) => {
      this.bs.getContract().then((contract: any) => {
        contract.methods
          .getPatients(patId)
          .call()
          .then((ipfsHash: string) => {
            this.http
              .get(IPFS.localIPFSGet + ipfsHash)
              .subscribe((data: any) => {
                console.log(data);
                resolve(data);
              });
          });
      });
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

  getInsurances(): Promise<any> {
    return new Promise((resolve) => {
      this.bs.getContract().then((c: any) => {
        this.Insurances = c.methods
          .getAllInsurances()
          .call()
          .then((docs: any) => {
            this.Insurances = docs;
            console.log(this.Insurances);
            resolve(this.Insurances);
          });
      });
    });
  }

  loadInsuranceDetails() {
    this.InsuranceDetails = [];
    for (var i = 0; i <= this.Insurances.length; i++) {
      if (this.Insurances[i])
        this.getInsuranceDetails(this.Insurances[i]).then((data: any) => {
          this.InsuranceDetails.push(data);
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