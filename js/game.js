window.addEventListener('DOMContentLoaded', function() {

	var canvas = document.getElementById('renderCanvas');

	var engine = new BABYLON.Engine(canvas, true);

	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0, 1, 0); 		

	// Load assets via assets manager.
	var preloader = new BABYLON.AssetsManager(scene);
	var assets = [];
	
	var windowWidth = canvas.width;
	var windowHeight = canvas.height;
	var aspect = windowWidth / windowHeight;
	var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3.Zero(), scene);

	console.log(aspect);
	camera.position.y = 8;
	camera.position.z = -12;
	camera.position.x = 16;		
	var targetVec = new BABYLON.Vector3(16, 1, 7);		
	//camera.setTarget(targetVec);
	camera.rotation.x = 0.30;
	camera.attachControl(canvas, false);
	
	// Store camera alpha angle that will be applied to background image plane.
	var cameraAngle = camera.rotation.x;
	console.log(cameraAngle);
	console.log(camera);


	// Sprite player unit.
	var spriteManagerPlayer = new BABYLON.SpriteManager('playerManager', 'assets/characters/cProtagonist.png', 8, 512, scene);
	var player = new BABYLON.Sprite('player', spriteManagerPlayer);
	player.size = 2.5;		
	player.position.y = 1;
	player.position.x = 9;
	player.position.z = 5;
	player.cellIndex = 0;
	// Idle sprite animation.
	player.playAnimation(0, 2, true, 400);

	// Cursor controls.
	/* TODO: Implement mouse controls. */
	var isAnimatable = true; 
	scene.actionManager = new BABYLON.ActionManager(scene);
	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
		if (evt.sourceEvent.key == "d") {
			if (isAnimatable) {
				isAnimatable = false;
				player.invertU = false;						

				var animationPlayer = new BABYLON.Animation("playerAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT); 

				var nextPos = player.position.add(new BABYLON.Vector3(2, 0, 0));

				var keysPlayer = [];
				keysPlayer.push({ frame: 0, value: player.position });
				keysPlayer.push({ frame: 60, value: nextPos });
				animationPlayer.setKeys(keysPlayer);

				var easingFunction = new BABYLON.SineEase();
				easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
				animationPlayer.setEasingFunction(easingFunction);
				player.animations.push(animationPlayer);
				player.playAnimation(4, 7, true, 100);	
				scene.beginAnimation(player, 0, 60, false, 1.5, function() {
					isAnimatable = true;
					player.playAnimation(0, 2, true, 400);
					//var worldMatrix = player.getWorldMatrix();
					var transformMatrix = scene.getTransformMatrix();					
					var viewport = scene.activeCamera.viewport;
					var coordinates = BABYLON.Vector3.Project(player.position, BABYLON.Matrix.Identity(), transformMatrix, viewport);
					
					// Check if the player is near the right of the screen.
					// If so, move the camera to the right.
					if (coordinates.x > 0.8) {
						isAnimatable = false;
						var animationCamera = new BABYLON.Animation("cameraAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
						var nextPos = camera.position.add(new BABYLON.Vector3(10, 0, 0));

						var keysCamera = [];
						keysCamera.push( { frame: 0, value: camera.position });
						keysCamera.push( { frame: 60, value: nextPos });
						animationCamera.setKeys(keysCamera);

						animationCamera.setEasingFunction(easingFunction);
						camera.animations.push(animationCamera);
						scene.beginAnimation(camera, 0, 60, false, 1.0, function() {
							isAnimatable = true;
						});
					}
				});	
			}				
		}
		else if (evt.sourceEvent.key == "w") {
			if (isAnimatable) {
				isAnimatable = false; 
				player.invertU = false;
				
				var animationPlayer = new BABYLON.Animation("playerAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT); 
				
				var nextPos = player.position.add(new BABYLON.Vector3(0, 0, 2));

				var keysPlayer = [];
				keysPlayer.push({ frame: 0, value: player.position });
				keysPlayer.push({ frame: 60, value: nextPos });
				animationPlayer.setKeys(keysPlayer);

				var easingFunction = new BABYLON.CircleEase();
				easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
				animationPlayer.setEasingFunction(easingFunction);
				player.animations.push(animationPlayer);
				player.playAnimation(4, 7, true, 100);	
				scene.beginAnimation(player, 0, 60, false, 1.5, function() {
					isAnimatable = true;
					player.playAnimation(0, 2, true, 400);
				});	
			}						
		}
		else if (evt.sourceEvent.key == "a") {	
			if (isAnimatable) {
				isAnimatable = false;
				player.invertU = true;					

				var animationPlayer = new BABYLON.Animation("playerAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT); 
				
				var nextPos = player.position.add(new BABYLON.Vector3(-2, 0, 0));

				var keysPlayer = [];
				keysPlayer.push({ frame: 0, value: player.position });
				keysPlayer.push({ frame: 60, value: nextPos });
				animationPlayer.setKeys(keysPlayer);

				var easingFunction = new BABYLON.CircleEase();
				easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
				animationPlayer.setEasingFunction(easingFunction);
				player.animations.push(animationPlayer);
				player.playAnimation(4, 7, true, 100);	
				scene.beginAnimation(player, 0, 60, false, 1.5, function() {
					isAnimatable = true;
					player.playAnimation(0, 2, true, 400);
				});						
			}				
		}
		else if (evt.sourceEvent.key == "s") {
			if (isAnimatable) {
				isAnimatable = false; 
				player.invertU = false;
				
				var animationPlayer = new BABYLON.Animation("playerAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT); 
				
				var nextPos = player.position.add(new BABYLON.Vector3(0, 0, -2));

				var keysPlayer = [];
				keysPlayer.push({ frame: 0, value: player.position });
				keysPlayer.push({ frame: 60, value: nextPos });
				animationPlayer.setKeys(keysPlayer);

				var easingFunction = new BABYLON.CircleEase();
				easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
				animationPlayer.setEasingFunction(easingFunction);
				player.animations.push(animationPlayer);
				player.playAnimation(4, 7, true, 100);	
				scene.beginAnimation(player, 0, 60, false, 1.5, function() {
					isAnimatable = true;
					player.playAnimation(0, 2, true, 400);
				});	
			}
		}
	}));			

		
	// Load different textures.
	// *TO DO*: Implement Assets-manager.
	var textureTask;
	var grassMaterial1 = new BABYLON.StandardMaterial("Grass1", scene);	
	textureTask = preloader.addTextureTask("image task", "assets/tiles/TilesGrassVariant0_128.png");
	textureTask.onSuccess = function(task) {
		grassMaterial1.emissiveTexture = task.texture;
		// var tile_type_0 = BABYLON.Mesh.CreatePlane("tile_type_0", 2, scene);
		// tile_type_0.material = grassMaterial1;
		// tile_type_0.visibility = false;
		// assets.push(tile_type_0);
		// console.log(assets);
	}  	
	
	var grassMaterial2 = new BABYLON.StandardMaterial("Grass2", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/TilesGrassVariant1_128.png");
	textureTask.onSuccess = function(task) {
		grassMaterial2.emissiveTexture = task.texture;
		// var tile_type_1 = BABYLON.Mesh.CreatePlane("tile_type_1", 2, scene);
		// tile_type_1.material = grassMaterial2;
		// tile_type_1.visibility = false;
		// assets.push(tile_type_1);
	}  
	
	var grassMaterial3 = new BABYLON.StandardMaterial("Grass3", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/TilesGrassVariant2_128.png");
	textureTask.onSuccess = function(task) {
		grassMaterial3.emissiveTexture = task.texture;
		// var tile_type_2 = BABYLON.Mesh.CreatePlane("tile_type_2", 2, scene);
		// tile_type_2.material = grassMaterial3;
		// tile_type_2.visibility = false;
		// assets.push(tile_type_2);
	}  	

	var grassMaterial4 = new BABYLON.StandardMaterial("Grass4", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/TilesGrassVariant3_128.png");
	textureTask.onSuccess = function(task) {
		grassMaterial4.emissiveTexture = task.texture;
		// var tile_type_3 = BABYLON.Mesh.CreatePlane("tile_type_3", 2, scene);
		// tile_type_3.material = grassMaterial4;
		// tile_type_3.visibility = false;
		// assets.push(tile_type_3);
	}  	
	
	var grassMaterial5 = new BABYLON.StandardMaterial("Grass5", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/TilesGrassVariant4_128.png");
	textureTask.onSuccess = function(task) {
		grassMaterial5.emissiveTexture = task.texture;
		// var tile_type_4 = BABYLON.Mesh.CreatePlane("tile_type_4", 2, scene);
		// tile_type_4.material = grassMaterial5;
		// tile_type_4.visibility = false;
		// assets.push(tile_type_4);
	}  	


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
	anchorBox.visibility = false;
	//anchorBox.rotation.x = Math.PI / 2;
			
	// Iterate through rows and columns.
	for (var x = 0 + tileSize / 2; x < gridWidth; x += tileSize) {					
		for (var z = 0 + tileSize / 2; z < gridHeight; z += tileSize) {

			var tile = BABYLON.Mesh.CreatePlane('tile_' + x + '_' + z, tileSize, scene);
			//console.log(assets);
			//var tile = assets[0].createInstance("i" + x);
			tile.position = new BABYLON.Vector3(x , 0, z);
			tile.rotation.x = Math.PI / 2;
			
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

			//Distribute tile textures randomly.
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
			//console.log(tile.id);
			
		}
	}
	

	// Texture for background plane.
	var bgMaterial = new BABYLON.StandardMaterial('bgMaterial', scene);
	bgMaterial.emissiveTexture = new BABYLON.Texture("assets/background/BackgroundPlains.png", scene);  
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
	//scene.debugLayer.show();

	
	
	preloader.onFinish = function (tasks) {
		engine.runRenderLoop(function() {					
			scene.render();
		});
	}
	
	preloader.load();

	window.addEventListener('resize', function() {
		engine.resize();
	});

});

