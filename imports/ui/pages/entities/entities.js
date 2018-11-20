import './entities.html';

Template.entities.onCreated(function() {
    // this.ClientEntities = new Mongo.Collection('client-entities', {connection:null});
    // this.isLiquidREOwner = '';
    // if (typeof web3 !== 'undefined' && web3.eth.coinbase) {
    //     cbWrap(cb=>entityFactory.entityAddresses.call(cb), res => {
    //         for (entityAddress of res) {
    //             let localAddress = entityAddress;
    //             let entityInstance = EntityContract.at(localAddress);
    //             this.ClientEntities.update({address: localAddress}, {$set: {address: localAddress}}, {upsert: true});
    //             cbWrap(cb=>entityInstance.verified.call(cb), res=>this.ClientEntities.update({address: localAddress}, {$set: {verified: res}}, {upsert: true}));
    //             cbWrap(cb=>entityInstance.country.call(cb), res=>this.ClientEntities.update({address: localAddress}, {$set: {country: res}}, {upsert: true}));
    //             cbWrap(cb=>entityInstance.category.call(cb), res=>this.ClientEntities.update({address: localAddress}, {$set: {category: res}}, {upsert: true}));
    //             cbWrap(cb=>entityInstance.isAccreditedInvestor.call(cb), res=>this.ClientEntities.update({address: localAddress}, {$set: {isAccreditedInvestor: res}}, {upsert: true}));
    //         }
    //     });
    //     cbWrap(cb=>liquidRE.owner.call(cb), res=>this.isLiquidREOwner = res);
    // }
    updateDefaultAccount();
});

Template.entities.events({
    'click .btn-verify': function(event, template) {
        let address = $(event.target).data('address');
        let country = $(event.target).data('country');
        cbWrap(cb => liquidRE.addEntity(address, country, cb), res => {
            Meteor.call('users.verify', address, (err) => {
                if(err) {
                    // alert(err)
                    Bert.alert( err , 'danger', 'growl-top-right' );
                } else {
                    // alert('entity verified')
                    Bert.alert( 'entity verified.' , 'danger', 'growl-top-right' );
                }
            });
        }, err => console.log(err));
    }
});

Template.entities.helpers({
	getEntities() {
        return Meteor.users.find();
	},
    isLiquidREOwner() {
		return Template.instance().isLiquidREOwner == web3.eth.defaultAccount;
    }
});
