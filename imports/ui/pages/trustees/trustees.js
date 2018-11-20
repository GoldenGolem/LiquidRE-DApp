import Trustees from '/imports/api/trustees/trustees.js';

import './trustees.html';
import '../../stylesheets/trustees-list.scss';

Template.trustees.onCreated(function trusteesOnCreated() {
    updateDefaultAccount();
});

Template.trustees.events({
});

Template.trustees.helpers({
    noTrusteeApplication(currentUser) {          
        return currentUser.roles.indexOf("Trustee")==-1?true:false
    }
});