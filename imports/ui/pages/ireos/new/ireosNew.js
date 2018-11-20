import './ireosNew.html';

Template.ireosNew.onCreated(() => {
});

Template.ireosNew.events({
    'keyup #price ': (event, template) => {
        let price = Number(template.find('#price').value);
        template.find('#goal').value = price + (price * 0.11);
    },
    'submit #new-ireo-submit': (event, template) => {
        let start = moment(template.find('#start_time').value).unix();
        let end = moment(template.find('#end_time').value).unix();
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
        // let max_goal = (event.target.max_goal.value || 0) * 1e18;

        // processTx(liquidFactory.methods.newLiquidProperty(goal, goal, start, end, event.target.streetAddress.value, true, '0x0', 0));

        onPendingTxStatus();
        liquidFactory.methods.newLiquidProperty(goal, goal, start, end, event.target.streetAddress.value, true, '0x0', 0)
        .send({ from: web3.eth.defaultAccount })
        .on('transactionHash', _hash => {
            Meteor.call('notifications.newIREO', _hash, event.target.streetAddress.value, (err, res) => {
                onMiningTxStatus();
            })
        });

        // if(min_goal < max_goal) {
        // uint256 _minFundingGoal,
        // uint256 _maxFundingGoal,
        // uint40 _startTime,
        // uint40 _endTime,
        // string _streetAddress,
        // bool _globalWhitelistEnabled,
        // address _trustee,
        // uint16 _trusteeFee
        // cbWrap(cb => liquidFactory.methods.newLiquidProperty(min_goal, max_goal, start, end, event.target.streetAddress.value, true, '0x0', 0, cb), res => {
        //     console.log(res);
        //     // TODO: make this actually watch the transaction or filter and watch for an event
        //     setTimeout(() => {
        //         Router.go('/ireos/pending');
        //     }, 3000);
        // }, err => console.log(err));
        // } else {
        //     alert("Min. funding goal should be less than the Max. funding goal.")
        // }
    }
});
