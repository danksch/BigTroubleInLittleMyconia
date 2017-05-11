Game = function(canvasId) {

	var canvas = document.getElementById('renderCanvas');

	var engine = new BABYLON.Engine(canvas, true);

	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(74 / 255, 249 / 255, 68 / 255); 		

	// Load assets via assets manager.
	var preloader = new BABYLON.AssetsManager(scene);
	
	var windowWidth = canvas.width;
	var windowHeight = canvas.height;
	var aspect = windowWidth / windowHeight;
	var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3.Zero(), scene);

	//console.log(aspect);
	// camera.position.y = 8;
	// camera.position.z = -12;
	// camera.position.x = 16;	

	camera.position.y = 14;
	camera.position.z = -9;
	camera.position.x = 16;		
	var targetVec = new BABYLON.Vector3(16, 1, 7);					
	//camera.setTarget(targetVec);
	console.log(camera.rotation.x);
	camera.rotation.x = 0.61;
	console.log(camera.rotation.x);
	camera.attachControl(canvas, false);
	camera.fov = 0.8;
	console.log(camera.fov);

	// Store camera alpha angle that will be applied to background image plane.
	var cameraAngle = camera.rotation.x;
	//console.log(cameraAngle);
	//console.log(camera);


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

			
	// Load different textures.
	var groundMaterials = [];	
	var textureTask;
	var groundMaterial0 = new BABYLON.StandardMaterial("Grass0", scene);	
	textureTask = preloader.addTextureTask("image task", "assets/tiles/plains/TilesGrassVariant0_128.png");
	textureTask.onSuccess = function(task) {
		groundMaterial0.emissiveTexture = task.texture;		
		groundMaterials.push(groundMaterial0);
	}  	
	
	var groundMaterial1 = new BABYLON.StandardMaterial("Grass1", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/plains/TilesGrassVariant1_128.png");
	textureTask.onSuccess = function(task) {
		groundMaterial1.emissiveTexture = task.texture;	
		groundMaterials.push(groundMaterial1);	
	}  
	
	var groundMaterial2 = new BABYLON.StandardMaterial("Grass2", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/plains/TilesGrassVariant2_128.png");
	textureTask.onSuccess = function(task) {
		groundMaterial2.emissiveTexture = task.texture;		
		groundMaterials.push(groundMaterial2);
	}  	

	var groundMaterial3 = new BABYLON.StandardMaterial("Grass3", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/plains/TilesGrassVariant3_128.png");
	textureTask.onSuccess = function(task) {
		groundMaterial3.emissiveTexture = task.texture;
		groundMaterials.push(groundMaterial3);		
	}  	
	
	var groundMaterial4 = new BABYLON.StandardMaterial("Grass4", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/plains/TilesGrassVariant4_128.png");
	textureTask.onSuccess = function(task) {
		groundMaterial4.emissiveTexture = task.texture;		
		groundMaterials.push(groundMaterial4);
	}  

	var groundMaterial5 = new BABYLON.StandardMaterial("Grass5", scene);
	groundMaterials.push(groundMaterial5);

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
			
	
	// Cursor controls.	
	var isAnimatable = true; 
	scene.actionManager = new BABYLON.ActionManager(scene);	

	// Iterate through rows and columns.
	var tiles = [];
	for (var x = 0 + tileSize / 2; x < gridWidth ; x += tileSize) {					
		for (var z = 0 + tileSize / 2; z < gridHeight; z += tileSize){

			var tile = BABYLON.Mesh.CreatePlane('tile_' + x + '_' + z, tileSize, scene);
			//console.log(assets);
			//var tile = assets[0].createInstance("i" + x);
			tile.position = new BABYLON.Vector3(x, 0, z);
			tile.rotation.x = Math.PI / 2;
			
			tile.actionManager = new BABYLON.ActionManager(scene);
			var action = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, tile, "visibility", 0.5, 200);
			var action2 = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, tile, "visibility", 1.0, 200);						

			var action3 = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function(event) {

				if(isAnimatable) {					
					isAnimatable = false;
					//console.log(event);
					tile = event.meshUnderPointer;

					var animationPlayer = new BABYLON.Animation("playerAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT); 

					var nextPos = new BABYLON.Vector3(tile.getAbsolutePosition().x, player.position.y, tile.getAbsolutePosition().z);
					if(nextPos.x < player.position.x)
						player.invertU = true;
					else
						player.invertU = false;
					var distance = BABYLON.Vector3.DistanceSquared(player.position, nextPos);
					//console.log(distance);
					console.log(nextPos);

					var keysPlayer = [];
					var finalFrame = 60 + distance / 2;
					keysPlayer.push({ frame: 0, value: player.position });
					keysPlayer.push({ frame: finalFrame, value: nextPos });
					animationPlayer.setKeys(keysPlayer);
					//console.log(keysPlayer);

					var easingFunction = new BABYLON.SineEase();
					easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
					animationPlayer.setEasingFunction(easingFunction);
					player.animations.push(animationPlayer);

					player.playAnimation(4, 7, true, 100);	

					scene.beginAnimation(player, 0, finalFrame, false, 1.5, function() {
						console.log(player.position);
						//player.invertU = false;
						isAnimatable = true;
						player.playAnimation(0, 2, true, 400);

						//var worldMatrix = player.getWorldMatrix();
						var transformMatrix = scene.getTransformMatrix();					
						var viewport = scene.activeCamera.viewport;
						var coordinates = BABYLON.Vector3.Project(player.position, BABYLON.Matrix.Identity(), transformMatrix, viewport);					

						if (player.position.x == 39) {
							reloadScene('mountains');
						}

						else if (coordinates.x > 0.8) {
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
			});
			var actions = [action, action3];
			var actionsCombined = new BABYLON.CombineAction(BABYLON.ActionManager.OnLeftPickTrigger, actions);

			tile.actionManager.registerAction(action);
			tile.actionManager.registerAction(action2);
			tile.actionManager.registerAction(action3);
			//tile.actionManager.registerAction(actionsCombined);

			//Distribute tile textures randomly.
			var randomNumber = Math.floor(Math.random() * 5);
			if (randomNumber == 0) 
				tile.material = groundMaterial0;						
			else if (randomNumber == 1) 
				tile.material = groundMaterial1;						
			else if (randomNumber == 2) 
				tile.material = groundMaterial2;
			else if( randomNumber == 3)
				tile.material = groundMaterial3;
			else
				tile.material = groundMaterial4;						
			
			// Make box a parent.
			tile.parent = anchorBox;
			//console.log(tile.id);
			tiles.push(tile);
			if(x ==  0+ tileSize / 2 && z == 0 + tileSize / 2)
				console.log(tile.material);
		}
	}
	
	console.log(tiles.length);

	// Texture for background plane.
	var bgMaterial = new BABYLON.StandardMaterial('bgMaterial', scene);
	textureTask = preloader.addTextureTask("image task", "assets/background/plains/BackgroundPlains.png");
	textureTask.onSuccess = function (task) {
		bgMaterial.emissiveTexture = task.texture;
		bgMaterial.opacityTexture = bgMaterial.emissiveTexture;	
		bgMaterial.hasAlpha = true;
		bgMaterial.emissiveTexture.hasAlpha = true;				
		bgMaterial.useAlphaFromEmissiveTexture;		
		bgMaterial.emissiveTexture.uScale = 2.0;	
	}			

	// Create background plane.
	var bgPlane = BABYLON.MeshBuilder.CreatePlane('bgPlane', {width: gridWidth * 1.5, height: gridHeight}, scene, false, BABYLON.MeshBuilder.FRONTSIDE);	
	bgPlane.material = bgMaterial;
	//bgPlane.showBoundingBox = true;
	//var offsetY = bgPlane.height / 2; 
	bgPlane.position = new BABYLON.Vector3(gridWidth / 2 , gridHeight / 2 - tileSize - 0.5, gridHeight + 2 * tileSize); 
	bgPlane.rotation.x = cameraAngle;

	var bgMaterialSmall = new BABYLON.StandardMaterial('bgMaterialSmall', scene);
	textureTask = preloader.addTextureTask("image task", "assets/background/plains/BackgroundPlainsFrontVariant1.png");
	textureTask.onSuccess = function (task) {
		bgMaterialSmall.emissiveTexture = task.texture;
		bgMaterialSmall.opacityTexture = bgMaterialSmall.emissiveTexture;	
		bgMaterialSmall.hasAlpha = true;
		bgMaterialSmall.emissiveTexture.hasAlpha = true;				
		bgMaterialSmall.useAlphaFromEmissiveTexture;		
		bgMaterialSmall.emissiveTexture.uScale = 2.0;	
	}		

	var bgMaterialSmall2 = new BABYLON.StandardMaterial('bgMaterialSmall2', scene);
	textureTask = preloader.addTextureTask("image task", "assets/background/plains/BackgroundPlainsFrontVariant2.png");
	textureTask.onSuccess = function (task) {
		bgMaterialSmall2.emissiveTexture = task.texture;
		bgMaterialSmall2.opacityTexture = bgMaterialSmall2.emissiveTexture;	
		bgMaterialSmall2.hasAlpha = true;
		bgMaterialSmall2.emissiveTexture.hasAlpha = true;				
		bgMaterialSmall2.useAlphaFromEmissiveTexture;		
		bgMaterialSmall2.emissiveTexture.uScale = 2.0;	 
	}		

	var bgPlaneSmall = BABYLON.MeshBuilder.CreatePlane('bgPlaneSmall', {width: 2 * gridWidth, height: 2 * gridWidth / 8}, scene, false, BABYLON.MeshBuilder.FRONTSIDE);	
	bgPlaneSmall.position = new BABYLON.Vector3(gridWidth / 2 , gridHeight / 2 - 6 * tileSize, gridHeight + 10 * tileSize); 	
	bgPlaneSmall.material = ~~(Math.random() * 2) ? bgMaterialSmall : bgMaterialSmall2;	
	bgPlaneSmall.rotation.x = cameraAngle;
	
	
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

	function reloadScene(level) {

		camera.position.y = 14;
		camera.position.z = -9;
		camera.position.x = 16;		

		player.position.y = 1;
		player.position.x = 9;
		player.position.z = 5;
		player.cellIndex = 0;
		// Idle sprite animation.	
		player.stopAnimation();	
		player.playAnimation(0, 2, true, 400);

		if(level == 'mountains') {
			scene.clearColor = new BABYLON.Color3(93 / 255, 93 / 255, 93 / 255);

			textureTask = preloader.addTextureTask('image task', "assets/background/mountains/BackgroundMointainsVariantFrontVariant0.png");
			textureTask.onSuccess = function (task) {
				bgMaterial.emissiveTexture.dispose();
				bgMaterial.emissiveTexture = task.texture;
				bgMaterial.opacityTexture = bgMaterial.emissiveTexture;	
				bgMaterial.hasAlpha = true;
				bgMaterial.emissiveTexture.hasAlpha = true;				
				bgMaterial.useAlphaFromEmissiveTexture;		
				bgMaterial.emissiveTexture.uScale = 2.0;	
			}

			textureTask = preloader.addTextureTask("image task", "assets/background/mountains/BackgroundMointainsVariantFrontVariant1.png");
			textureTask.onSuccess = function (task) {
				bgMaterialSmall.emissiveTexture.dispose();
				bgMaterialSmall.emissiveTexture = task.texture;
				bgMaterialSmall.opacityTexture = bgMaterialSmall.emissiveTexture;	
				bgMaterialSmall.hasAlpha = true;
				bgMaterialSmall.emissiveTexture.hasAlpha = true;				
				bgMaterialSmall.useAlphaFromEmissiveTexture;		
				bgMaterialSmall.emissiveTexture.uScale = 2.0;	
			}		
			
			textureTask = preloader.addTextureTask("image task", "assets/background/mountains/BackgroundMointainsVariantFrontVariant2.png");
			textureTask.onSuccess = function (task) {
				bgMaterialSmall2.emissiveTexture.dispose();
				bgMaterialSmall2.emissiveTexture = task.texture;
				bgMaterialSmall2.opacityTexture = bgMaterialSmall2.emissiveTexture;	
				bgMaterialSmall2.hasAlpha = true;
				bgMaterialSmall2.emissiveTexture.hasAlpha = true;				
				bgMaterialSmall2.useAlphaFromEmissiveTexture;		
				bgMaterialSmall2.emissiveTexture.uScale = 2.0;	 

				bgPlaneSmall.setEnabled(false);
			}		

			// for(var i = 0; i <= 5; i++) {
			// 	textureTask = preloader.addTextureTask('image task', "assets/tiles/mountains/TilesMountainGround" + i + ".png");
			// 	textureTask.onSuccess = function (task) {
			// 		groundMaterials[i].emissiveTexture.dispose();
			// 		groundMaterials[i].emissiveTexture = task.texture;
			// 	}
			// }

			textureTask = preloader.addTextureTask('image task', "assets/tiles/mountains/TilesMountainGround0.png");
			textureTask.onSuccess = function (task) {
				groundMaterial0.emissiveTexture.dispose(); 
				groundMaterial0.emissiveTexture = task.texture;
				// groundMaterials[0].emissiveTexture.dispose(); 
				// groundMaterials[0].emissiveTexture = task.texture;
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/mountains/TilesMountainGround1.png");
			textureTask.onSuccess = function (task) {
				groundMaterial1.emissiveTexture.dispose(); 
				groundMaterial1.emissiveTexture = task.texture;
				// groundMaterials[1].emissiveTexture.dispose(); 
				// groundMaterials[1].emissiveTexture = task.texture;
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/mountains/TilesMountainGround2.png");
			textureTask.onSuccess = function (task) {
				groundMaterial2.emissiveTexture.dispose(); 
				groundMaterial2.emissiveTexture = task.texture;
				// groundMaterials[2].emissiveTexture.dispose(); 
				// groundMaterials[2].emissiveTexture = task.texture;
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/mountains/TilesMountainGround3.png");
			textureTask.onSuccess = function (task) {
				groundMaterial3.emissiveTexture.dispose(); 
				groundMaterial3.emissiveTexture = task.texture;
				// groundMaterials[3].emissiveTexture.dispose(); 
				// groundMaterials[3].emissiveTexture = task.texture;
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/mountains/TilesMountainGround4.png");
			textureTask.onSuccess = function (task) {
				groundMaterial4.emissiveTexture.dispose(); 
				groundMaterial4.emissiveTexture = task.texture;
				// groundMaterials[4].emissiveTexture.dispose(); 
				// groundMaterials[4].emissiveTexture = task.texture;
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/mountains/TilesMountainGround5.png");
			textureTask.onSuccess = function (task) {
				//groundMaterial5.emissiveTexture.dispose(); 
				groundMaterial5.emissiveTexture = task.texture;
				//groundMaterials[5].emissiveTexture.dispose(); 
				// groundMaterials[5].emissiveTexture = task.texture;
			}

			for(var j = 0; j < tiles.length; j++) {

				

				var randomNumber = Math.floor(Math.random() * 6);
				if (randomNumber == 0) 
					tiles[j].material = groundMaterial0;						
				else if (randomNumber == 1) 
					tiles[j].material = groundMaterial1;						
				else if (randomNumber == 2) 
					tiles[j].material = groundMaterial2;
				else if (randomNumber == 3)
					tiles[j].material = groundMaterial3;
				else if (randomNumber == 4)
					tiles[j].material = groundMaterial4;	
				else
					tiles[j].material = groundMaterial5;
			}

		}
		preloader.load();
	}

};

document.addEventListener("DOMContentLoaded", function () {
	new Game('renderCanvas');
}, false);
