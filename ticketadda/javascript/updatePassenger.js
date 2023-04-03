'use strict';


const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const { Context } = require('mocha');
const path = require('path');

async function updatePassenger(passengerId, name, age, gender) {
  try {
    // Load connection profile; will be used to locate a gateway
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user
    const identity = await wallet.get(passengerId);
    if (!identity) {
      console.log(`An identity for the user ${passengerId} does not exist in the wallet`);
      console.log('Run the registerUser.js application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: passengerId,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the network (channel) our contract is deployed to
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network
    const contract = network.getContract('ticketadda');

    // Submit the transaction to the network
    await contract.submitTransaction('updatePassenger', passengerId, name, age, gender, true);
    // ===============================Delete later======================================
    // await contract.submitTransaction('createTransportProvider', 'Bus1', 'Aditya', 'Bus', 'delhi to goa', 100)
    console.log(`Passenger ${passengerId} has been updated`);
    // console.log(`Transporatation has been created`);

    // Disconnect from the gateway
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to update passenger: ${error}`);
    process.exit(1);
  }
}

// Call the createPassenger function
updatePassenger('deepakraj@example.com', 'Deepak Raj', 24, 'male');
