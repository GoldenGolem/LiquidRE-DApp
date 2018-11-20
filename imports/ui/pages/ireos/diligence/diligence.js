import './diligence.html';
import '../../../stylesheets/ireos-diligence.scss';
import Files from '../../../../api/files.collection.js';
import IREOS from '../../../../api/ireos/ireos.js';

Template.ireosDiligence.onCreated(async function () {
    updateDefaultAccount();
});


Template.ireosDiligence.helpers({
    getIREOInfo() {
        return ClientProperties.findOne({
            address: Router.current().params._id
        });
    },
    files() {
        Meteor.subscribe('ireos.info', Router.current().params._id);
        let _source = Router.current().params._tab;
        let ireo = IREOS.findOne({address: Router.current().params._id});
        return (ireo && ireo[_source]) ? ireo[_source] : null;
    },
    tabClass(_tab) {
        return (_tab == Router.current().params._tab) ? 'active' : null;
    },
    convertToMB(_filesize) {
        return (_filesize / (1000 * 1000));
    }
});