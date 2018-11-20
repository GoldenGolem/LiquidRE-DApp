import './ireosEnded.html';

Template.ireosEnded.onCreated(function() {
	// updateIREOs();
	// updateTrustees();
	updateDefaultAccount();
});

Template.ireosEnded.helpers({
	getIREOInfo() {
		return ClientProperties.find({ status: { $in: ['Withdrawn', 'Trading', 'Frozen', 'Failed', 'CancelledByCreator', 'CancelledByTrustee'] }, trustee: { $not: null }}).fetch();
	},
	percentFunded(goal, raised) {
		var factor = Math.pow(10, 2);
		var number = ((raised / goal) * 100) || 0;
  		var value = Math.round(number * factor) / factor;
		return value;
	},
	isFullyFunded(goal, raised) {
		return (Number(raised) >= Number(goal));
	},
	isIREODataReady(ireoObj) {
		// return ['streetAddress', 'address', 'start', 'end', 'goal', 'amountRaised', 'trustee', 'trusteeName'].every(key => {return key in ireoObj;});
		return true;
	}
});
