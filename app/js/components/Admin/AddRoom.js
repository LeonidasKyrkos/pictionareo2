import React, { Component } from 'react';
import RenderOptions from './RenderOptions';

export default class AddRoom extends Component {
	constructor(props) {
		super(props);
	}

	addRoom(e) {
		let data = {
			title: this.refs.title.value,
			password: this.refs.password.value,
			dictionary: this.refs.dictionary.value,
			clock: 90,
			status: 'pending'
		}

		this.props.socket.emit('spawn room',data);
		this.clearRefs();
	}

	clearRefs() {
		for(let ref in this.refs) {
			this.refs[ref].value = '';
		}
	}

	render() {
		return(
			<tr>
				<td><input className="form__input" type="text" ref="title" /></td>
				<td><input className="form__input" ref="password" type="text" /></td>
				<td>
					<RenderOptions defaultValue="test" ref="dictionary" obj={this.props.dictionarys} />
				</td>
				<td><button onClick={this.addRoom.bind(this)} className="btn--tertiary">Add room</button></td>
			</tr>
		)
	}
}