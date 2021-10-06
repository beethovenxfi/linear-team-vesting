import { HardhatRuntimeEnvironment } from "hardhat/types";
import moment from "moment";

const beneficiary = process.env.BENEFICIARY;
const start = moment("2021-10-09 12:00");
const cliff = 0;
const duration = start.clone().add(4, "years").diff(start, "seconds");

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
