Meteor.loginWithETH = function (msgHash, signature, from, callback) {
    Accounts.callLoginMethod({
        methodArguments: [{
            msgHash: msgHash,
            signature: signature,
            from: from
        }],
        userCallback: callback
    });
};