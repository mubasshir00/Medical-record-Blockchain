// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21;

import "./Roles.sol";

contract Contract {
  using Roles for Roles.Role;

  Roles.Role private admin;
  Roles.Role private doctor;
  Roles.Role private patient;

  struct Doctor {
    address id;
    string drHash;
  }

    struct Patient {
    address id;
    string patHash;
  }

  mapping(address => Doctor) Doctors;

  mapping(address => Patient) Patients;

  address[] public DrIDs;
  address[] public PatIds;

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
        require(admin.has(msg.sender) == true, 'Only you Can Add your info ');
        Patient storage patInfo = Patients[pat_id];
        patInfo.id = pat_id;
        patInfo.patHash = _patInfoHash;
        PatIds.push(pat_id);

        patient.add(pat_id);
    }

  

}
