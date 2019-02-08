var axios = require('axios');

//Set up map
var map = {};
currentRoom = {};

const init = () => {
	let initURL = 'https://lambda-treasure-hunt.herokuapp.com/api/adv/init/';
	const apiKey = 'Token ' + '30e68dddf4426b85e7c98644cf2feb9c5a3d302a';
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

const travel = dir => {
	console.log('lets travel ' + dir.toUpperCase());
	const data = { direction: dir };
	const moveURL = 'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/';
	const options = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Token ' + '30e68dddf4426b85e7c98644cf2feb9c5a3d302a'
		}
	};

	axios
		.post(moveURL, data, options)
		.then(response => {
			return response.data;
		})
		.catch(err => console.log(err));
};

const traverse = () => {
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
		for (let direction of currentRoomExits) {
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
