import './ireos-menu.html';

Template.ireosMenu.onCreated(function() {
    this.activeMenu = this.data.activeMenu;
});


Template.ireosMenu.helpers({
    activeClass(_menu) {
        return (_menu == Template.instance().activeMenu) ? 'active' : '';
    },
    count(_source) {
        let ireos = null;
        if(_source == 'active')
            ireos = ClientProperties.find({ status: { $in: ['Funding'] }}).count();
        if(_source == 'pending')
            ireos = ClientProperties.find({ status: { $in: ['Bidding', 'Pending'] }}).count();
        if(_source == 'ended')
            ireos = ClientProperties.find({ status: { $in: ['Withdrawn', 'Trading', 'Frozen', 'Failed', 'CancelledByCreator', 'CancelledByTrustee'] }, trustee: { $not: null }}).count();

        return ireos;
    }
});
