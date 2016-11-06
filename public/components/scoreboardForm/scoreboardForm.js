(function () {
	'use strict';

	const Form = window.Form;
	const Input = window.Input;
	const Button = window.Button;
	const Block = window.Block;
	const User = window.User;
	const Link = window.Link;
	const UsersCollection = window.UsersCollection;
	//const fest = window.fest['templates/scoreboard.tmpl'];
	class ScoreForm extends Form {
		constructor(options) {
			super(options);

			this._back = new Link('Go Back', {attrs: {href: 'back'}});
			this._users = new UsersCollection();
			this._users.sort();
			//this._el.innerHTML = fest({items: this._users.getData()});
			this.append(this._back._get());

		}
	}

	window.ScoreForm = ScoreForm;

})();
