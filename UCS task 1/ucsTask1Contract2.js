const { Contract } = require('fabric-contract-api');

class user extends Contract {
    async Init(ctx) {
        const initialData = [
            {id: "usr0", data: {name: "Adarsh", surname: "Sanodia", anime: "Asli hu mai.", access_status: true}},
            {id: "usr1", data: {name: "Yuji", surname: "Itadori", anime: "Jujutsu Kaisen", access_status: false}},
            {id: "usr2", data: {name: "Eren", surname: "Yeager", anime: "Attack on Titan", access_status: false}}
        ];

        for (const userdata of initialData) {
            await this.addUser(ctx, data.id, data.userdata);
        }
        console.log("Chaincode is initialized!");
    }


    //add user with the data to be added to user
    async addUser (ctx, id, userData) {
        const existingData = await ctx.getState(id);

        if (!existingData) {
            await ctx.stub.putState(id, Buffer.from(userData));
        }
        else {
            throw new Error("User with same ID already Exists!");
        }
    }

    // get the user data
    async getUser (ctx, userId) {
        const userData = await ctx.stub.getState(userId);
        if (!userData || userData.length == 0) {
            throw new Error("User Data not found.");
        }
        const userData_string = JSON.parse(userData.toString());
        // return recieved data;
        return userData_string; 
    }

    // grant the user access
    async giveAccess (ctx, userId) {
        const user = await this.getState(ctx, userId);
        if (user.data[access_status]) {
            throw new Error("User already has access!");
        }

        user.data[access_status] = true;
        //set the data to the ledger
        await ctx.stub.putState(ctx, Buffer.from(JSON.stringify(user)));
        console.log(`Granted access to user ${userId}.`);
        return `Access granted.`;
    }

    // revoke user access
    async revokeAccess (ctx, userId) {
        const user = await this.getState(userId);
        if (user.data[access_status] == false) {
            throw new Error("Access already revoked for this user!");
        }
        await ctx.stub.putState(ctx, Buffer.from(JSON.stringify(user)));
        console.log(`Access revoked from user ${userId}`);
        return `Access revoked.`;
    }


};