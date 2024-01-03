//get the fabric contract api to get Contract class
const { Contract } = require('fabric-contract-api');

class fetchMessage extends Contract {
    // Initialize the contract
    async Init(ctx) {
        const initialData = [
            {rollNum: "ee22b083", message: "I have made the contract to add assets on this network."},
            {rollNum: "aa22b001", message: "Random data added to check the functionality of init funciton."}
        ];

        // add the initial data to the ledger
        for (const data of initialData) {
            await this.addData(ctx, data.rollNum, data.message);
        }

        console.log("Chaincode is initialized!");
    }

    // To add data to the message using roll number as a key
    async addData (ctx, rollNum, message) {
        if (rollNum.length != 8) {
            throw new Error ("Not an 8 digit Roll number!");
        }
        await ctx.stub.putState(rollNum, Buffer.from(message));
        return `Successfully published message: ${message} mapped to ${rollNum}`;
    }

    // Function to access the message
    async accessData (ctx, rollNum) {
        const messagePure = await ctx.stub.getState(rollNum);

        if (messagePure.length === 0 || !(messagePure)) {
            throw new Error ("No message exists for this roll number.");
        }

        const messageRecieved = messagePure.toString();
        console.log(`Message from ${rollNum}: ${messageRecieved}`);
        return messageRecieved;
    }

    // delete the data corresponding to roll number
    async deleteData (ctx, rollNum) {
        const existingData = await this.accessData(ctx, rollNum);
        if (!existingData) {
            throw new Error(`Cannot delete. Existing data from ${rollNum} was not found.`);
        }
        
        console.log(`Deleting message from ${rollNum}...`);
        await ctx.stub.delState(rollNum);
        console.log("Delete success.");
        return `Deleted Successfully.`
    }

    // modify data mapped to a roll number and replace with new data
    async modifyData (ctx, rollNum, newData) {
        const existingData = await this.accessData(ctx, rollNum);
        if (!existingData) {
            throw new Error(`Cannot modify. Existing data from ${rollNum} was not found.`)
        }

        console.log(`Modifying data mapped to ${rollNum}`);
        await ctx.stub.putState(rollNum, Buffer.from(newData));
        return `Successfully Modified data.`;
    }

    async transferData (ctx, rollFrom, rollTo) {
        var dataFrom = await this.accessData(ctx, rollFrom);
        var dataTo = await this.accessData(ctx, rollTo);
        
        if (!dataFrom || !dataTo) {
            throw new Error("One or more of the roll numbers do not contain any Data!");
        }
        
        await ctx.stub.putState(rollFrom, Buffer.from(dataTo));
        await ctx.stub.putState(rollTo, Buffer.from(dataFrom));
        
    }

}

module.exports = fetchMessage;