import { ethers } from "hardhat";
import { getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  
  console.log("🌱 Debugging NGODonations contract...");
  console.log("Deployer:", deployer);

  // Obtener la instancia del contrato desplegado
  const donationsAddress = await getDeployedContractAddress("NGODonations");
  if (!donationsAddress) {
    console.error("❌ NGODonations contract not found. Please deploy it first.");
    console.log("💡 Run: yarn deploy --tags Donations");
    return;
  }

  const donationsContract = await ethers.getContractAt("NGODonations", donationsAddress);
  console.log("✅ Contract instance created at:", donationsAddress);

  // Obtener información básica del contrato
  const owner = await donationsContract.owner();
  const nextProjectId = await donationsContract.nextProjectId();
  
  console.log("\n📋 Contract Info:");
  console.log("Owner:", owner);
  console.log("Next Project ID:", nextProjectId.toString());

  // Crear un proyecto de prueba
  console.log("\n🌿 Creating a test project...");
  
  try {
    const createProjectTx = await donationsContract.createProject(
      "Rescate de Árboles en Córdoba",
      "Fundación Verde Córdoba",
      deployer, // NGO wallet (usar deployer para testing)
      ethers.utils.parseEther("100") // 100 ETH target
    );
    
    console.log("⏳ Creating project...");
    await createProjectTx.wait();
    console.log("✅ Test project created successfully!");
    
    // Obtener el ID del proyecto creado
    const projectId = await donationsContract.nextProjectId() - 1;
    console.log("Project ID:", projectId.toString());
    
    // Obtener información del proyecto
    const project = await donationsContract.getProject(projectId);
    console.log("\n📋 Project Details:");
    console.log("Name:", project.projectName);
    console.log("NGO:", project.ngoName);
    console.log("Target Amount:", ethers.utils.formatEther(project.targetAmount), "ETH");
    console.log("Raised Amount:", ethers.utils.formatEther(project.raisedAmount), "ETH");
    console.log("Active:", project.active);
    console.log("Created At:", new Date(project.createdAt.toNumber() * 1000).toLocaleString());
    
    // Hacer una donación de prueba
    console.log("\n💰 Making a test donation...");
    
    const donationTx = await donationsContract.donateToProject(
      projectId,
      "Test Donor",
      "¡Salvemos los árboles de Córdoba!",
      { value: ethers.utils.parseEther("0.1") } // 0.1 ETH donation
    );
    
    console.log("⏳ Processing donation...");
    await donationTx.wait();
    console.log("✅ Test donation successful!");
    
    // Verificar el estado actualizado del proyecto
    const updatedProject = await donationsContract.getProject(projectId);
    console.log("\n📊 Updated Project Status:");
    console.log("Raised Amount:", ethers.utils.formatEther(updatedProject.raisedAmount), "ETH");
    
    // Obtener las donaciones del proyecto
    const donations = await donationsContract.getProjectDonations(projectId);
    console.log("\n🎁 Project Donations:");
    donations.forEach((donation, index) => {
      console.log(`Donation ${index + 1}:`);
      console.log(`  Amount: ${ethers.utils.formatEther(donation.amount)} ETH`);
      console.log(`  Donor: ${donation.donorName} (${donation.donorAddress})`);
      console.log(`  Message: ${donation.message}`);
      console.log(`  Time: ${new Date(donation.time.toNumber() * 1000).toLocaleString()}`);
    });

    // Probar función de retiro (solo owner puede retirar)
    console.log("\n💸 Testing withdrawal function...");
    
    try {
      const withdrawTx = await donationsContract.withdrawFunds(projectId);
      console.log("⏳ Processing withdrawal...");
      await withdrawTx.wait();
      console.log("✅ Withdrawal successful!");
      
      // Verificar estado final
      const finalProject = await donationsContract.getProject(projectId);
      console.log("Final Raised Amount:", ethers.utils.formatEther(finalProject.raisedAmount), "ETH");
      
    } catch (error) {
      console.log("⚠️ Withdrawal failed (expected if not owner):", error.message);
    }
    
  } catch (error) {
    console.error("❌ Error during contract interaction:", error);
  }

  // Mostrar comandos útiles para debug
  console.log("\n🔧 Debug Commands:");
  console.log("1. Check contract on Hardhat:");
  console.log("   npx hardhat console");
  console.log("   const contract = await ethers.getContractAt('NGODonations', '", donationsAddress, "')");
  console.log("");
  console.log("2. View contract events:");
  console.log("   const events = await contract.queryFilter('ProjectCreated')");
  console.log("   const donations = await contract.queryFilter('DonationReceived')");
  console.log("");
  console.log("3. Test specific functions:");
  console.log("   await contract.owner()");
  console.log("   await contract.nextProjectId()");
  console.log("   await contract.getProject(0)");
}

// Función auxiliar para obtener la dirección del contrato desplegado
async function getDeployedContractAddress(contractName: string): Promise<string | null> {
  try {
    const { deployments } = await import("hardhat");
    const deployment = await deployments.get(contractName);
    return deployment.address;
  } catch (error) {
    return null;
  }
}

// Función para mostrar comandos útiles
function showHelpfulCommands() {
  console.log("\n🔧 Helpful Commands:");
  console.log("1. Deploy contract:");
  console.log("   yarn deploy --tags Donations");
  console.log("   yarn deploy --tags Donations --network localhost");
  console.log("");
  console.log("2. Run this debug script:");
  console.log("   npx hardhat run scripts/debug-donations.ts");
  console.log("   npx hardhat run scripts/debug-donations.ts --network localhost");
  console.log("");
  console.log("3. Hardhat console for manual testing:");
  console.log("   npx hardhat console");
  console.log("   npx hardhat console --network localhost");
  console.log("");
  console.log("4. Run tests:");
  console.log("   yarn test");
  console.log("   yarn test test/Donations.test.ts");
}

main()
  .then(() => {
    console.log("\n🎉 Debug script completed successfully!");
    showHelpfulCommands();
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Debug script failed:", error);
    process.exit(1);
  });
