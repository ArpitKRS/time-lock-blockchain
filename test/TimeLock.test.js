const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("TimeLock Smart Contract", () => {
    let TimeLock, timelock, TestTimeLock, testTimeLock, owner, nonOwner;

    beforeEach(async ()=>{
        // Get accounts
        [owner, nonOwner] = await ethers.getSigners();

        // Load smart contracts
        timelock = await ethers.getContract("TimeLock", owner);
        testTimeLock = await ethers.getContract("TestTimeLock", owner); 
    })

    it("should set the owner correctly", async() => {
        const contractOwner = await timeLock.owner();
        expect(contractOwner).to.equal(owner.address);
    })

    it("should queue and execute a transaction", async() => {
        // Queue a transaction
        const target = testTimeLock.address;    
        const value = ethers.parseEther("1");
        const func = "test";
        const data = " ";
        const timestamp = (await testTimeLock.getTimestamp()).toNumber() + 10;

        const txId = await timelock.getTxId(target, value, func, data, timestamp);
        await timelock.queue(target, value, func, data, timestamp);

        // Execute the transaction
        await timelock.execute(target, value, func, data, timestamp);
        const isQueued = await timelock.queued(txId);

        expect(isQueued).to.be.false;
    })
})