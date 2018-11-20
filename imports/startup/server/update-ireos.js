import IREOS from '../../api/ireos/ireos.js';	
let timeInterval = 5 * (60 * 1000); // 5 minutes	
	
let doIREOUpdates = Meteor.bindEnvironment((_address) => {	
    let ireo = new web3.eth.Contract(LiquidPropertyABI, _address);	
    let amountRaised, minFundingGoal, endTime = 0;	
    let seller = null;	
    cbWrap(ireo.methods.amountRaised().call, Meteor.bindEnvironment(res => {	
        amountRaised = res;	
        cbWrap(ireo.methods.minFundingGoal().call, Meteor.bindEnvironment(res => {	
            minFundingGoal = res;	
            cbWrap(ireo.methods.endTime().call, Meteor.bindEnvironment(res => {	
                endTime = res;	
                cbWrap(ireo.methods.seller().call, Meteor.bindEnvironment(res => {	
                    seller = res;	
	
                    var end = moment.unix(endTime);	
                    var now = moment();	
                    var seconds = end.diff(now, 'seconds');	
                    	
                    if(seconds <= 0) {	
                        var status = (amountRaised < minFundingGoal) ? 'Failed' : 'Successful';	
                        IREOS.update({address: _address},{	
                            $set: {	
                                ended: true,	
                                status: status,	
                                seller: seller	
                            }	
                        }, {upsert: true});	
                    }	
                }));	
	
            }));	
        }));	
    }));	
});	
	
let IREOUpdates = async () => {	
    let ireos = await liquidRE.methods.getProperties().call();	
    ireos.forEach(ireo => {	
        doIREOUpdates(ireo);	
    })	
};	
	
let runIREOUpdates = () => {	
    setInterval(()=> {	
        IREOUpdates();	
    }, timeInterval);	
}	
	
export { runIREOUpdates };