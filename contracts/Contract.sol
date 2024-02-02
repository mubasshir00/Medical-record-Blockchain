// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

import "./Roles.sol";

contract Contract {
  using Roles for Roles.Role;

  Roles.Role private admin;
  Roles.Role private doctor;
  Roles.Role private patient;
  Roles.Role private insurance;

  struct Doctor {
    address id;
    string drHash;
  }

  struct Patient {
    address id;
    string patHash;
  }

  struct Insurance {
    address id;
    string insHash;
  }

  mapping(address => Doctor) Doctors;

  mapping(address => Patient) Patients;

  mapping(address => Insurance) Insurances;

  address[] public DrIDs;
  address[] public PatIds;
  address[] public InsIds;

  constructor() {
    admin.add(msg.sender);
  }

  //get Admin

  function isAdmin() public view returns (bool) {
    return admin.has(msg.sender);
  }

  //Add Doctor

  function addDrInfo(address dr_id, string memory _drInfo_hash) public {
    require(admin.has(msg.sender), "Only For Admin");

    Doctor storage drInfo = Doctors[dr_id];
    drInfo.id = dr_id;
    drInfo.drHash = _drInfo_hash;
    DrIDs.push(dr_id);

    doctor.add(dr_id);
  }

  function getAllDrs() public view returns (address[] memory) {
    return DrIDs;
  }

  function getDr(address _id) public view returns (string memory) {
    return (Doctors[_id].drHash);
  }

  // check is Doctor

  function isDr(address id) public view returns (bool) {
    return doctor.has(id);
  }
  
  function addPatInfo(address pat_id, string memory _patInfoHash) public {
    
    require(admin.has(msg.sender), "Only For Admin");

    Patient storage patInfo = Patients[pat_id];
    patInfo.id = pat_id;
    patInfo.patHash = _patInfoHash;
    PatIds.push(pat_id);

    patient.add(pat_id);
  }

  function getAllPatients() public view returns (address[] memory) {
    return PatIds;
  }

  function getPatients(address _id) public view returns (string memory) {
    return (Patients[_id].patHash);
  }


  //insurance

  function addInsuranceInfo(address ins_id, string memory _insInfo_Hash) public {
    require(admin.has(msg.sender), "Only For Admin");

    Insurance storage insInfo = Insurances[ins_id];

    insInfo.id = ins_id;
    insInfo.insHash = _insInfo_Hash;
    InsIds.push(ins_id);

    insurance.add(ins_id);

  }

  function getAllInsurances() public view returns (address[] memory) {
    return InsIds;
  }

  function getInsurances(address _id) public view returns (string memory) {
    return (Insurances[_id].insHash);
  }

}
