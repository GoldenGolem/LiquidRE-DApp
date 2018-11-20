import { Meteor } from 'meteor/meteor';

import '../../ui/layouts/mainLayout.js';
import '../../ui/layouts/outerLayout.js';

import '../../ui/components/head/head.js';
import '../../ui/components/ireo/people.js';
import '../../ui/components/header/header.js';
import '../../ui/components/sidebar/sidebar.js';
import '../../ui/components/footer/footer.js';
import '../../ui/components/footerscripts/footerscripts.js';
import '../../ui/components/countdown/countdown.js';
import '../../ui/components/chart/candlestick/chart.js';
import '../../ui/components/chart/areachart/chart.js';
import '../../ui/components/comments/comments.js';
import '../../ui/components/valuations/valuations.js';
import '../../ui/components/diligences/diligences.js';
import '../../ui/components/trustee-sidebar-widget/trustee-sidebar-widget.js';
import '../../ui/components/seller-sidebar-widget/seller-sidebar-widget.js';
import '../../ui/pages/ireos/menu/ireos-menu.js';

import '../../ui/pages/login/login.js';
import '../../ui/pages/networkerror/networkerror.js';
import '../../ui/pages/notFound/notFound.js';
import '../../ui/pages/portfolio/portfolio.js';
import '../../ui/pages/lrets/lrets.js';
import '../../ui/pages/lrets/id/lretsID.js';
import '../../ui/pages/ireos/ireos.js';
import '../../ui/pages/ireos/pending/ireosPending.js';
import '../../ui/pages/ireos/ended/ireosEnded.js';
import '../../ui/pages/ireos/new/ireosNew.js';
import '../../ui/pages/ireos/id/ireosID.js';
import '../../ui/pages/ireos/diligence/diligence';
import '../../ui/pages/trustees/trustees.js';
import '../../ui/pages/trustees/register/trusteesRegister.js';
import '../../ui/pages/trustees/dashboard/trusteesDashboard.js';
import '../../ui/pages/trustees/id/trusteesID.js';
import '../../ui/pages/entities/entities.js';
import '../../ui/pages/entities/investor-verification.js';
import '../../ui/pages/faq/faq.js';
import '../../ui/pages/entities/register/entitiesRegister.js';
import '../../ui/pages/entities/profile/profile.js';
import '../../ui/pages/tpegs/tpegs.js';
import '../../ui/pages/admin/admin.js';
import '../../ui/pages/rent/rent.js';
import '../../ui/pages/verifications/verifications.js';
import '../../ui/pages/transfers/transfers.js';
import '../../ui/pages/support/support.js';

// Router.onBeforeAction(function () {
//     if (typeof web3 === 'undefined' || !web3.currentProvider.isMetaMask) {
//         this.redirect('/login');
//     }
//     this.next();
// }, { except: ['login'] });

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound'
});

// to do:
// check for duplicates
// clean up route names and paths and templates to match
Router.map(function () {
    this.route('entities', {
        path: '/entities',
        template: 'entities',
        onBeforeAction: function () {
            if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), ['Admin'])) {
                this.redirect('/entities/profile/profile');
            }
            this.next();
        },
        waitOn: function () {
            Meteor.subscribe('users.all');
        },
    });
    this.route('entities/register', {
        path: '/entities/register',
        template: 'entitiesRegister',
        onBeforeAction: function () {
            // if (Meteor.userId()) {
            //     this.redirect('/entities/profile');
            // }
            this.next();
        },
    });

    this.route('entities/profile/:id', {
        path: '/entities/profile/:id',
        template: 'entitiesProfile',
        onBeforeAction: function () {
            if (!Meteor.userId()) {
                this.redirect('/entities/register');
            }
            this.next();
        },
    });
    this.route('ireos', {
        path: '/ireos',
        template: 'ireos'
    });
    this.route('ireos/pending', {
        path: '/ireos/pending',
        template: 'ireosPending'
    });
    this.route('ireos/ended', {
        path: '/ireos/ended',
        template: 'ireosEnded'
    });
    this.route('ireos/new', {
        path: '/ireos/new',
        template: 'ireosNew'
    });
    this.route('ireos/:_id', {
        path: '/ireos/:_id',
        template: 'ireosID'
    });
    this.route('ireos/:_id/diligence/:_tab', {
        path: '/ireos/:_id/diligence/:_tab',
        template: 'ireosDiligence'
    });
    this.route('lrets', {
        path: '/lrets',
        template: 'lrets'
    });
    this.route('lrets/:_id', {
        path: '/lrets/:_id',
        template: 'lretsID'
    });
    this.route('root', {
        path: '/',
        template: 'lrets'
    });
    this.route('portfolio', {
        path: '/portfolio',
        template: 'portfolio'
    });
    this.route('trustees', {
        path: '/trustees',
        template: 'trustees',
        waitOn: function () {
            Meteor.subscribe('trustees.all');
        },
    });
    this.route('trustees/register', {
        path: '/trustees/register',
        template: 'trusteesRegister',
        onBeforeAction: function () {
            if (!Meteor.userId() || (Meteor.userId() && (Meteor.user() && Meteor.user().trustee_status && Meteor.user().trustee_status != "Not Applied"))) {
                this.redirect('/trustees');
            }
            this.next();
        },
    });
    this.route('trustees/dashboard', {
        path: '/trustees/dashboard',
        template: 'trusteesDashboard'
    });
    this.route('trustees/:_id', {
        path: '/trustees/:_id',
        template: 'trusteesID'
    });
    this.route('tpegs', {
        path: '/tpegs',
        template: 'tpegs'
    });
    this.route('login', {
        path: '/login',
        onBeforeAction: function () {
            if (typeof web3 !== 'undefined' && web3.eth.defaultAccount != null) {
                this.redirect('/');
            }
            this.next();
        },
        template: 'login',
        layoutTemplate: 'outerLayout'
    });
    this.route('networkerror', {
        path: '/networkerror',
        template: 'networkerror',
        layoutTemplate: 'outerLayout'
    });
    this.route('admin', {
        path: '/admin',
        template: 'admin'
    });
    this.route('rent', {
        path: '/rent',
        template: 'rent'
    });
    this.route('verifications', {
        path: '/verifications',
        template: 'verifications'
    });
    this.route('transfers', {
        path: '/usdpeg',
        template: 'transfers'
    });
    this.route('support', {
        path: '/support',
        template: 'support'
    });
    this.route('investor-verification', {
        path: '/investor-verification',
        template: 'investor-verification'
    });
    this.route('faq', {
        path: '/faq',
        template: 'faq'
    });


    // below here are old routes that current simple dapp doesn't really need
    // this.route('analystlistservice', {
    //     path: 'analysts/services',
    //     template: 'list/service'
    // });
    // this.route('analystviewservice', {
    //     path: 'analysts/services/:_id',
    //     template: 'view/service'
    // });
    // this.route('ireos/map', {
    //     path: '/ireos-map',
    //     template: 'ireos_map'
    // });
    // this.route('ireos/listing-seller', {
    //     path: '/listing-seller',
    //     template: 'listing_seller'
    // });
    // this.route('/ireos/new-ireo-property-info', {
    //     path: '/new-ireo-property-info',
    //     template: 'new_ireo_property_info'
    // });
    // this.route('/ireos/due-diligence', {
    //     path: '/due-diligence',
    //     template: 'due_diligence'
    // });
    // this.route('/ireos/skip-due-diligence', {
    //     path: '/skip-due-diligence',
    //     template: 'skip_due_diligence'
    // });
    // this.route('/ireos/ireo-submitted', {
    //     path: '/ireo-submitted',
    //     template: 'ireo_submitted'
    // });
    // this.route('/ireos/ireo-fail', {
    //     path: '/ireo-fail',
    //     template: 'ireo_fail',
    // });
    // this.route('ireonew1', {
    //     path: '/ireo/new/1',
    //     template: 'ireo_new_1'
    // });
    // this.route('ireonew2', {
    //     path: '/ireo/new/2',
    //     template: 'ireo_new_2'
    // });
    // this.route('ireonew3', {
    //     path: '/ireo/new/3',
    //     template: 'ireo_new_3'
    // });
    // this.route('property_info', {
    //     path: '/property_info',
    //     template: 'property_info'
    // });
    // this.route('under_contract', {
    //     path: '/under_contract',
    //     template: 'under_contract'
    // });
    // this.route('lrets/view', {
    //     path: '/lret/:_id',
    //     template: 'lret_view'
    // });
    // this.route('lrets/map', {
    //     path: '/lrets-map',
    //     template: 'lrets_map'
    // });
    // this.route('sellers/all', {
    //     path: '/sellers',
    //     template: 'sellers'
    // });
    // this.route('sellers/profile', {
    //     path: '/seller-profile',
    //     template: 'seller_profile'
    // });
    // this.route('sellers/pdf-preview', {
    //     path: '/pdf-preview',
    //     template: 'pdf_preview'
    // });
    // this.route('us-investors', {
    //     path: '/us-investors',
    //     template: 'us_investors'
    // });
    // this.route('verify-identity', {
    //     path: '/verify-identity',
    //     template: 'verify_identity',
    //     layoutTemplate: 'outerLayout'
    // });
});
