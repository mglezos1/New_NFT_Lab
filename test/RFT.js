const { time } = require('@openzeppelin/test-helpers');
const { assert } = require("console");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const RFT = artifacts.require('RFT.sol');
const NFT = artifacts.require('NFT.sol');
const DAI = artifacts.require('DAI.sol');

const DaiAmount = web3.utils.toWei('25000');

contract('RFT', async addresses =>{
    const [admin, buyer1, buyer2, buyer3, buyer4, _] = addresses;

    it('should work', async() =>{
        const daicoin = await DAI.new();
        const nft = await NFT.new('My awesome NFT', 'NFT');
        await nft.mint(admin, 1);
        await Promise.all([
            daicoin.mint(buyer1, DaiAmount),
            daicoin.mint(buyer2, DaiAmount),
            daicoin.mint(buyer3, DaiAmount),
            daicoin.mint(buyer4, DaiAmount),
        ]);
        const rft = await RFT.new(
            'My RFT',
            "RFT",
            nft.address,
            1,
            1,
            web3.uitls.toWei('100000'),
            dai.address
        );
        await nft.approve(rft.address, 1);
        await rft.startIco();

        await daicoin.approve(rft.address, DaiAmount, {from: buyer1});
        await rft.purchaseShare(shareAmount, {from: buyer1});
        await daicoin.approve(rft.address, DaiAmount, {from: buyer2});
        await rft.purchaseShare(shareAmount, {from: buyer2});
        await daicoin.approve(rft.address, DaiAmount, {from: buyer3});
        await rft.purchaseShare(shareAmount, {from: buyer3});
        await daicoin.approve(rft.address, DaiAmount, {from: buyer4});
        await rft.purchaseShare(shareAmount, {from: buyer4});

        await time.increase(7 * 86400 + 1);
        await rft.withdrawProfits();

        const shareBuyer1 = rft.balanceOf(buyer1);
        const shareBuyer2 = rft.balanceOf(buyer2);
        const shareBuyer3 = rft.balanceOf(buyer3);
        const shareBuyer4 = rft.balanceOf(buyer4);
        assert(shareBuyer1.toString()=== shareAmount);
        assert(shareBuyer2.toString()=== shareAmount);
        assert(shareBuyer3.toString()=== shareAmount);
        assert(shareBuyer4.toString()=== shareAmount);
        const adminBalanceDai = await dai.balanceOf(admin);
        assert(adminBalanceDai.toString() === web3.utils.toWei('100000'));
    }
    )})