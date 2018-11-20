
import './chart.html';
import ChartComponent from './src/index.js';
import Prices from '../../../../api/prices/prices.js';

Template.priceChart.onCreated(function(){
    this.lretAddress = this.data.lretAddress;
    this.height = this.data.height;
});

Template.priceChart.helpers({
    chartComponent() {
        return ChartComponent;
    },
    lretAddress() {
        return Template.instance().lretAddress;
    },
    height() {
        return Template.instance().height;
    }
});