(function () {
	'use strict';

	const fetch = window.fetch;
	/**
	 *
	 */
	class Model {

		constructor(attributes = {}) {
			this.attributes = Object.assign({}, this.defaults, this._clean(attributes));
		}

		get defaults() {
			return {};
		}

		get url() {
			return '/';
		}

		/**
		 *
		 * @param method
		 * @param data
		 * @returns {Promise}
		 */

		_clean(attributes) {
			Object.keys(attributes).forEach(key => {
				if (attributes[key] === undefined) {
					delete attributes[key];
				}

				if (typeof attributes[key] === 'object' && attributes[key] !== null) {
					this._clean(attributes[key]);
				}
			});
			return attributes;
		}

		_send(url, method, params) {
			return fetch('https://morning-hamlet-29496.herokuapp.com/' + url, {
				method: method,
				body: JSON.stringify(params.body),
				mode: 'cors',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			}).then(function (resp) {
				if (resp.status < 300) {
					return resp.json();
				}
				return Promise.reject(resp.json());
			}).then(function (answer) {
				console.log(answer);
				params.attrs.forEach(name => {
					window.localStorage.setItem(name.toLowerCase(), answer[name]);
				});
				if (window.localStorage.getItem('userid') === '101') {
					window.localStorage.clear();
					throw new Error();
				}
				if (params.oneMore) {
					let newUrl = 'api/sessions';
					params.attrs = ['sessionid'];
					params.body = {
						login : params.body.login,
						password :params.body.password
					};
					params.oneMore = false;
					this.save(newUrl, params)
				}
				return {};
			}.bind(this)).catch(function (data) {
				if (this.params.func === 'signin') {
					this._errorText = 'Такого пользователя не существует. Попробуйте еще раз';
				} else {
					this._errorText = 'Такого пользователя существует. Попробуйте еще раз';
				}
				return Promise.reject();
			}.bind(this));
		}

		save(url, params) {
			const method = 'POST';
			return this._send(url, method, params);
		}

		getInfo(url, params) {
			const method = 'GET';
			return this._send(url, method, params);
		}

		deleteInfo(sessionid) {
			const method = 'DELETE';
			return fetch('https://morning-hamlet-29496.herokuapp.com/api/sessions/' + sessionid, {
				method: 'DELETE',
				mode: 'cors'
			}).then(function () {
				window.localStorage.clear();
			}).catch(function (resp) {
				console.log(JSON.parse(resp.body).error || 'Неизвестная ошибка. Попробуйте позже');
			});
		}

		getError(){
			return this._errorText;
		}
	}

	// export
	window.Model = Model;
})();
