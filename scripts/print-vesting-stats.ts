import dotenv from "dotenv";
import { ethers, network } from "hardhat";
import { TokenVesting } from "../types";
import moment from "moment";

dotenv.config();

const vestingConfigByChainId: Record<
  number,
  { vestingContractAddress: string; tokenAddress: string }
> = {
  4: {
    vestingContractAddress: "0x5199583fE33Dc85cc5D70a90eb05a36c5B522183",
    tokenAddress: "0xabD11d02F42690CC7996bCF336a765BB5268Fc95",
  },
};

async function printVestingStats() {
  console.log("network", process.env.HARDHAT_NETWORK);
  const vestingConfig = vestingConfigByChainId[network.config.chainId!];
  const vestingContract = (await ethers.getContractAt(
    "TokenVesting",
    vestingConfig.vestingContractAddress
  )) as TokenVesting;

  const beneficiary = await vestingContract.beneficiary();
  const startTimestamp = await vestingContract.start();
  const cliffTimestamp = await vestingContract.cliff();
  const durationInSecondsFromStart = await vestingContract.duration();
  const releasedAmount = await vestingContract.released(
    vestingConfig.tokenAddress
  );
  const startTime = moment.unix(startTimestamp.toNumber());
  const cliff = moment.unix(cliffTimestamp.toNumber());
  const endTime = startTime
    .clone()
    .add(durationInSecondsFromStart.toNumber(), "seconds");

  console.log(
    `Vesting contract on ${network.name} with address ${vestingConfig.vestingContractAddress}\n`
  );
  console.log(`beneficiary address ${beneficiary}`);
  console.log(`start time: ${startTime}`);
  console.log(`cliff time: ${cliff}`);
  console.log(`end time: ${endTime}`);
  console.log(`released amount: ${releasedAmount}`);
}

printVestingStats().catch((error) => {
  console.error(error.message, error);
  process.exit(1);
});
