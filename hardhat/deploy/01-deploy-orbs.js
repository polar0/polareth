const { network, ethers } = require('hardhat');
const {
  developmentChains,
  attributes,
  expansionCooldown,
  description,
  backgroundColor,
  externalUrl,
  animationUrl,
  price,
  mintLimit,
  maxSupply,
  maxSupplyMock,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');

module.exports = async function({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [
    attributes[0],
    attributes[1],
    attributes[2],
    attributes[3],
    animationUrl,
    description,
    externalUrl,
    backgroundColor,
    expansionCooldown,
    [
      price,
      mintLimit,
      developmentChains.includes(network.name) ? maxSupplyMock : maxSupply,
    ],
  ];

  const orbs = await deploy('OrbsContract', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log('Verifying contract...');
    await verify(orbs.address, args);
  }
};

module.exports.tags = ['all', 'orbs', 'main'];
