updateDefaultAccount = () => {
    if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) {
        web3.eth.getCoinbase((err, account) => {
            web3.eth.defaultAccount = account;
        });
    }
};

updateProperty = () => {

};

redirectingToLogin = () => {
    //redirect to login page
    if(!web3 || (web3 && !web3.eth.defaultAccount)){
        Router.go("login");
        return true;
    }

    return false;
}

// TODO: make this just pull in minimal data required to show the lists pages, not full property details
initializeProperties = () => {
    cbWrap(liquidRE.methods.getProperties().call, res => {
        ClientProperties.remove({ address: { $nin: res }});
        for (address of res) {
            let propertyAddress = address;
            let propertyInstance = new web3.eth.Contract(LiquidPropertyABI, propertyAddress);
            ClientProperties.update({ address: propertyAddress }, { $set: { address: propertyAddress }}, { upsert: true });
            cbWrap(propertyInstance.methods.version().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { version: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.status().call, res => {
                // TODO: this is dumb, do it better
                ClientProperties.update({ address: propertyAddress }, { $set: { status: [
                    'Bidding', // trustees are bidding on it. it only proceeds to funding when the seller chooses a trustee, and the trustee accepts and sets min/max/start/end/etc
                    'Funding', // if funding AND now is between start and end, investors can contribute
                    'Withdrawn', // trustee withdrew
                    'Trading', // trustee enabled trading after withdrawal
                    'Frozen', // trustee has frozen trading
                    'Failed',
                    'CancelledBySeller', // seller that created it decided to cancel it before choosing a trustee
                    'CancelledByTrustee', // trustee decided to cancel it
                    'Dissolved' // trustee dissolved trust
                ][res.valueOf()] }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.name().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { name: res }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.totalSupply().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { totalSupply: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.minFundingGoal().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { minFundingGoal: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.maxFundingGoal().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { maxFundingGoal: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.startTime().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { startTime: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.endTime().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { endTime: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.amountRaised().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { amountRaised: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.amountWithdrawn().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { amountWithdrawn: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.seller().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { seller: res }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.trustee().call, res => {
                if(res == '0x0000000000000000000000000000000000000000')
                    res = null;
                ClientProperties.update({ address: propertyAddress }, { $set: { trustee: res }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.trusteeFee().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { trusteeFee: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.contributorCount().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { contributorCount: res.valueOf() }}, { upsert: true });
            });
            cbWrap(propertyInstance.methods.getBidders().call, res => {
                let bids = [];
                for (bidder of res) {
                    if (bidder != '0x' && bidder != '0x0000000000000000000000000000000000000000') {
                        let bid = { bidder: bidder };
                        cbWrap(propertyInstance.methods.bids(bid.bidder).call, res => {
                            bid.basis = res[2].valueOf();
                            bids.push(bid);
                            ClientProperties.update({ address: propertyAddress }, { $set: { bids: bids }}, { upsert: true });
                            // TODO: figure out a cleaner/faster way to do this
                        });
                    }
                }
            });
            if (typeof web3.eth.defaultAccount !== 'undefined') {
                cbWrap(propertyInstance.methods.balanceOf(web3.eth.defaultAccount).call, res => {
                    ClientProperties.update({ address: propertyAddress }, { $set: { myBalance: res.valueOf() }}, { upsert: true });
                });
            } else {
                ClientProperties.update({ address: propertyAddress }, { $set: { myBalance: 0 }}, { upsert: true });
            }
            cbWrap(propertyInstance.methods.created().call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { created: res.valueOf() }}, { upsert: true });
            });
        }
    });
};

// this is separate from initializeProperties because calculating the virtual balance requires the converter logic contract to be set first
// TODO: figure out a better way to do this instead of two separate functions
initializePropertiesConverter = () => {
    cbWrap(liquidRE.methods.getProperties().call, res => {
        ClientProperties.remove({ address: { $nin: res }});
        for (address of res) {
            let propertyAddress = address;
            ClientProperties.update({ address: propertyAddress }, { $set: { address: propertyAddress }}, { upsert: true });
            cbWrap(converterLogic.methods.getBalance(propertyAddress).call, res => {
                ClientProperties.update({ address: propertyAddress }, { $set: { connectorBalance: res.valueOf() }}, { upsert: true });
            });
        }
    });
};

initializeTrustees = () => {
    cbWrap(liquidRE.methods.getTrustees().call, res => {
        ClientTrustees.remove({ address: { $nin: res }});
        for (let trusteeAddress of res) {
            if (trusteeAddress != '0x' && trusteeAddress != '0x0000000000000000000000000000000000000000') {
                updateTrustee(trusteeAddress);
            }
        }
    });
};

updateTrustee = (address) => {
    cbWrap(liquidRE.methods.trusteeInfo(address).call, res => {
        if (res[0]) {
            ClientTrustees.update({ address: address }, { address: address, name: res[2], mailingAddress: res[3], created: res[4].valueOf() }, { upsert: true });
        }
    });
};

initializeStableToken = () => {
    if (typeof web3.eth.defaultAccount !== 'undefined') {
        cbWrap(stableToken.methods.balanceOf(web3.eth.defaultAccount).call, res => {
            ClientStableToken.update({}, { $set: { myBalance: res.valueOf() }}, { upsert: true });
        });
    } else {
        ClientStableToken.update({}, { $set: { myBalance: 0 }}, { upsert: true });
    }
    cbWrap(stableToken.methods.totalSupply().call, res => {
        ClientStableToken.update({}, { $set: { totalSupply: res.valueOf() }}, { upsert: true });
    });
};

initializeSellers = () => {
    cbWrap(liquidRE.methods.getSellers().call, res => {
        ClientSellers.remove({ address: { $nin: res }});
        for (let sellerAddress of res) {
            if (sellerAddress != '0x' && sellerAddress != '0x0000000000000000000000000000000000000000') {
                updateSeller(sellerAddress);
            }
        }
    });
};

updateSeller = (address) => {
    cbWrap(liquidRE.methods.sellerInfo(address).call, res => {
        if (res[0]) {
            ClientSellers.update({ address: address }, { address: address, created: res[2].valueOf() }, { upsert: true });
        }
    });
};


initializeInvestors = () => {
    cbWrap(liquidRE.methods.getInvestors().call, res => {
        ClientInvestors.remove({ address: { $nin: res }});
        for (let investorAddress of res) {
            if (investorAddress != '0x' && investorAddress != '0x0000000000000000000000000000000000000000') {
                updateInvestor(investorAddress);
            }
        }
    });
};

updateInvestor = (address) => {
    cbWrap(liquidRE.methods.investorInfo(address).call, res => {
        if (res[0]) {
            ClientInvestors.update({ address: address }, { address: address, countryCode: res[2].valueOf(), created: res[3].valueOf() }, { upsert: true });
        }
    });
};

initializeAdministrators = () => {
    cbWrap(liquidRE.methods.getAdministrators().call, res => {
        ClientAdministrators.remove({ address: { $nin: res }});
        for (let administratorAddress of res) {
            if (administratorAddress != '0x' && administratorAddress != '0x0000000000000000000000000000000000000000') {
                cbWrap(liquidRE.methods.administratorInfo(administratorAddress).call, res => {
                    if (res[0]) {
                        ClientAdministrators.update({ address: administratorAddress }, { address: administratorAddress }, { upsert: true });
                    }
                });
            }
        }
    });
};

initializeManagers = () => {
    cbWrap(liquidRE.methods.getManagers().call, res => {
        ClientManagers.remove({ address: { $nin: res }});
        for (let managerAddress of res) {
            if (managerAddress != '0x' && managerAddress != '0x0000000000000000000000000000000000000000') {
                cbWrap(liquidRE.methods.managerInfo(managerAddress).call, res => {
                    if (res[0]) {
                        ClientManagers.update({ address: managerAddress }, { address: managerAddress }, { upsert: true });
                    }
                });
            }
        }
    });
};

initializeVerifiers = () => {
    cbWrap(liquidRE.methods.getVerifiers().call, res => {
        ClientVerifiers.remove({ address: { $nin: res }});
        for (let verifierAddress of res) {
            if (verifierAddress != '0x' && verifierAddress != '0x0000000000000000000000000000000000000000') {
                cbWrap(liquidRE.methods.verifierInfo(verifierAddress).call, res => {
                    if (res[0]) {
                        ClientVerifiers.update({ address: verifierAddress }, { address: verifierAddress }, { upsert: true });
                    }
                });
            }
        }
    });
};

initializeRENT = () => {
    if (typeof web3.eth.defaultAccount !== 'undefined') {
        cbWrap(rent.methods.balanceOf(web3.eth.defaultAccount).call, res => {
            ClientRENT.update({}, { $set: { myBalance: res.valueOf() }}, { upsert: true });
        });
    } else {
        ClientRENT.update({}, { $set: { myBalance: 0 }}, { upsert: true });
    }
    ClientRENT.update({}, { $set: { address: rent.options.address }}, { upsert: true });    
    cbWrap(rent.methods.totalSupply().call, res => {
        ClientRENT.update({}, { $set: { totalSupply: res.valueOf() }}, { upsert: true });
    });
    cbWrap(rentLogic.methods.getBalance().call, res => {
        ClientRENT.update({}, { $set: { connectorBalance: res.valueOf() }}, { upsert: true });
    });
    cbWrap(rent.methods.connectorWeight().call, res => {
        ClientRENT.update({}, { $set: { weight: res.valueOf() }}, { upsert: true });
    });
    cbWrap(rent.methods.initialized().call, res => {
        ClientRENT.update({}, { $set: { initialized: res }}, { upsert: true });
    });
    cbWrap(rent.methods.conversionsEnabled().call, res => {
        ClientRENT.update({}, { $set: { conversionsEnabled: res }}, { upsert: true });
    });
};
