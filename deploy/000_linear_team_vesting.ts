import { HardhatRuntimeEnvironment } from "hardhat/types";
import moment from "moment";

// constructor (address beneficiary, uint256 start, uint256 cliffDuration, uint256 duration, bool revocable) public {

const beneficiary = process.env.BENEFICIARY;
const start = moment().add(30, "minutes");
const cliff = start.clone().add(20, "minute").diff(start, "seconds");
const duration = start.clone().add(2, "hours").diff(start, "seconds");

export default async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const { args } = await deploy("TokenVesting", {
    from: deployer,
    log: true,
    deterministicDeployment: false,
    args: [beneficiary, start.unix(), cliff, duration, false],
  });
  console.log("deployed team vesting contract with args", JSON.stringify(args));
}
