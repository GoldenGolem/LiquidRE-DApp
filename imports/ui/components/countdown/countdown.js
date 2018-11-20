import './countdown.html';
import './countdown.scss';

Template.countdown.onCreated(function() {
    var self = this;
    var end = moment.unix(this.data.endDate);
    this.ended = new ReactiveVar(false);
    this.days = new ReactiveVar(0);
    this.hours = new ReactiveVar(0);
    this.minutes = new ReactiveVar(0);
    this.seconds = new ReactiveVar(0);

    function updateCountdown() {
        var now = moment();
        var seconds = end.diff(now, 'seconds');
        var d = end.diff(now, 'days');
        var h = end.diff(now, 'hours') - (d * 24);
        var m = end.diff(now, 'minutes') - (d * 1440) - (h * 60) ;
        var s = seconds - (d * 86400) - (h * 3600) - (m * 60);
        self.days.set(d < 10 ? `0${d}` : d);
        self.hours.set(h < 10 ? `0${h}` : h);
        self.minutes.set(m < 10 ? `0${m}` : m);
        self.seconds.set(s < 10 ? `0${s}` : s);
        if(seconds <= 0) {
            clearInterval(timeinterval);
            self.ended.set(true);
        }
    }
    updateCountdown();
    var timeinterval = setInterval(updateCountdown, 1000);
});

Template.countdown.helpers({
    endDate() {
        return Template.instance().data.endDate;
    },
    isEnded() {
        return Template.instance().ended.get();
    },
    getDays() {
        return Template.instance().days.get();
    },
    getHours() {
        return Template.instance().hours.get();
    },
    getMinutes() {
        return Template.instance().minutes.get();
    },
    getSeconds() {
        return Template.instance().seconds.get();
    }
})
