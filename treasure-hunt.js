var axios = require('axios');
require('dotenv').config();
//Set up map
var map = {};
currentRoom = {};

const init = () => {
	let initURL = 'https://lambda-treasure-hunt.herokuapp.com/api/adv/init/';
	const apiKey = 'Token ' + process.env.API_KEY;
	const options = {
		headers: {
			Authorization: apiKey
		}
	};
	axios
		.get(initURL, options)
		.then(response => {
			currentRoom = response.data;
			console.log(currentRoom);
			exitsObj = {};
			currentRoom.exits.forEach(exit => {
				exitsObj[exit] = '?';
			});
			map[currentRoom.room_id] = exitsObj;
			console.log(map);
		})
		.catch(err => console.log(err));
};

moveAround = () => {
	let currentRoom = this.state.currentRoom;
	console.log('Current room:', currentRoom.room_id);
	console.log('Current map:');
	let map = JSON.parse(localStorage.getItem('map'));
	console.log(map);
	let currentRoomExits = map[currentRoom.room_id];

	let unexplored = [];
	console.log(currentRoomExits);

	for (let direction in currentRoomExits) {
		console.log(direction);
		if (currentRoomExits[direction] === '?') {
			unexplored.push(direction);
		}
	}
	console.log(unexplored);
	if (unexplored.length > 0) {
		// go to room
		let direction = unexplored.pop();
		this.travel(direction);
	} else {
		//reached a dead end
		//back track to prev room with unexplored exits
		console.log(
			'no unexplored exits available in room ' +
				currentRoom.room_id +
				', need to go back'
		);

		if (!(currentRoom.room_id in map)) {
			console.log('map does not have current room in graph');
		}
		let path = this.backtrack(currentRoom.room_id);
		if (path === null) {
			// no more unexplored rooms
			console.log('done traversing!');
		} else {
			console.log('path', path);
			let directions_to_shortest = [];
			let currentRoom = path.shift();
			console.log(currentRoom);
			console.log('map[currentRoom]', map[currentRoom]);
			for (let room of path) {
				for (let direction in map[currentRoom]) {
					console.log(direction);
					if (map[currentRoom][direction] === room) {
						directions_to_shortest.push(direction);
						// currentRoom = room;
						// break;
					}
				}
			}
			for (let direction of directions_to_shortest) {
				setTimeout(
					this.travel(direction),
					this.state.currentRoom.cooldown * 1000
				);
			}
		}
	}
};

const travel = dir => {
	console.log('lets travel ' + dir.toUpperCase());
	const data = { direction: dir };
	const moveURL = 'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/';
	const options = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Token ' + process.env.API_KEY
		}
	};
	//check to see if we know what room is in that direction
	let next_room_id = null;
	const map = JSON.parse(localStorage.getItem('map'));
	if (this.state.currentRoom.room_id in map) {
		if (map[this.state.currentRoom.room_id][dir] != '?') {
			next_room_id = map[this.state.currentRoom.room_id][dir];
			data[next_room_id] = next_room_id;
		}
	}

	axios
		.post(moveURL, data, options)
		.then(response => {
			return response.data;
		})
		.catch(err => console.log(err));
};
take = () => {
	const takeURL = 'https://lambda-treasure-hunt.herokuapp.com/api/adv/take/';
	const apiKey = 'Token ' + process.env.REACT_APP_API_KEY;
	const options = {
		headers: {
			Authorization: apiKey
		}
	};

	const data = {
		name: 'treasure'
	};

	axios
		.post(takeURL, data, options)
		.then(response => {
			console.log(response.data);
		})
		.catch(err => console.log(err));
};

drop = () => {
	const takeURL = 'https://lambda-treasure-hunt.herokuapp.com/api/adv/drop/';
	const apiKey = 'Token ' + process.env.REACT_APP_API_KEY;
	const options = {
		headers: {
			Authorization: apiKey
		}
	};

	const data = {
		name: 'treasure'
	};

	axios
		.post(takeURL, data, options)
		.then(response => {
			console.log(response.data);
		})
		.catch(err => console.log(err));
};

backtrack = currentRoom => {
	let q = [];
	let visited = new Set();
	let map = JSON.parse(localStorage.getItem('map'));
	q.push([currentRoom]);
	while (q.length > 0) {
		let path = q.shift();
		console.log('path', path);

		let node = path[path.length - 1];
		console.log('node ', node);
		console.log(map);
		console.log('map[node]', map[node]);
		if (!visited.has(node)) {
			visited.add(node);
			for (let [exit, room] of Object.entries(map[node])) {
				console.log('exit', exit);
				if (map[node][exit] == '?') {
					return path;
				} else {
					let path_copy = path.slice();
					path_copy.push(map[node][exit]);
					q.push(path_copy);
				}
			}
		}
	}
	return null;
};

const traverse = () => {
	//need to call moveAround ?
	console.log('Begin traversing...');
	// get map from state
	// while map.length < 500
	// travel in an unexplored direction from current room
	// save what room that direction leads to in map, and vice versa (fill out graph)
	// if reached a dead end, use BFS to go back
	//save map to state and local storage

	let i = 0;

	while (i < 5) {
		console.log('Current room: ' + currentRoom);
		//let currentRoomExits = this.state.map[this.state.currentRoom.room_id];
		console.log(currentRoom);
		let currentRoomExits = currentRoom.exits;
		let unexplored = [];
		for (let direction in currentRoomExits) {
			unexplored.push(direction);
		}
		console.log(unexplored);

		if (unexplored.length > 0) {
			let direction = unexplored.pop();
			let prevRoomId = currentRoom.room_id;
			setInterval(() => {
				currentRoom = travel(direction);

				// let exitsObj = {};
				// this.state.currentRoom.exits.forEach(exit => {
				// 	exitsObj[exit] = '?';
				// });
				// map[prevRoomId][direction] = this.state.currentRoom.room_id;
				// exitsObj[this.inverse_directions(direction)] = prevRoomId;
				// map[this.state.currentRoom.room_id] = exitsObj;
			}, this.state.currentRoom.cooldown * 1000);
			console.log(map);
		} else {
			//reached a dead end
		}
		i++;
	}
};

init();
console.log(currentRoom);
traverse();
