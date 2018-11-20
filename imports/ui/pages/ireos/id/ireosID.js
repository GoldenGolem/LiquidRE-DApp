import './ireosID.html';
import '../../../stylesheets/property-id.scss';
import Files from '../../../../api/files.collection.js';

var loadingMessage = new ReactiveVar("Loading property...");
Template.ireosID.onCreated(async function () {
    this.uploadingProfileImage = new ReactiveVar(false);
    // updateIREOs();
    // updateTrustees();
    updateDefaultAccount();
    setTimeout(function() {
        loadingMessage.set("Unable to locate property");
    } , 3000);   
    this.myRoles = new ReactiveVar('  ');    
    this.editDescription = new ReactiveVar(false);
    this.latestEditText = new ReactiveVar('');
     if (typeof web3 !== 'undefined' && web3.eth.defaultAccount != null) {
        let checkStatus = () => {            
            if (typeof liquidRE !== 'undefined') {
                cbWrap(liquidRE.methods.investorInfo(web3.eth.defaultAccount).call, res => {
                    if (res[0]) {
                        this.myRoles.set(this.myRoles.get() + 'Investor, ');
                    }
                });
            }
            
        }
        checkStatus();
    };
});

Template.ireosID.events({
    // 'click #approve-ireo': function (event, template) {
    //     // let ireoInstance = IREOContract.at(Router.current().params._id);
    //     // cbWrap(cb=>ireoInstance.updateStatus(true, cb));
    //     let property = ClientProperties.findOne({
    //         address: Router.current().params._id
    //     });
    //     processTx(ireoLogic.methods.approveIREO(Router.current().params._id, property.minFundingGoal, property.maxFundingGoal, property.startTime, property.endTime, true));
    // },
    'submit #new-ireo-approve': function (event, template) {
        let start = moment(event.target.start_time.value).unix();
        let end = moment(event.target.end_time.value).unix();
        let today = moment().startOf('day').unix();
        if (start < today) {
            Bert.alert({
                title: 'Error',
                message: 'Start date may not be in the past',
                type: 'danger',
                style: 'growl-top-right',
              });
              
            return;
        } else if (end <= start || end <= today) {
            Bert.alert({
                title: 'Error',
                message: 'End date must be after start date',
                type: 'danger',
                style: 'growl-top-right',
              });
            return;
        }
        let goal = new BigNumber(event.target.goal.value || 0).times(1e18);
        //processTx(ireoLogic.methods.approveIREO(Router.current().params._id, goal, goal, start, end, true));
        onPendingTxStatus();
        ireoLogic.methods.approveIREO(Router.current().params._id, goal, goal, start, end, true)
        .send({ from: web3.eth.defaultAccount })
        .on('transactionHash', _hash => {
            let property = ClientProperties.findOne({address: Router.current().params._id});
            Meteor.call('ireos.add_status', 'On-progress');
            Meteor.call('notifications.approveIREO', 
                _hash, 
                Router.current().params._id, 
                property.name, 
                property.seller,
                (err, res) => {
                    onMiningTxStatus();
            });
        })
        .on('confirmation', (confirmationNumber, receipt) => {
            onCompleteTxStatus();
            Meteor.call('ireos.add_status', 'Successful');
        })
        .on('error', error => {
            onErrorTxStatus(error.message);
            Meteor.call('ireos.add_status', 'Failed');  
        });
    },
    'click #contribute-ireo': function (event, template) {
        let amount = template.find('#contribute-amount').value;
        // TODO: make this check if there is already a sufficient allowance and skip approve tx
        onPendingTxStatus();
        ireoLogic.methods.contribute(Router.current().params._id, new BigNumber(amount).times(1e18))
        .send({ from: web3.eth.defaultAccount })
        .on('transactionHash', _hash => {
            let property = ClientProperties.findOne({address: Router.current().params._id});
            Meteor.call('notifications.buyIREOShares', _hash, Router.current().params._id, property.name, amount, (err, res) => {
                onMiningTxStatus();
            })
        });
    },
    'click #approve-contribute-ireo': function (event, template) {
        let amount = template.find('#contribute-amount').value;
        onPendingTxStatus();
        stableToken.methods.approve(ireoLogic.options.address, new BigNumber(amount).times(1e18))
        .send({ from: web3.eth.defaultAccount })
        .on('transactionHash', _hash => {
            let property = ClientProperties.findOne({address: Router.current().params._id});
            Meteor.call('notifications.approveTPEG', _hash, Router.current().params._id, property.name, amount, (err, res) => {
                onMiningTxStatus();
            })
        });
    },
    'click #withdraw-funds': function (event, template) {
        // let ireoInstance = IREOContract.at(Router.current().params._id);
        // cbWrap(cb=>ireoInstance.withdrawToTrustee(cb));
        processTx(ireoLogic.methods.withdrawToTrustee(Router.current().params._id));
    },
    'click .btn-select-bid': function (event, template) {
        let ireoAddress = $(event.target).data('ireo-address');
        let bidderAddress = $(event.target).data('bid-address');
        onPendingTxStatus();
        ireoLogic.methods.selectBid(ireoAddress, bidderAddress)
        .send({ from: web3.eth.defaultAccount })
        .on('transactionHash', _hash => {
            let property = ClientProperties.findOne({address: Router.current().params._id});
            Meteor.call('notifications.selectIREOTrustee', 
                _hash, 
                Router.current().params._id, 
                property.name, 
                bidderAddress,
                (err, res) => {
                    onMiningTxStatus();
            });
        });
    },
    'click #add-video': function (event, template) {
        let url = template.find('#youtube-url').value;
        Meteor.call('ireos.update', Router.current().params._id, {
                youtube_video: url
            },
            (error) => {
                if (error) {
                    // alert(error.error);
                    Bert.alert( error.error , 'danger', 'growl-top-right' );
                } else {
                    Bert.alert("Video Added" , 'success', 'growl-top-right' );                    
                    template.find('#youtube-url').value = '';
                }
            });
    },
    'click #edit-description' : function (event,template){
        template.editDescription.set(true);
    },
    'click #save-description': function (event, template) {
        let description = template.find('#description').value;
        Meteor.call('ireos.update', Router.current().params._id, {
                description: description
            },
            (error) => {
                if (error) {
                    // alert(error.error);
                    Bert.alert( error.error , 'danger', 'growl-top-right' );
                } else {
                    // alert('Changes saved.')
                    Bert.alert( "Changes saved." , 'success', 'growl-top-right' );
                    template.editDescription.set(false);
                    template.latestEditText.set(description);
                }
            });
    },
    'click #add-image': function (event, template) {
        $('#upload-profile-image').click();
    },
    'change #upload-profile-image': function (event, template) {

        if (event.currentTarget.files && event.currentTarget.files[0]) {
            var file = event.currentTarget.files[0];
            if (file) {
                //template.doUpload(event, file, Session.get('source'));
                var uploadInstance = Files.insert({
                    file: file,
                    streams: 'dynamic',
                    chunkSize: 'dynamic'
                }, false);
                uploadInstance.on('start', function () {
                    template.uploadingProfileImage.set(true);
                });

                uploadInstance.on('end', function (error, fileObj) {
                    var _data = {};
                    if (error) {
                        // window.alert('Error during upload: ' + error.reason);
                        Bert.alert( `Error during upload: ${error.reason}` , 'danger', 'growl-top-right' );
                    } else {
                        _data.image = fileObj._id;
                        Meteor.call('ireos.update', Router.current().params._id, _data, err => {
                            if (err){
                                // alert(err)
                                Bert.alert( err , 'danger', 'growl-top-right' );
                            }
                            else{
                                Bert.alert( `Image Added` , 'success', 'growl-top-right' );                        
                                template.uploadingProfileImage.set(false);
                            }
                        });
                        Bert.alert( `Adding New Image...` , 'info', 'growl-top-right' );                        
                    }
                });
                uploadInstance.start();
            }
        }
    },
});

Template.ireosID.helpers({
    getIREOInfo() {
        console.log(ClientProperties.findOne({
            address: Router.current().params._id
        }));

        return ClientProperties.findOne({
            address: Router.current().params._id
        });
    },
    loadingMessage() {
        return loadingMessage.get();
    },
    showApproveBtn() {
        let ireo = ClientProperties.findOne({
            address: Router.current().params._id
        });
        if (ireo)
            return (ireo.trustee == web3.eth.defaultAccount) && (ireo.status == 'Bidding');
        else
            return false;
    },
    showWithdrawBtn() {
        let ireo = ClientProperties.findOne({
            address: Router.current().params._id
        });
        if (ireo)
            // either the goal is reached or the end date was reached
            return (ireo.trustee == web3.eth.defaultAccount) && (ireo.status == 'Funding') && (ireo.endTime < moment().unix() || (ireo.amountRaised >= ireo.maxFundingGoal));
        else
            return false;
    },
    percentFunded(goal, raised) {
        var value = Math.round(((raised / goal) * 100) || 0);
        return value;
    },
    isFunding() {
        let ireo = ClientProperties.findOne({
            address: Router.current().params._id
        });
        return ireo.status == 'Funding' && moment().unix() < ireo.endTime && moment().unix() > ireo.startTime;
    },
    isUploadingProfileImage() {
        return Template.instance().uploadingProfileImage.get();
    },
    attachDatetimepicker(startTime, endTime) {
        var start = moment.unix(startTime);
        var end = moment.unix(endTime);

        function cb(_start, _end) {
            $('input[name="start_time"]').val(_start.format('YYYY-MM-DD hh:mm A'));
            $('input[name="end_time"]').val(_end.format('YYYY-MM-DD hh:mm A'));
        }

        cb(start, end);

        $('input[name="daterange"]').daterangepicker({
            timePicker: true,
            timePickerIncrement: 1,
            timePicker24Hour: true,
            locale: {
                format: 'MM/DD/YYYY hh:mm A'
            },
            startDate: start,
            endDate: end,
            ranges: {
                '1 Week': [moment().add(2, 'days'), moment().add(7, 'days').add(2, 'days')],
                '2 Weeks': [moment().add(2, 'days'), moment().add(14, 'days').add(2, 'days')],
                '3 Weeks': [moment().add(2, 'days'), moment().add(22, 'days').add(2, 'days')],
                '1 Month': [moment().add(2, 'days'), moment().add(1, 'month').add(2, 'days')],
                '2 Months': [moment().add(2, 'days'), moment().add(2, 'month').add(2, 'days')],
                '3 Months': [moment().add(2, 'days'), moment().add(3, 'month').add(2, 'days')]
            }
        }, function (_start, _end, label) {
            cb(_start, _end);
        });
    },
    getRole() {  
        return (Template.instance().myRoles.get().slice(0, -2).indexOf("Investor") >= 0);
    },
    editDescription() {
        return Template.instance().editDescription.get();
    },
    latestEditText() {
        return Template.instance().latestEditText.get();
    }
});
