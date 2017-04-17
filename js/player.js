var Player = function(game) {

	GameObject.call(this, 'player', game);

	this.body = null;

	this.directions = [0, 0];

	this.rotations = [0, 0];

	var vertexData = BABYLON.vertexData.CreateSphere(16, 0.75, BABYLON.Mesh.DEFAULTSIDE);
	vertexData.applyToMesh(this);

	this.position.y = Player.START_HEIGHT;

	var _this = this;

	this.getScene().registerBeforeRender(function() {

		if(_this.position.y < -10) {
			_this.game.reset();
		}
	}); 
};

Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;