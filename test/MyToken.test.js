const Token = artifacts.require('MyToken');

const chai = require('./setupchai.js');
const BN = web3.utils.BN;

const expect = chai.expect;
require('dotenv').config({ path: '../.env' });

contract('Token test', async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    this.myToken = await Token.new(process.env.INITIAL_TOKENS);
  });

  it('all tokens should be in my account', async () => {
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    // let balance = await instance.balanceOf(accounts[0]);
    // assert.equal(
    //   balance.valueOf(),
    //   initialSupply.valueOf(),
    //   'The balance was not the same'
    // );
    // expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(
    //   totalSupply
    // );
    return expect(
      await instance.balanceOf(accounts[0])
    ).to.be.a.bignumber.equal(totalSupply);
  });

  it('is possible to send tokens between accounts', async () => {
    const sendTokens = 1;
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    expect(await instance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(
      totalSupply
    );
    expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
  });

  it('is NOT possible to send more tokens than available in total', async () => {
    let instance = this.myToken;
    let balanceOfDeployer = await instance.balanceOf(deployerAccount);

    expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    return expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1)))
      .to.eventually.be.rejected;
  });
});
