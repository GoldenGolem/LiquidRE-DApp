
import './chart.html';
import ChartComponent from './src/index.js';
// import Prices from '../../../../api/prices/prices.js';

Template.marketCapChart.onCreated(function(){
    this.lretAddress = this.data.lretAddress;
});

Template.marketCapChart.helpers({
    chartComponent() {
        return ChartComponent;
    },
    lretAddress() {
        return Template.instance().lretAddress;
    }
});