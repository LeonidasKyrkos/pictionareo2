// Setting and getting handler

// libraries
const _ = require('lodash');

class SetGetters {
	constructor(App) {
		this.App = App;
		this.App.game = this.App.game;
		this.App.game.store = this.App.game.store;
	}

	setStore(store={}) {
		// Not storing the paths remotely so just cloning them onto each new store as they come through.
		store.paths = _.clone(this.App.game.store.paths);
		this.App.game.store = store;

		// Emit event informing the application that the store has been altered
		this.App.events.emit('store_updated');
	}

	setGameStoreProperty(property='',state) {
		this.App.data.setChild(property,state);
	}

	setGameProperty(property='',state) {
		this.App.game[property] = state;
	}

	// set a property on an individual player
	setPlayerProperty(player,property,value) {
		let playerObj = Object.assign({},player);
		playerObj[property] = value;

		this.App.data.setPlayer(player.id, player);
	}

	// Set a property for all currently active players
	setPlayersProperty(property,value) {
		let players = this.App.game.store.players || {};

		for(let player in players) {
			players[player][property] = value;
		}
	}

	// Set puzzle DUHHHHH
	setPuzzle(puzzle) {
		let data = this.getPuzzleAndClueArrays(puzzle);

		this.setGameProperty('puzzle',puzzle);
		this.setGameProperty('puzzleArray',data.puzzleArray);
		this.setGameProperty('clue',data.clueArray)
	}

	// Add player to the garbage queue to be cleared by the interval
	addToGarbage(player) {
		this.App.game.garbageQueue.push(player);
	}

	// Get puzzle DUHHHHHHHHHHHHHHHH
	getPuzzle() {
		if(!this.App.game.dictionary.length) {
			this.setGameProperty('dictionary',this.App.game.dictionaryBackup.slice(0));
		}

		let max = this.App.game.dictionary.length - 1;
		let random = Math.floor(Math.random() * (max-1)) + 1;
		let puzzle = this.App.game.dictionary[random];
		this.App.game.dictionary.splice(random,1);

		return puzzle;
	}

	// Get clue DUHHHHHHHHHHHHHHHHHHHHHHHHHHH
	getClue() {
		let random = Math.floor((Math.random() * this.App.game.puzzleArray.length));
		let random2 = Math.floor((Math.random() * this.App.game.puzzleArray[random].length));

		this.App.game.clue[random][random2] = this.App.game.puzzleArray[random][random2];
	}

	// Create and return arrays of puzzle and clue
	getPuzzleAndClueArrays(puzzle) {
		let words = puzzle.split(' ');
		let puzzleArray = [];
		let clueArray = [];

		// loop through the words and create arrays for them inside of puzzleArray and cluearray
		words.forEach((word,index)=>{
			puzzleArray[index] = puzzleArray[index] || [];
			clueArray[index] = clueArray[index] || [];

			for(let i = 0; i < word.length; i++) {
				puzzleArray[index].push(word.charAt(i));
				clueArray[index].push('_');
			}
		});

		return { puzzleArray: puzzleArray, clueArray: clueArray };
	}

	// Get dictionary and set it
	getDictionary(dictionary='default') {
		let promise = this.App.data.getDictionary(dictionary);

		promise.then((snapshot)=>{
			this.App.game.dictionary = [];

			// make an array out of our dictionary object and lowercase everything.
			for(let word in snapshot) {
				this.App.game.dictionary.push(word.toLowerCase());
			}

			this.setGameProperty('dictionaryBackup',this.App.game.dictionary.slice(0));
		});	
	}

	getRemainingPlayers() {
		let players = this.App.game.store.players;

		return _.filter(players,(player)=>{ return player.turns < this.App.game.settings.rounds });
	}

	getIntRemainingGuessers() {
		let players = this.App.game.store.players || {};
		let playersArr = Object.keys(players) || [];
		
		return playersArr.length - this.App.game.garbageQueue.length;
	}

	getBoolRemainingTurns() {
		return _.find(this.App.game.store.players, (player)=>{
			return player.turns < this.App.game.settings.gameLength;
		});
	}
}

module.exports = SetGetters;