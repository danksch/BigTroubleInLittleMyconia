window.addEventListener('DOMContentLoaded', function() {
	new Game('gameCanvas');
}, false);	

var Game = function(canvasId) {
	var canvas = document.getElementById(canvasId);
	this.engine = new BABYLON.Engine(canvas, true);

	this.scene = this._initScene(this.engine);

	this.assets = [];

	this.player = null;

	this.level = null;

	this._initGame();

	var _this = this;
	this.engine.runRenderLoop(function() {
		_this.scene.render();
	});
};

Game.prototype._initScene = function(engine) {

	var scene = new BABYLON.Scene(engine);

	var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3.Zero(), scene);

	camera.position.y = 8;
	camera.position.z = -12;
	camera.position.x = 16;
	
	var targetVec = new BABYLON.Vector3(16, 1, 7);	
	camera.setTarget(targetVec);
	camera.attachControl(engine.getRenderingCanvas());

	return scene;
}

	var canvas = document.getElementById('renderCanvas');

	var engine = new BABYLON.Engine(canvas, true);

	var createScene = function() {


		var scene = new BABYLON.Scene(engine);
		scene.clearColor = new BABYLON.Color3(0, 1, 0); 

		// var assetsManager = new BABYLON.AssetsManager(scene);
		// var textureTask = assetsManager.addTextureTask("image task", "assets/BackgroundPlains.png");
		// textureTask.onSuccess = function(task) {
		//     console.log(task.texture.width);
		//     console.log(task.texture.height);
		//     var width = task.texture.width;
		//     var height = task.texture.height;
		//     var bgPlane = BABYLON.MeshBuilder.CreatePlane('bgPlane', {'width' : width / 100, 'height' : height / 100, 'updatable' : true, 'sideOrientation' : BABYLON.Mesh.DEFAULTSIDE}, scene);
		//     var bgMaterial = new BABYLON.StandardMaterial('bgMaterial', scene);
		// 	bgMaterial.diffuseTexture = new BABYLON.Texture(task.texture, scene);  
		// 	// bgPlane.position.y = task.image.height / 2;
		// 	// bgPlane.position.z = 50;
		// }
		// assetsManager.load();		
		
		//var light = new BABYLON.HemisphericLight('Light', new BABYLON.Vector3(0, 15, 0), scene);
		// light.diffuse = new BABYLON.Color3(1, 1, 1);
		// light.specular = new BABYLON.Color3(1, 1, 1);
		// light.groundColor = new BABYLON.Color3(0, 0, 0);
		//var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
		var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3.Zero(), scene);
		camera.position.y = 8;
		camera.position.z = -12;
		camera.position.x = 16;
		//camera.rotation.x = -Math.PI * 3;
		var targetVec = new BABYLON.Vector3(16, 1, 7);
		// camera.setTarget(BABYLON.Vector3.Zero());
		camera.setTarget(targetVec);
		camera.attachControl(canvas, false);
		
		var cameraAngle = camera.rotation.x;


		// Sprite player unit.
		var spriteManagerPlayer = new BABYLON.SpriteManager('playerManager', 'assets/CharacterYellowfoot.png', 1, 128, scene);
		var player = new BABYLON.Sprite('player', spriteManagerPlayer);
		player.size = 2;
		//player.invertU = true;
		player.position.y = 1;
		player.position.x = 9;
		player.position.z = 5;

		//player.playAnimation(0, 10, true, 100);

		// Cursor controls.
		// scene.actionManager = new BABYLON.ActionManager(scene);
		// scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
		// 	if (evt.sourceEvent.key == "d") {
		// 		player.invertU = true;
		// 		player.position.x += 1;
		// 		player.playAnimation(0, 10, false, 75);
		// 	}
		// 	else if (evt.sourceEvent.key == "w") {
		// 		player.invertU = true;
		// 		player.position.z += 1;
		// 		player.playAnimation(0, 10, false, 75);
		// 	}
		// 	else if (evt.sourceEvent.key == "a") {	
		// 		player.invertU = false;					
		// 		player.position.x -= 1;
		// 		player.playAnimation(0, 10, false, 75);
		// 	}
		// 	else if (evt.sourceEvent.key == "s") {
		// 		player.invertU = true;
		// 		player.position.z -= 1;
		// 		player.playAnimation(0, 10, false, 75);
		// 	}
		// }));

						
		
						 
		


		var multiMaterial = new BABYLON.MultiMaterial("multi", scene);				

		// Load different textures.
		// *TO DO*: Implement Assets-manager.
		var grassMaterial1 = new BABYLON.StandardMaterial("Grass1", scene);
		grassMaterial1.emissiveTexture = new BABYLON.Texture("assets/TilesGrassVariant0_128.png", scene);  

		var grassMaterial2 = new BABYLON.StandardMaterial("Grass2", scene);
		grassMaterial2.emissiveTexture = new BABYLON.Texture("assets/TilesGrassVariant1_128.png", scene); 

		var grassMaterial3 = new BABYLON.StandardMaterial("Grass3", scene);
		grassMaterial3.emissiveTexture = new BABYLON.Texture("assets/TilesGrassVariant2_128.png", scene);  

		var grassMaterial4 = new BABYLON.StandardMaterial("Grass4", scene);
		grassMaterial4.emissiveTexture = new BABYLON.Texture("assets/TilesGrassVariant3_128.png", scene);  

		var grassMaterial5 = new BABYLON.StandardMaterial("Grass5", scene);
		grassMaterial5.emissiveTexture = new BABYLON.Texture("assets/TilesGrassVariant4_128.png", scene);  


		var gridMaterial = new BABYLON.GridMaterial('gridMaterial', scene)
		gridMaterial.majorUnitFrequency = 0;			
		gridMaterial.gridRatio = 2;
		gridMaterial.opacity = 0.9;			


		var parameters = {
			"width" : 40,
			"height" : 12, 
			"updatable" : false,
			"sideOrientation" : BABYLON.Mesh.DEFAULTSIDE
		};
		
		// var plane = BABYLON.MeshBuilder.CreatePlane('Grid', parameters, scene);				
		// plane.rotation.x = Math.PI / 2; 

		// plane.material = gridMaterial;
		// plane.position.x = 20;
		// plane.position.y = 0.01;
		// plane.position.z = 6;
		// plane.visibility = 0;

		
		// Create a grid that resembles the ground.   
		//var grid = {};				
		var tileSize = 2;
		var gridHeight = 6 * tileSize;
		var gridWidth = 20 * tileSize;

		/* This box is needed to "group" the different tiles,
			 so that we can move them all at once (rotation later, e.g.).
			 Since we don't want to exactly merge the meshes 
			 (we must be able to access them individually!), we keep them as 
			 children of the invisible box. */ 					 
		var anchorBox = new BABYLON.Mesh.CreateBox('anchor', 0.1, scene);				
		anchorBox.position = new BABYLON.Vector3(0, 0, 0);
		//anchorBox.rotation.x = Math.PI / 2;
				
		// Iterate through rows and columns.
		for (var x = 0 + tileSize / 2; x < gridWidth; x += tileSize) {					
			for (var z = 0 + tileSize / 2; z < gridHeight; z += tileSize) {

				var tile = BABYLON.Mesh.CreatePlane('tile_' + x + '_' + z, tileSize, scene);
				tile.position = new BABYLON.Vector3(x , 0, z);
				tile.rotation.x = Math.PI / 2;
				console.log(tile.id);
				tile.actionManager = new BABYLON.ActionManager(scene);
					var action = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, tile, "visibility", 0.2, 500);
					var action2 = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, tile, "visibility", 1.0, 500);						

				// var action3 = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function() {

				// 	var animationPlayer = new BABYLON.Animation("playerAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT); 

				// 	var nextPos = player.position.add(new BABYLON.Vector3(tile.getAbsolutePosition().x, 0, tile.getAbsolutePosition().z));

				// 	var keysPlayer = [];
				// 	keysPlayer.push({ frame: 0, value: player.position });
				// 	keysPlayer.push({ frame: 120, value: nextPos });
				// 	animationPlayer.setKeys(keysPlayer);

				// 	var easingFunction = new BABYLON.CircleEase();
				// 	easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
				// 	animationPlayer.setEasingFunction(easingFunction);
				// 	player.animations.push(animationPlayer);

				// 	scene.beginAnimation(player, 0, 120, false);
				// 	console.log(tile.position);
				// 	console.log(tile.getAbsolutePosition());
				// 	console.log(anchorBox.position);
				// 	console.log(anchorBox.getAbsolutePosition());
				// 	console.log(scene);
				// });

				tile.actionManager.registerAction(action);
				tile.actionManager.registerAction(action2);
				//tile.actionManager.registerAction(action3);

				// Distribute tile textures randomly.
				var randomNumber = Math.floor(Math.random() * 5);
				if (randomNumber == 0) 
					tile.material = grassMaterial1;						
				else if (randomNumber == 1) 
					tile.material = grassMaterial2;						
				else if (randomNumber == 2) 
					tile.material = grassMaterial3;
				else if( randomNumber == 3)
					tile.material = grassMaterial4;
				else
					tile.material = grassMaterial5;						
				
				// Make box a parent.
				tile.parent = anchorBox;
				console.log(tile.id);
				
			}
		}

		

		// Place it in the xz-layer.
		//anchorBox.rotation.x = Math.PI / 2;
		
		//console.log(anchorBox.getChildren());
	// 				anchorBox.getChildren().forEach(function(_child) {
	// _child.computeWorldMatrix(true);

	// 					_child.actionManager = new BABYLON.ActionManager(scene);
	// 					var action = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, _child, "visibility", 0.2, 1000);
	// 					_child.actionManager.registerAction(action); 

	// 				}, this);

		// Texture for background plane.
		var bgMaterial = new BABYLON.StandardMaterial('bgMaterial', scene);
		bgMaterial.emissiveTexture = new BABYLON.Texture("assets/BackgroundPlains.png", scene);  
		//bgMaterial.specularTexture = bgMaterial.emissiveTexture;
		bgMaterial.opacityTexture = bgMaterial.emissiveTexture;
		//bgMaterial.diffuseTexture = bgMaterial.emissiveTexture;
		bgMaterial.hasAlpha = true;
		bgMaterial.emissiveTexture.hasAlpha = true;				
		bgMaterial.useAlphaFromEmissiveTexture;
		
		// bgMaterial.backFaceCulling = false;
		//bgMaterial.emissiveTexture.anisotropicFilteringLevel = 1;
		//bgMaterial.emissiveTexture.getAlphaFromRGB = true;
		bgMaterial.emissiveTexture.uScale = 2.0;				

		// Create background plane.
		var bgPlane = BABYLON.MeshBuilder.CreatePlane('bgPlane', {width: gridWidth * 1.25, height: gridHeight}, scene, false, BABYLON.MeshBuilder.FRONTSIDE);	
		bgPlane.material = bgMaterial;
		//bgPlane.showBoundingBox = true;
		//var offsetY = bgPlane.height / 2; 
		bgPlane.position = new BABYLON.Vector3(gridWidth / 2 , gridHeight / 2 - tileSize, gridHeight + tileSize); 
		bgPlane.rotation.x = cameraAngle;

		

		
		// Debug function to show the 3 axis.
		var showAxis = function(size) {
			var axisX = BABYLON.Mesh.CreateLines("axisX", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0) ], scene);
	  		axisX.color = new BABYLON.Color3(1, 0, 0);
	  		var axisY = BABYLON.Mesh.CreateLines("axisY", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0) ], scene);
	  		axisY.color = new BABYLON.Color3(0, 1, 0);
	  		var axisZ = BABYLON.Mesh.CreateLines("axisZ", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size) ], scene);
	  		axisZ.color = new BABYLON.Color3(0, 0, 1);
		};

	//	showAxis(10);
		scene.debugLayer.show();


		return scene;	
	}

	var scene = createScene();

	engine.runRenderLoop(function() {					
		scene.render();
	});

	window.addEventListener('resize', function() {
		engine.resize();
	});

