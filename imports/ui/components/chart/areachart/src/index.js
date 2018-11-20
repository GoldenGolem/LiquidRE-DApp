
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { withTracker } from 'meteor/react-meteor-data';
import MarketCap from '../../../../../api/market-cap/market-cap.js';
const _ = require('underscore');

class ChartComponent extends React.Component {
	render() {
		if (this.props.pricesLoading || this.props.prices.length == 0) {
			return <div>Loading...</div>
		}
		// TODO: do this on server side
		let minDate, maxDate = null;
		let prices = _.map(this.props.prices, price => {
			let date = new Date(price._id);
			if(!minDate)
				minDate = date;
			else {
				minDate = (minDate > date) ? date : minDate;
			}

			if(!maxDate)
				maxDate = date;
			else {
				maxDate = (maxDate < date) ? date : maxDate;
			}

			return {
                date: date,
                close: price.close
			}
		});
		prices['columns'] = ["date", "close"];
		return (
			<Chart data={prices} maxDate={maxDate} minDate={minDate} />
		)
	}
}

//export default ChartComponent;

export default withTracker(props => {
	const handle = Meteor.subscribe('marketcap.hourly-ticker', props.lretAddress);
	return {
	  pricesLoading: !handle.ready(),
	  prices: MarketCap.find().fetch(),
	};
  })(ChartComponent);