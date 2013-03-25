/*
WARNING: This code is not awesome.
*/
var tictactoe3d = (function() {
	var _cam = document.getElementById('Cam');
	var stage;
	var allCubes;
	var turn = 'red';
	var redScoreNode = document.getElementById('RedScore');
	var blueScoreNode = document.getElementById('BlueScore');
	
	/*
	// with center
	var wins = [
		[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6],[9,10,11],[12,13,14],[15,16,17],[9,12,15],[10,13,16],[11,14,17],[9,13,17],[11,13,15],[18,19,20],[21,22,23],[24,25,26],[18,21,24],[19,22,25],[20,23,26],[18,22,26],[20,22,24],[0,9,18],[3,12,21],[6,15,24],[0,12,24],[6,12,18],[1,10,19],[4,13,22],[7,16,25],[1,13,25],[7,13,19],[2,11,20],[5,14,23],[8,17,26],[2,14,26],[8,14,20],[0,10,20],[2,10,18],[3,13,23],[5,13,21],[6,16,26],[8,16,24],[0,13,26],[2,13,24],[6,13,20],[8,13,18]
	];
	
	*/
	// no center
	var wins = [
		[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6],[9,10,11],[15,16,17],[9,12,15],[11,14,17],[18,19,20],[21,22,23],[24,25,26],[18,21,24],[19,22,25],[20,23,26],[18,22,26],[20,22,24],[0,9,18],[3,12,21],[6,15,24],[0,12,24],[6,12,18],[1,10,19],[7,16,25],[2,11,20],[5,14,23],[8,17,26],[2,14,26],[8,14,20],[0,10,20],[2,10,18],[6,16,26],[8,16,24]
	];


		
	var htmlBuilder = (function() {
		var getCube = function() {
			var cubeHtml = '<div class="cube"><div class="cube-front"></div><div class="cube-back"></div><div class="cube-top"></div><div class="cube-bottom"></div><div class="cube-left"></div><div class="cube-right"></div></div>';
			return cubeHtml;
		};

		var getRow = function() {
			var rowHtml = '<div class="row">';
			for (var i=0; i<3; i++) {
				rowHtml += getCube();
			}
			return rowHtml + '</div>';
		};

		var getStack = function() {
			var stackHtml = '<div class="stack">';
			for (var iRow=0; iRow<3; iRow++) {
				stackHtml += getRow();
			}
			return stackHtml + '</div>';
		};

		var getStage = function() {
			var stageHtml = '<div class="allCubes">';
			for (var iStack=0; iStack<3; iStack++) {
				stageHtml += getStack();
			}
			return stageHtml + '</div>';
		};
		
		return {
			getStage: getStage
		};
		
	})();



	var getCubeValues = function() {
		var arr = [];
		for (var i=0, iLen=allCubes.length; i<iLen; i++) {
			var cube = allCubes[i];
			var cubeVal = '';
			if (cube.classList.contains('red')) {
				cubeVal = 'red';
			} else if (cube.classList.contains('blue')) {
				cubeVal = 'blue';
			}
			arr.push(cubeVal);
		}
		return arr;
	};



	var compareWinValue = function(vals) {
		var score = 0;
		
		var winFunc = function(el) {
			return vals.indexOf(el) !== -1;
		};
		
		for (var i=0,iLen = wins.length; i<iLen; i++) {
			var winner = wins[i].every(winFunc);
			if (winner) {
				score++;
			}
		}
		return score;
	};



	var checkWins = function() {
		var cubeVals = getCubeValues();
		
		var redVals = getIndexesOf(cubeVals, 'red');
		var blueVals = getIndexesOf(cubeVals, 'blue');
		
		var redScore = compareWinValue(redVals);
		var blueScore = compareWinValue(blueVals);
		
		redScoreNode.innerHTML = redScore;
		blueScoreNode.innerHTML = blueScore;
		
		var done = getIndexesOf(cubeVals, '');
		
		if (done.length <= 1) { // no center
			// game over
			if (redScore > blueScore) {
				displayActivePlayer('red');
				redScoreNode.parentNode.style.color = '#FFF';
			}
			if (blueScore > redScore) {
				displayActivePlayer('blue');
				blueScoreNode.parentNode.style.color = '#FFF';
			}
			if (redScore === blueScore) {
				displayActivePlayer('both');
			}
			
			_cam.style.webkitAnimationName = 'winspin';
			_cam.style.animationName = 'winspin';
			
			return true;
		}
		return false;
	};



	var getIndexesOf = function(arr, val) {
		var indexes = [];
		var start = 0;
		var idx;
		while ((idx = arr.indexOf(val, start)) != -1) {
			indexes.push(idx);
			start = idx + 1;
		}
		return indexes;
	};



	var takeTurn = function() {
		if (checkWins()) {
			return;
		}
		
		turn = (turn === 'red') ? 'blue' : 'red';
		
		displayActivePlayer(turn);
	};



	var displayActivePlayer = function(player) {
		if (player === 'red') {
			redScoreNode.parentNode.classList.add('active');
			blueScoreNode.parentNode.classList.remove('active');
		} else if (player === 'blue') {
			redScoreNode.parentNode.classList.remove('active');
			blueScoreNode.parentNode.classList.add('active');
		} else if (player === 'both') {
			redScoreNode.parentNode.classList.add('active');
			blueScoreNode.parentNode.classList.add('active');
		}
	};



	var cubeSelect = function(cubeNode) {
		if (cubeNode.classList.contains('red') || cubeNode.classList.contains('blue')) {
			return;
		}
		cubeNode.classList.add(turn);
		takeTurn();
	};



	var init = function(camId) {
		stage = document.getElementById(camId);
		stage.innerHTML = htmlBuilder.getStage();
		
		allCubes = document.getElementsByClassName('cube');
		allCubes[13].style.visibility = 'hidden'; // no center
		

		stage.addEventListener('click', function(ev) {
			if (camControl.getMouseUp()) {
				ev.preventDefault();
				ev.stopPropagation();
				return false;
			}
			
			var target = ev.target;
				
			if (!target.classList.contains('cube')) {
				target = target.parentNode;
			}
			
			if (target.classList.contains('cube')) {
				cubeSelect(target);
			}
		});
		
	};
	
	
	return {
		init: init
	};


})();

if ('ontouchstart' in window) {
    new Motionizer('Cam');
}

var camControl = (function() {
	var _cam = document.getElementById('Cam');
	var _enabled = false;
	var _tiltMultiplier = 105;
	var _mouseUp = false;

	var _lastX = 0;
	var _lastY = 0;
	var _curX = 0;
	var _curY = 0;

	var _tiltX = -20 / _tiltMultiplier;
	var _tiltY = -25 / _tiltMultiplier;
	
	document.addEventListener('mousemove', function(event) {
		_curX = event.pageX;
		_curY = event.pageY;
		
		if (!_enabled || _curX === 0 || _curY === 0) return;
		
		var dx = _curX - _lastX;
		var dy = _curY - _lastY;
		
		_tiltX += - dy / _lastY;
		_tiltY += dx / _lastX;
		
		_lastX = _curX;
		_lastY = _curY;
		
		_cam.style.webkitTransform = 'rotateX(' + (_tiltX*_tiltMultiplier) + 'deg) rotateY(' + (_tiltY*_tiltMultiplier) + 'deg)';
		_cam.style.transform       = 'rotateX(' + (_tiltX*_tiltMultiplier) + 'deg) rotateY(' + (_tiltY*_tiltMultiplier) + 'deg)';
	});

	document.addEventListener('mousedown', function(e) {
		if (e.shiftKey && !_enabled) {
			_enabled = true;
			_lastX = _curX;
			_lastY = _curY;
		}
	});
	document.addEventListener('mouseup', function(e) {
		if (_enabled) {
			_enabled = false;
			
			_mouseUp = true;
			setTimeout(function() {
				_mouseUp = false;
			}, 10);
		}
	});
	
	return {
		getMouseUp: function() {
			return _mouseUp;
		}
	};
})();