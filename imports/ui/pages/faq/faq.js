import './faq.html';
import '../../stylesheets/faq.scss';

Template.faq.onCreated(function () {
});

Template.faq.helpers({
});

Template.faq.events({
	'click li': function(event, template){
		if(!$(event.currentTarget).hasClass('selected')){
			$('.selected').removeClass('selected');
			$('.answer').hide(300);
			$(event.currentTarget).addClass('selected');
			$('.answer',$(event.currentTarget)).show(300);
		}
	},
	'submit #make_new': function(event, template){
		if($('#question_input').val().length > 0 && $('#answer_input').val().length > 0)
		{
			let question = $('#question_input').val();
			let answer = $('#answer_input').val();
			$('#question_input').val(' ');
			$('#answer_input').val(' ');
			Meteor.call('faq.add_qa', question, answer, 1);
			
		}
	},
	'submit .remove_qa': function(event, template){
		let id = event.currentTarget.id;
		return Meteor.call('faq.remove_qa', id);
	}
});
