import React, { Component } from 'react';
import Store from '../../stores/Store';
import _ from 'lodash';

export default class WaitingMsgClient extends Component {
	constructor() {
		super();
		this.state = Store.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		Store.listen(this.onChange);
	}

	componentWillUnmount() {
		Store.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
	}

	shouldComponentUpdate(nextProps,nextState) {

		// test for status change
			if(this.state.store.status && nextState.store.status !== this.state.store.status) {
				return true;
			}

		// test for captain change
			let currentCaptain = _.find(this.state.store.players,{ status: "painter" });
			let newCaptain = _.find(nextState.store.players,{ status: "painter" });

			let currentId = currentCaptain ? currentCaptain.id : 0;
			let newId = newCaptain ? newCaptain.id : 0;

			if(currentId !== newId) {
				return true;
			}

		return false;
	}

	renderContent() {
		if(this.state.store.status && this.state.store.status !== 'pending') { 
			return <span className="hide"></span>
		} else {
			if(this.state.store.players && _.find(this.state.store.players,{ status: 'painter' })) {
				var name = _.find(this.state.store.players,{ status: 'painter' }).name;
			} else {
				var name = 'the artist';
			}

			return <span className="game__message">Waiting for {name} to start the game</span>
		}
	}

	render() {
		let content = this.renderContent();

		return content;
	}
}