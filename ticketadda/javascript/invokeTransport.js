// Import the required dependencies for the Hyperledger Fabric SDK
'use strict';
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function registerTransporter(firstName, lastName, email, password) {
    try {
      // Load the network configuration
      const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  
      // Create a new CA client for interacting with the CA.
      const caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
      const ca = new FabricCAServices(caURL);
  
      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);
  
      // Check to see if we've already enrolled the user.
      const userIdentity = await wallet.get(email);
      if (userIdentity) {
        console.log(`An identity for the user "${email}" already exists in the wallet`);
        return;
      }
  
      // Check to see if we've already enrolled the admin user.
      const adminIdentity = await wallet.get('admin2');
      if (!adminIdentity) {
        console.log('An identity for the admin user "admin2" does not exist in the wallet');
        console.log('Run the enrollAdmin2.js application before retrying');
        return;
      }
  
      // Build a user object for authenticating with the CA
      const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, 'admin');
  


      // Register the user, enroll the user, and import the new identity into the wallet.
      const secret = await ca.register({
        affiliation: 'org2.department1',
        enrollmentID: email,
        role: 'client',
        attrs: [
          { name: 'firstName', value: firstName, ecert: true },
          { name: 'lastName', value: lastName, ecert: true }
        ],
        maxEnrollments: 1
      }, adminUser);
      const enrollment = await ca.enroll({
        enrollmentID: email,
        enrollmentSecret: secret
      });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org2MSP',
        type: 'X.509',
      };
      await wallet.put(email, x509Identity);
      console.log(`Successfully registered and enrolled user "${email}" and imported it into the wallet`);
  
    } catch (error) {
      console.error(`Failed to register user "${email}": ${error}`);
      process.exit(1);
    }
  }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function createModeOfTransport( transportID, name, capacity, speed, source ,destination ,typeValue) {
    // Create a new gateway instance
    const gateway = new Gateway();

    try {
        // Connect to the gateway using a connection profile and wallet
        const connectionProfilePath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json'); // Replace with the actual path to your connection profile
        const walletPath = path.resolve(process.cwd(), 'wallet'); // Replace with the actual path to your wallet
        const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin2', // Replace with the actual identity name in your wallet
            discovery: { enabled: true, asLocalhost: true } // Replace with the appropriate discovery settings
        });

        // Get the network and contract from the gateway
        const network = await gateway.getNetwork('mychannel'); // Replace with the actual channel name
        const contract = network.getContract('ticketadda'); // Replace with the actual chaincode name

        // Invoke the createModeOfTransport function on the chaincode
        const result = await contract.submitTransaction('createModeOfTransport', transportID, name, capacity, speed, source ,destination ,typeValue);
        console.log(`Transaction result: ${result.toString()}`);
    } catch (error) {
        console.error(`Failed to invoke chaincode: ${error}`);
    } finally {
        // Disconnect from the gateway
        gateway.disconnect();
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////



async function deleteModeOfTransport(transportIDValue) {
    // Create a new gateway instance
    const gateway = new Gateway();

    try {
        // Connect to the gateway using a connection profile and wallet
        const connectionProfilePath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json'); // Replace with the actual path to your connection profile
        const walletPath = path.resolve(process.cwd(), 'wallet'); // Replace with the actual path to your wallet
        const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin2', // Replace with the actual identity name in your wallet
            discovery: { enabled: true, asLocalhost: true } // Replace with the appropriate discovery settings
        });

        // Get the network and contract from the gateway
        const network = await gateway.getNetwork('mychannel'); // Replace with the actual channel name
        const contract = network.getContract('ticketadda'); // Replace with the actual chaincode name

        // Invoke the deleteModeOfTransport function on the chaincode
        const result = await contract.submitTransaction('deleteModeOfTransport', transportIDValue);
        console.log(`Transaction result: ${result.toString()}`);
    } catch (error) {
        console.error(`Failed to invoke chaincode: ${error}`);
    } finally {
        // Disconnect from the gateway
        gateway.disconnect();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////



async function getTransportation(transportID) {
    // Create a new gateway instance
    const gateway = new Gateway();

    try {
        // Connect to the gateway using a connection profile and wallet
        const connectionProfilePath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json'); // Replace with the actual path to your connection profile
        const walletPath = path.resolve(process.cwd(), 'wallet'); // Replace with the actual path to your wallet
        const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin2', // Replace with the actual identity name in your wallet
            discovery: { enabled: true, asLocalhost: true } // Replace with the appropriate discovery settings
        });

        // Get the network and contract from the gateway
        const network = await gateway.getNetwork('mychannel'); // Replace with the actual channel name
        const contract = network.getContract('ticketadda'); // Replace with the actual chaincode name

        // Invoke the getTransportation function on the chaincode
        const result = await contract.evaluateTransaction('getTransportation',  transportID);
        console.log(`Transportation: ${result.toString()}`);
    } catch (error) {
        console.error(`Failed to invoke chaincode: ${error}`);
    } finally {
        // Disconnect from the gateway
        gateway.disconnect();
    }
}

////////////////////////////////////////////////////


async function updateTransportationDetails(transportID, name, capacity, speed, source, destination, type) {
    // Create a new gateway instance
    const gateway = new Gateway();

    try {
        // Connect to the gateway using a connection profile and wallet
        const connectionProfilePath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json'); // Replace with the actual path to your connection profile
        const walletPath = path.resolve(process.cwd(), 'wallet'); // Replace with the actual path to your wallet
        const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin2', // Replace with the actual identity name in your wallet
            discovery: { enabled: true, asLocalhost: true } // Replace with the appropriate discovery settings
        });

        // Get the network and contract from the gateway
        const network = await gateway.getNetwork('mychannel'); // Replace with the actual channel name
        const contract = network.getContract('ticketadda'); // Replace with the actual chaincode name

        const result = await contract.submitTransaction('updateTransportationDetails', transportID, name, capacity, speed, source, destination, type);
        console.log(`Transportation updated: ${result.toString()}`);
    } catch (error) {
        console.error(`Failed to invoke chaincode: ${error}`);
    } finally {
        // Disconnect from the gateway
        gateway.disconnect();
    }
}


///////////////////////////////////////////////////////////



// Function to invoke the chaincode
async function createTransportProvider(providerID, name, address, contact) {
    // Create a new gateway instance
    const gateway = new Gateway();

    try {
        // Connect to the gateway using a connection profile and wallet
        const connectionProfilePath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json'); // Replace with the actual path to your connection profile
        const walletPath = path.resolve(process.cwd(), 'wallet'); // Replace with the actual path to your wallet
        const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin2', // Replace with the actual identity name in your wallet
            discovery: { enabled: true, asLocalhost: true } // Replace with the appropriate discovery settings
        });

        // Get the network and contract from the gateway
        const network = await gateway.getNetwork('mychannel'); // Replace with the actual channel name
        const contract = network.getContract('ticketadda'); // Replace with the actual chaincode name

        const result = await contract.submitTransaction('createTransportProvider', providerID, name, address, contact);
        console.log(`Transportation provider created: ${result.toString()}`);
    } catch (error) {
        console.error(`Failed to invoke chaincode: ${error}`);
    } finally {
        // Disconnect from the gateway
        gateway.disconnect();
    }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to invoke the chaincode
async function deleteTransportProvider(providerIDValue) {
    // Create a new gateway instance
    const gateway = new Gateway();

    try {
        // Connect to the gateway using a connection profile and wallet
        const connectionProfilePath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json'); // Replace with the actual path to your connection profile
        const walletPath = path.resolve(process.cwd(), 'wallet'); // Replace with the actual path to your wallet
        const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        await gateway.connect(ccp, {
            wallet,
            identity: 'admin2', // Replace with the actual identity name in your wallet
            discovery: { enabled: true, asLocalhost: true } // Replace with the appropriate discovery settings
        });

        // Get the network and contract from the gateway
        const network = await gateway.getNetwork('mychannel'); // Replace with the actual channel name
        const contract = network.getContract('ticketadda'); // Replace with the actual chaincode name

        // Invoke the deleteTransportProvider function on the chaincode
        const result = await contract.submitTransaction('deleteTransportProvider', providerIDValue);
        console.log(`Transaction result: ${result.toString()}`);
    } catch (error) {
        console.error(`Failed to invoke chaincode: ${error}`);
    } finally {
        // Disconnect from the gateway
        gateway.disconnect();
    }
}

//////////////////////////////////////////////////////////////////////////////////////




  

// registerTransporter('Dinkar', 'Tewary', 'testid2', 'pw');

// createModeOfTransport('testid2', 'Bus1', '20', '40' , 'Kanpur', 'Delhi', 'bus');

// deleteModeOfTransport('testid2')
// getTransportation('testid2')

// updateTransportationDetails('jaintravels', 'Bus2', '30', '40' , 'Kanpur', 'Delhi', 'bus')

createTransportProvider("MRTravels", "jt", "Jodhpur", "1990")
// deleteTransportProvider("JainTravels")