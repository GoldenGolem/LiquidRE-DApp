
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { withTracker } from 'meteor/react-meteor-data';
import Tickers from '../../../../../api/tickers/tickers.js';
const _ = require('underscore');

class ChartComponent extends React.Component {
	render() {
		if (this.props.pricesLoading || this.props.prices.length == 0) {
			return <div>Loading...</div>
		}
		let prices = this.props.prices;
		prices['columns'] = ["date", "open", "high", "low", "close", "volume"];
		return (
			<Chart data={prices} height={this.props.height} />
		)
	}
}
export default withTracker(props => {
	let handle = Meteor.subscribe('tickers.all'); 
	return {
	  pricesLoading: !handle.ready(),
	  prices: Tickers.find({address: props.lretAddress}, {sort: {"date":1}}).fetch(),
	};
  })(ChartComponent);