import hre, { ethers } from 'hardhat';

async function main() {
  const HMToken = await ethers.getContractFactory('HMToken');
  const tokenContract = await HMToken.deploy(
    1000000000,
    'Human Token',
    18,
    'HMT'
  );
  await tokenContract.deployed();
  console.log('HMToken Address: ', tokenContract.address);

  const EscrowFactory = await ethers.getContractFactory('EscrowFactory');
  const escrowFactoryContract = await EscrowFactory.deploy(
    tokenContract.address
  );
  await escrowFactoryContract.deployed();
  console.log('Escrow Factory Address: ', escrowFactoryContract.address);

  const Staking = await ethers.getContractFactory('Staking');
  const stakingContract = await Staking.deploy(
    tokenContract.address, // Token
    escrowFactoryContract.address, // EscrowFactory
    1,
    1
  );
  await stakingContract.deployed();
  console.log('Staking Contract Address:', stakingContract.address);

  const RewardPool = await ethers.getContractFactory('RewardPool');
  const rewardPoolContract = await RewardPool.deploy(
    tokenContract.address, // Token
    stakingContract.address,
    1
  );
  await rewardPoolContract.deployed();
  console.log('Reward Pool Contract Address:', rewardPoolContract.address);

  // Configure Staking in EscrowFactory
  await escrowFactoryContract.setStaking(stakingContract.address);

  // Configure RewardPool in Staking
  await stakingContract.setRewardPool(rewardPoolContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
