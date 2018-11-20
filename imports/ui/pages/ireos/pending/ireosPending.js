import {
    Meteor
} from 'meteor/meteor';
import Trustees from '/imports/api/trustees/trustees.js';
import Files from '../../../../api/files.collection.js';

import './ireosPending.html';

Template.ireosPending.onCreated(function () {
    this.trusteeFormMessage = new ReactiveVar(false);
    this.bidFeeWarningMsg = new ReactiveVar(false);
    this.sellerSponsored = new ReactiveVar(0);
    this.sellerFunded = new ReactiveVar(0);
    this.sellerSuccessRate = new ReactiveVar(0);
    this.bidFee = new ReactiveVar(0);
    updateDefaultAccount();

    var self = this;
    this.doUpload = (event, file, source) => {
        var uploadInstance = Files.insert({
            file: file,
            streams: 'dynamic',
            chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function () {});

        uploadInstance.on('end', function (error, fileObj) {
            var _data = {
                address: Session.get('ireoAddress')
            };
            if (error) {
                // window.alert('Error during upload: ' + error.reason);
                Bert.alert( `Error during upload: ${error.reason}`, 'danger', 'growl-top-right' );
            } else {
                var _file = `${fileObj._downloadRoute}/${fileObj._collectionName}/${fileObj._id}/original/${fileObj._id}${fileObj.extensionWithDot}`;
                if (source.loc == 'profile') {
                    _data.image = _file;

                    Meteor.call('ireos.update', Session.get('ireoAddress'), _data, err => {
                        if (err)
                            // alert(err)
                            Bert.alert( err , 'danger', 'growl-top-right' );
                    })
                } else {
                    if (
                        source.type == 'videos' && !fileObj.isVideo ||
                        source.type == 'documents' && !fileObj.isPDF ||
                        source.type == 'pictures' && !fileObj.isImage
                    ) {
                        // alert('Incorrect file type.')
                        Bert.alert( 'Incorrect file type.' , 'danger', 'growl-top-right' );
                    } else {
                        _data = {
                            filename: fileObj.name,
                            description: '',
                            file: _file
                        };
                    }

                    Meteor.call('ireos.add_file', Session.get('ireoAddress'), `${source.loc}.${source.type}`, _data, err => {
                        if (err)
                            // alert(err)
                            Bert.alert( err , 'danger', 'growl-top-right' );
                    })
                }
            }
        });

        uploadInstance.start();
    };
});

Template.ireosPending.events({

    'click .apply-trustee': function (event, template) {
        Session.set('ireoAddress', $(event.target).data('address'));
    },
    'click .btn-edit-listing': function (event, template) {
        Session.set('ireoAddress', $(event.target).data('address'));
    },
    'click #back-apply-trustee': function (event, template) {
        template.trusteeFormMessage.set(false);
    },
    'click #applyAsTrustee': function (event, template) {
        template.trusteeFormMessage.set(false);
    },
    'click #next-apply-trustee': function (event, template) {
        let amount = (template.find(`#bid-fee`).value) * 100;
        template.bidFee.set(amount);
        template.trusteeFormMessage.set(true);
    },
    'click #do-apply-trustee': function (event, template) {
        let address = Session.get('ireoAddress');
        template.trusteeFormMessage.set(false);
        let amount = template.bidFee.get();

        processTx(ireoLogic.methods.bid(address, amount));
        // cbWrap(cb=>ireoInstance.bid(amount, cb));
        $('#trustee-form').modal('hide');
        onPendingTxStatus();
        ireoLogic.methods.bid(address, amount)
        .send({ from: web3.eth.defaultAccount })
        .on('transactionHash', _hash => {
            let property = ClientProperties.findOne({address: address});
            Meteor.call('notifications.bidIREO', _hash, address, property.name, amount, (err, res) => {
                onMiningTxStatus();
            })
        });
    },
    'keyup #bid-fee': function (event, template) {            
        let amount = template.find(`#bid-fee`).value;
        if(amount.search(/^0*(?:[0-9][0-9]?|100)$/) != -1)
            template.bidFeeWarningMsg.set(false);        
        else
            template.bidFeeWarningMsg.set(true);        
    }
});

Template.ireosPending.helpers({
    showTrusteeFormMessage() {
        return Template.instance().trusteeFormMessage.get();
    },
    ireoInfo() {

        return ClientProperties.findOne({
            address: Session.get('ireoAddress')
        });
    },

    getIREOInfo() {
        // return ClientProperties.find({ status: { $in: ['Bidding', 'Pending'] }, trustee: null }).fetch();
        return ClientProperties.find({
            status: {
                $in: ['Bidding', 'Pending']
            }
        }).fetch();
    },
    timeToString(unixTime) {
        return moment.unix(unixTime).format('MMM DD, YYYY hh:mm:ss A');
    },
    percentFunded(goal, raised) {
        return ((raised / goal) * 100) || 0;
    },
    isIREODataReady(ireoObj) {
        // return ['streetAddress', 'address', 'start', 'end', 'goal', 'amountRaised'].every(key => {return key in ireoObj;});
        return true;
    },
    isTrusteeOwner() {
        // TODO: remove this
        return false || ClientTrustees.findOne({ address: web3.eth.defaultAccount });
        Meteor.subscribe('trustees.verified');
        return (false || Trustees.findOne({
            wallet: web3.eth.defaultAccount
        })) && Meteor.userId();
    },
    showBidFeeWarningMsg() {
        return Template.instance().bidFeeWarningMsg.get();
    },
     getSellerAllIreos(sellerAddress) {      
        let sellerProperties= ClientProperties.find({
            seller:new RegExp(sellerAddress,"i")
        }).fetch();        
        let ireoCount =sellerProperties.length, fullFundedCount=0;
        sellerProperties.forEach(property => {
            if(property.maxFundingGoal==property.amountRaised)
            fullFundedCount++;
        });
        Template.instance().sellerSponsored.set(ireoCount);
        Template.instance().sellerFunded.set(fullFundedCount);
        Template.instance().sellerSuccessRate.set(((fullFundedCount / ireoCount) * 100) || 0);
    },
    getSellerSponsored() {
        return (Template.instance().sellerSponsored.get());
    },
    getSellerFunded() {
        return (Template.instance().sellerFunded.get());
    },
    getTrusteeCurrentBid() {
        let address = Session.get('ireoAddress');
        if (address) {
            let thisIREO= ClientProperties.findOne({
                address:new RegExp(address,"i")
            });
            if (thisIREO) {
                if (thisIREO.bids) {
                    let bids = thisIREO.bids;
                    for (var i=0; i< bids.length; i++ ) {
                        if (bids[i].bidder.toLowerCase() == web3.eth.defaultAccount.toLowerCase() ) {
                            return bids[i].basis/100;
                        }
                    }
                }
            }
        }
    },
    getSellerSuccessRate() {
        return (Template.instance().sellerSuccessRate.get());
    }

    // padBidAmount(amount) {
    //     let amountStr = amount.toString();
    //     let decIndex = amountStr.indexOf('.');
    //     if (decIndex < 2) {
    //         amountStr = '0'.repeat(2 - decIndex) + amountStr;
    //     }
    //     if (amountStr.length < 5) {
    //         amountStr += '0'.repeat(5 - amountStr.length);
    //     }
    //     return amountStr;
    // }
});