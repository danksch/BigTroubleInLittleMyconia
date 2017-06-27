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
	
	camera.rotation.x = 0.61;
	
	camera.attachControl(canvas, false);
	camera.fov = 0.8;
	

	// Store camera alpha angle that will be applied to background image plane.
	var cameraAngle = camera.rotation.x;
	//console.log(cameraAngle);
	//console.log(camera);


	// Sprite player manager.
	var spriteManagerPlayer = new BABYLON.SpriteManager('playerManager', 'assets/characters/cProtagonist.png', 1, 512, scene);
	var player = new BABYLON.Sprite('player', spriteManagerPlayer);
	player.size = 2.5;		
	player.position.y = 1;
	player.position.x = 9;
	player.position.z = 5;
	player.cellIndex = 0;
	player.health = 100;
	console.log(player.position.x + 3);
	// Idle sprite animation.
	player.playAnimation(0, 2, true, 400);

	// Sprite enemy manager.
	var spriteManagerEnemy = new BABYLON.SpriteManager('enemyManager', 'assets/characters/cWergreis.png', 3, 512, scene);	
	var enemies = [];
			
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
	var boundaries = {
		"left" : 0,
		"right" : gridWidth, 
		"front" : 0,
		"back" : gridHeight
	};			

	emitParticles(player);
	/* This box is needed to "group" the different tiles,
		 so that we can move them all at once (rotation later, e.g.).
		 Since we don't want to exactly merge the meshes 
		 (we must be able to access them individually!), we keep them as 
		 children of the invisible box. */ 					 
	var anchorBox = new BABYLON.Mesh.CreateBox('anchor', 0.1, scene);				
	anchorBox.position = new BABYLON.Vector3(0, 0, 0);
	anchorBox.visibility = false;
	//anchorBox.rotation.x = Math.PI / 2;
			
	
	// Mouse controls.	
	var isAnimatable = true; 
	scene.actionManager = new BABYLON.ActionManager(scene);	

	// Turn controls.
	var playerTurn = true;
	var enemyTurn = false;
	var turnNumber = 1;
	var battleMode = false;
	var abilityUsed;
	var currentPositions = new Map();
	currentPositions.set("player", player.position);
	
	for(var value of currentPositions.values()) {
		console.log(value);
	}

	// Spawn enemies.
	var enemy1 = spawnEnemy(boundaries.right / 2, boundaries.right, boundaries.front, boundaries.back, 'ranged1', 'ranged');	
	var enemy2 = spawnEnemy(boundaries.right / 2, boundaries.right, boundaries.front, boundaries.back, 'ranged2', 'ranged');	
	var enemy3 = spawnEnemy(boundaries.right / 2, boundaries.right, boundaries.front, boundaries.back, 'ranged3', 'ranged');		
	var currentEnemy = enemies.length - 1;

	// 2D canvas that is used to display various ingame info.
	var canvas2D = new BABYLON.ScreenSpaceCanvas2D(scene, {
        id: "ScreenCanvas",
        size: new BABYLON.Size(canvas.width, canvas.height),
        cachingStrategy: BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE        
    });
    
    // Add frame for the current turn.
    var turnFrame = new BABYLON.Rectangle2D({
    	id: "rectTopLeft", parent: canvas2D, width: 200, height: 100, x: 0, y: canvas2D.height - 100,
    	fill: "#4040408F", border: "#A040A0D0, #FFFFFF", borderThickness: 5,
    	roundRadius: 10, isVisible: true,
    	children: 
    	[
    		new BABYLON.Text2D("Current Turn:", { id: "turnTextTitle", fontName: "20pt Arial", marginAlignment: "h: center, v: top" }),
    		new BABYLON.Text2D(turnNumber.toString(), { id: "turnNumber", fontName: "25pt Arial", marginAlignment: "h: center, v: bottom", marginBottom: 15})
    	] 
    });

    // Frame for hit poitns display.
    var hpFrame = new BABYLON.Rectangle2D({
    	id: "rectTopRight", parent: canvas2D, width: 300, height: 200, x: canvas2D.width - 300, y: canvas2D.height - 250,
    	fill: "#4040408F", border: "#A040A0D0, #FFFFFF", borderThickness: 5,
    	roundRadius: 10, isVisible: true,
    	children:
    	[
    	new BABYLON.Text2D("Hit Points", { id: "hpTitle", fontName: "20pt Arial", marginAlignment: "h: center, v:top" }),
    	new BABYLON.Text2D("Player:", { id: "playerHpText", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 30, marginLeft: 5}),
    	new BABYLON.Text2D(player.health.toString(), { id: "playerHp", fontName: "20pt Arial", marginAlignment: "h: right, v: top", marginTop: 30, marginRight: 5}),
    	new BABYLON.Text2D("Enemy_1:", { id: "enemy_1HpText", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 60, marginLeft: 5}),
    	new BABYLON.Text2D(enemy1.health.toString(), { id: "enemy_1Hp", fontName: "20pt Arial", marginAlignment: "h: right, v: top", marginTop: 60, marginRight: 5}),
    	new BABYLON.Text2D("Enemy_2:", { id: "enemy_2HpText", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 90, marginLeft: 5}),
    	new BABYLON.Text2D(enemy2.health.toString(), { id: "enemy_2Hp", fontName: "20pt Arial", marginAlignment: "h:right, v: top", marginTop: 90, marginRight: 5}),
    	new BABYLON.Text2D("Enemy_3:", { id: "enemy_3HpText", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 120, marginLeft: 5}),
    	new BABYLON.Text2D(enemy3.health.toString(), { id: "enemy_3Hp", fontName: "20pt Arial", marginAlignment: "h: right, v: top", marginTop: 120, marginRight: 5}),
    	]
    });

    var abilityName;
    // Adda skill info bar at the top of the screen.
    var skillInfoBar = new BABYLON.Rectangle2D({
    	id: "skillInfoBar", parent: canvas2D, width: 600, height: 80, x: canvas.width / 2 - 300, y: canvas2D.height - 80,
    	fill: "#4040408F", border: "#A040A0D0, #FFFFFF", borderThickness: 5,
    	roundRadius: 10, isVisible: false,
    	children:
    	[
    		new BABYLON.Text2D("Player has used the ability " + abilityName, { id: "skillInfo", fontName: "20pt Arial", marginAlignment: "h: center, v: center"})
    		//new BABYLON.Text2D(abilityUsed, { id: "abilityUsed", fontName: "20pt Arial", marginAlignment: "h: right, v: center"})
    	]
    });

    // Add an ability-frame. 
    var skillsFrame = new BABYLON.Rectangle2D({
    	id: "rectBottom", parent: canvas2D, width: 500, height: 300, x: 0, y: canvas2D.height - 450,
    	fill: "#4040408F", border: "#A040A0D0, #FFFFFF", borderThickness: 5,
    	roundRadius: 10, isVisible: true    	
    });
    
    // Add content to the frame.
    var skillsTitle = new BABYLON.Text2D("Abilities:", {parent: skillsFrame, id: "skillsTextTitle", fontName: "22pt Arial", marginAlignment: "h: center, v: top" });
    var skill_1 = new BABYLON.Text2D("Skill_1", {parent: skillsFrame, id: "attack_1", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 50, marginLeft: 10});
    var skill_2 = new BABYLON.Text2D("Skill_2", {parent: skillsFrame, id: "attack_2", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 90, marginLeft: 10});
    var skill_3 = new BABYLON.Text2D("Skill_3", {parent: skillsFrame, id: "attack_3", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 130, marginLeft: 10});
    var skill_4 = new BABYLON.Text2D("Skill_4", {parent: skillsFrame, id: "attack_4", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 170, marginLeft: 10});

    // Add observable that leads to tile telegraphing when the cursor hovers over the box boundaries.
    skill_1.pointerEventObservable.add(function() {
    	telegraphTiles(tileSize, player, 1);    	
    }, BABYLON.PrimitivePointerInfo.PointerOver); 

    // Add observable that leads to animation cancelling / value resetting when the cursor leaves the box boundaries.
    skill_1.pointerEventObservable.add(function() {    	
    	tiles.forEach(function(tile) {
    		var animatable = scene.getAnimatableByTarget(tile);    		
    		if(animatable != null) {    			
    			tile.visibility = 1.0;    			
    			animatable.stop();    			  		
    		}
    	});
    }, BABYLON.PrimitivePointerInfo.PointerLeave);

    // Add observable that leads to tile telegraphing when the cursor hovers over the box boundaries.
    skill_2.pointerEventObservable.add(function() {
    	telegraphTiles(tileSize * 3, player, 2);    	
    }, BABYLON.PrimitivePointerInfo.PointerOver);

	// Add observable that leads to animation cancelling / value resetting when the cursor leaves the box boundaries.
    skill_2.pointerEventObservable.add(function() {    	
    	tiles.forEach(function(tile) {
    		var animatable = scene.getAnimatableByTarget(tile);    		
    		if(animatable != null) {    			
    			tile.visibility = 1.0;    			
    			animatable.stop();    			  		
    		}
    	});
    }, BABYLON.PrimitivePointerInfo.PointerLeave);

    skill_2.pointerEventObservable.add(function() {    	
    	useAbility(player, 'skill_2');
    }, BABYLON.PrimitivePointerInfo.PointerUp);

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

				if(isAnimatable && playerTurn && !battleMode) {					
					isAnimatable = false;
					playerTurn = false;

					tile = event.meshUnderPointer;
					
					var animationPlayer = new BABYLON.Animation("playerAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT); 

					var nextPos = new BABYLON.Vector3(tile.getAbsolutePosition().x, player.position.y, tile.getAbsolutePosition().z);
					if(nextPos.x < player.position.x)
						player.invertU = true;
					else
						player.invertU = false;
					var distance = BABYLON.Vector3.DistanceSquared(player.position, nextPos);					

					var keysPlayer = [];
					var finalFrame = 60 + distance / 2;
					keysPlayer.push({ frame: 0, value: player.position });
					keysPlayer.push({ frame: finalFrame, value: nextPos });
					animationPlayer.setKeys(keysPlayer);					

					var easingFunction = new BABYLON.SineEase();
					easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
					animationPlayer.setEasingFunction(easingFunction);
					player.animations.push(animationPlayer);

					player.playAnimation(4, 7, true, 100);	

					scene.beginAnimation(player, 0, finalFrame, false, 1.5, function() {
						
						currentPositions.set("player", player.position);
						console.log(currentPositions.get("player"));
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

						//enemyAction(enemies[currentEnemy]);
						moveEnemy(boundaries, enemies[currentEnemy]);	
						// if(isAnimatable) {
						// 	moveEnemy(boundaries, enemy2);	
						// }
						
						turnNumber++;	
						turnFrame.children[1].text = turnNumber.toString();												
					});				
				}				
			});			

			// Add the actions to each tile.
			tile.actionManager.registerAction(action);
			tile.actionManager.registerAction(action2);
			tile.actionManager.registerAction(action3);			

			// Distribute tile textures randomly.
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
			
			// Add tile to tiles array.
			tiles.push(tile);			
		}
	}	
	

	// Two random U-offset to get a randomized touch on the background placements. 
	var randomUOffset1 = Math.random();
	var randomUOffset2 = Math.random();	

	// Texture for sky material. 
	var skyMaterial = new BABYLON.StandardMaterial('skyMaterial', scene);
	textureTask = preloader.addTextureTask("image task", "assets/levels/grasslands/backgrounds/back/0.png");
	textureTask.onSuccess = function (task) {
		skyMaterial.emissiveTexture = task.texture;
		//skyMaterial.opacityTexture = skyMaterial.emissiveTexture;				
		skyMaterial.emissiveTexture.uScale = 2.0;	
	}	

	// Texture for background plane.
	var bgMaterial = new BABYLON.StandardMaterial('bgMaterial', scene);
	textureTask = preloader.addTextureTask("image task", "assets/levels/grasslands/backgrounds/front/1.png");
	textureTask.onSuccess = function (task) {
		bgMaterial.emissiveTexture = task.texture;
		bgMaterial.opacityTexture = bgMaterial.emissiveTexture;	
		//bgMaterial.hasAlpha = true;
		//bgMaterial.alpha = 1.0; 
		bgMaterial.emissiveTexture.hasAlpha = true;				
		bgMaterial.useAlphaFromEmissiveTexture = true;		
		//bgMaterial.emissiveTexture.getAlphaFromRGB = true;
		bgMaterial.emissiveTexture.uScale = 2.0;	
		bgMaterial.emissiveTexture.uOffset = randomUOffset1;	
	}			

	// Create background plane for sky.
	var skyPlane = BABYLON.MeshBuilder.CreatePlane('skyPlane', {width: gridWidth * 2.5, height: gridHeight}, scene, false, BABYLON.MeshBuilder.FRONTSIDE);
	skyPlane.material = skyMaterial;
	skyPlane.position = new BABYLON.Vector3(gridWidth / 2, gridHeight / 2 - 4 * tileSize , gridHeight + 16 * tileSize);
	skyPlane.rotation.x = camera.rotation.x;

	// Create front-background plane.
	var bgPlane = BABYLON.MeshBuilder.CreatePlane('bgPlane', {width: gridWidth * 1.5, height: gridHeight}, scene, false, BABYLON.MeshBuilder.FRONTSIDE);	
	bgPlane.material = bgMaterial;
	//bgPlane.showBoundingBox = true;
	//var offsetY = bgPlane.height / 2; 
	bgPlane.position = new BABYLON.Vector3(gridWidth / 2 , gridHeight / 2 - 2 * tileSize, gridHeight + 2 * tileSize); 
	bgPlane.rotation.x = cameraAngle;

	var bgMaterialSmall = new BABYLON.StandardMaterial('bgMaterialSmall', scene);
	textureTask = preloader.addTextureTask("image task", "assets/levels/grasslands/backgrounds/front/0.png");
	textureTask.onSuccess = function (task) {
		bgMaterialSmall.emissiveTexture = task.texture;
		bgMaterialSmall.opacityTexture = bgMaterialSmall.emissiveTexture;	
		bgMaterialSmall.hasAlpha = true;
		bgMaterialSmall.emissiveTexture.hasAlpha = true;				
		bgMaterialSmall.useAlphaFromEmissiveTexture;		
		bgMaterialSmall.emissiveTexture.uOffset = randomUOffset2;	
	}		

	var bgMaterialSmall2 = new BABYLON.StandardMaterial('bgMaterialSmall2', scene);
	textureTask = preloader.addTextureTask("image task", "assets/levels/grasslands/backgrounds/front/2.png");
	textureTask.onSuccess = function (task) {
		bgMaterialSmall2.emissiveTexture = task.texture;
		bgMaterialSmall2.opacityTexture = bgMaterialSmall2.emissiveTexture;	
		bgMaterialSmall2.hasAlpha = true;
		bgMaterialSmall2.emissiveTexture.hasAlpha = true;				
		bgMaterialSmall2.useAlphaFromEmissiveTexture;		
		bgMaterialSmall2.emissiveTexture.uOffset = randomUOffset2;	 
	}		

	var bgPlaneSmall = BABYLON.MeshBuilder.CreatePlane('bgPlaneSmall', {width: 2.25 * gridWidth, height: 2 * gridWidth / 8}, scene, false, BABYLON.MeshBuilder.FRONTSIDE);	
	bgPlaneSmall.position = new BABYLON.Vector3(gridWidth / 2 , gridHeight / 2 - 4 * tileSize, gridHeight + 10 * tileSize); 	
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
 
	scene.registerBeforeRender(function() {
		if(battleMode) {

			skillsFrame.levelVisible = true;
		}
	});
	
	preloader.onFinish = function (tasks) {
		engine.runRenderLoop(function() {		

			// Simulate sky movement.
			skyMaterial.emissiveTexture.uOffset += 0.0002;	

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

			textureTask = preloader.addTextureTask('image task', "assets/levels/mountains/backgrounds/front/1.png");
			textureTask.onSuccess = function (task) {
				bgMaterial.emissiveTexture.dispose();
				bgMaterial.emissiveTexture = task.texture;
				bgMaterial.opacityTexture = bgMaterial.emissiveTexture;	
				bgMaterial.hasAlpha = true;
				bgMaterial.emissiveTexture.hasAlpha = true;				
				bgMaterial.useAlphaFromEmissiveTexture;		
				bgMaterial.emissiveTexture.uScale = 2.0;	
			}

			textureTask = preloader.addTextureTask("image task", "assets/levels/mountains/backgrounds/front/2.png");
			textureTask.onSuccess = function (task) {
				bgMaterialSmall.emissiveTexture.dispose();
				bgMaterialSmall.emissiveTexture = task.texture;
				bgMaterialSmall.opacityTexture = bgMaterialSmall.emissiveTexture;	
				bgMaterialSmall.hasAlpha = true;
				bgMaterialSmall.emissiveTexture.hasAlpha = true;				
				bgMaterialSmall.useAlphaFromEmissiveTexture;		
				bgMaterialSmall.emissiveTexture.uScale = 2.0;	
			}		
			
			textureTask = preloader.addTextureTask("image task", "assets/levels/mountains/backgrounds/front/0.png");
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

	function spawnEnemy(minX, maxX, minZ, maxZ, id, enemyType) {

		//var hitPoints, id, marks;
		//var cooldowns;

		var enemyDummy = new BABYLON.Sprite(id, spriteManagerEnemy);
		enemyDummy.size = 2;
		enemyDummy.health = 20;
		enemyDummy.abilites = [];
		var rangedAttack = new Object();
		rangedAttack.range = 3;

		enemyDummy.type = enemyType;
		if(enemyDummy.type == 'ranged') {
			enemyDummy.abilites.push(rangedAttack);			
		}
console.log(enemyDummy);
		var randomOddX, randomOddZ, targetVector;
		// var healthBarMaterial = new BABYLON.StandardMaterial("healthBarMaterial", scene);
		// healthBarMaterial.emissiveColor = BABYLON.Color3.Green();
		// healthBarMaterial.backFaceCulling = false;

		// var healthBarContainerMaterial = new BABYLON.StandardMaterial("healthBarContainerMaterial", scene);
		// healthBarContainerMaterial.emissiveColor = BABYLON.Color3.Blue();
		// healthBarContainerMaterial.backFaceCulling = false;

		// var dynamicTexture = new BABYLON.DynamicTexture("dynamicTexture", 512, scene, true);
		// dynamicTexture.hasAlpha = true;

		// var healthBarTextMaterial = new BABYLON.StandardMaterial("healthBarTextMaterial", scene);
		// healthBarTextMaterial.emissiveTexture = dynamicTexture;
		// healthBarTextMaterial.backFaceCulling = false;
		// healthBarTextMaterial.emissiveColor = BABYLON.Color3.Green();

		// var healthBarContainer = BABYLON.MeshBuilder.CreatePlane("healthBarContainer", { width: 2, height: 0.5, subdivisions: 4 }, scene);
		// var healthBar = BABYLON.MeshBuilder.CreatePlane("healthBar", { width: 2, height: .5, subdivisions: 4 }, scene);

		// var healthBarText = BABYLON.MeshBuilder.CreatePlane("healthBarText", { width: 2, height: 2, subdivisions: 4 }, scene);
		// healthBarTextmaterial = healthBarMaterial;

		// healthBarContainer.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;		

		// healthBar.position = new BABYLON.Vector3(0, 0, -0.01);
		// healthBarContainer.position = new BABYLON.Vector3(0, 3, 0);
		// healthBarText.position = new BABYLON.Vector3(1.5, -0.4, 0);

		// healthBar.parent = healthBarContainer;
		// //healthBarContainer.parent = enemyDummy;
		// healthBarText.parent = healthBarContainer;

		// healthBar.material = healthBarMaterial;
		// healthBarContainer.material = healthBarContainerMaterial;
		// healthBarText.material = healthBarTextmaterial;

		do {
			randomOddX = Math.floor(Math.random() * (maxX - minX + 1)) + minX; 
			if(randomOddX == maxX && maxX % 2 == 0)
				randomOddX -= 1;
			else
				randomOddX += (randomOddX % 2 == 0) ? 1 : 0;

			randomOddZ = Math.floor(Math.random() * (maxZ - minZ + 1)) + minZ;
			if(randomOddZ == maxZ && maxZ % 2 == 0)
				randomOddZ -= 1;
			else
				randomOddZ += (randomOddZ % 2 == 0) ? 1 : 0;	

			targetVector = new BABYLON.Vector3(randomOddX, 1, randomOddZ);			
		} while (comparePositions(targetVector));			
		
		enemyDummy.position = targetVector;			
		currentPositions.set(id, enemyDummy.position);
		enemies.push(enemyDummy);

		return enemyDummy;				
	}

	// A function that compares a desired position (vector) to the currently taken positions on the board by all units. 
	function comparePositions(vector) {
		for(var value of currentPositions.values()) {
			if(vector.x == value.x && vector.z == value.z)
				return true;
		}
		return false;
	}

	// A functon to determine enemy actions.
	function enemyAction(enemy) {
		// An enemy can either move and attack, or do just one of those things. An attack ends the turn, whether the enemy has moved or not.

		var enemyType = enemy.type;
		var distanceX = Math.abs(enemy.position.x - player.position.x); 	
		var distanceZ = Math.abs(enemy.position.z - player.position.z);

		// enemy.abilities.forEach(function(ability) {
		// 	if((distanceX == ability.range * tileSize) || (distanceZ == ability.range * tileSize)) {
		// 		console.log("ATTACK!");
		// 		useAbility(enemy, ability); 	
		// 		currentEnemy--;
		// 		return;			
		// 	}
		// });

		if((distanceX == 3 * tileSize) || (distanceZ == 3 * tileSize)) {
			console.log("ATTACK!");
			useAbility(enemy, 'rangedAttack');
			currentEnemy--;
			if(currentEnemy >=0)
				enemyAction(enemies[currentEnemy]);
			else {
				enemies.forEach(function(enemy) {
					enemy.hasMoved = false;
				});
				currentEnemy = enemies.length - 1;
			}			
		}

		if(!enemy.hasMoved) {
			moveEnemy(boundaries, enemy);
		}
		else {
			currentEnemy--;
		}	

		if(currentEnemy >=0)
			enemyAction(enemies[currentEnemy]);	
		else {
			enemies.forEach(function(enemy) {
				enemy.hasMoved = false;
			});
			currentEnemy = enemies.length - 1;
		}		
	}

	// A function that moves an enemy unit. 
	function moveEnemy(boundaries, enemy) {

		//isAnimatable = false;

		var distanceX = Math.abs(player.position.x - enemy.position.x); 
		var distanceZ = Math.abs(player.position.z - enemy.position.z);
		var newPos;

		if(distanceX >  tileSize || distanceZ >  tileSize) {

			isAnimatable = false;

			var animationEnemy = new BABYLON.Animation("enemyAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT); 

			var stepX = (enemy.position.x > player.position.x) ? -tileSize : tileSize;
			var stepZ = (enemy.position.z > player.position.z) ? -tileSize : tileSize;
			var nextPos = new BABYLON.Vector3(enemy.position.x + stepX, 1, enemy.position.z + stepZ);	

			// if(comparePositions(nextPos)) {
			// 	// To do
			// }						

			var keysEnemy = [];
			var finalFrame = 60;
			keysEnemy.push({ frame: 0, value: enemy.position });
			keysEnemy.push({ frame: finalFrame, value: nextPos });
			animationEnemy.setKeys(keysEnemy);					

			var easingFunction = new BABYLON.SineEase();
			easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
			animationEnemy.setEasingFunction(easingFunction);
			enemy.animations.push(animationEnemy);			

			scene.beginAnimation(enemy, 0, finalFrame, false, 1.0, function() {				

				currentPositions.set(enemy.name, nextPos);


				var newDistanceX = Math.abs(nextPos.x - player.position.x);
				var newDistanceZ = Math.abs(nextPos.z - player.position.z);

				if(newDistanceZ == 3 * tileSize || newDistanceX == 3 * tileSize) {
					useAbility(enemy, 'rangedAttack');
				}

				 currentEnemy--;		
				 if(currentEnemy >= 0)
				 	moveEnemy(boundaries, enemies[currentEnemy]);	
				 else
				    currentEnemy = enemies.length - 1;

				enemy.hasMoved = true;

				isAnimatable = true;
				enemyTurn = false;
				playerTurn = true;
			});	
		}
		else
			battleMode = true;
	}

	function sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	function useAbility(unit, ability, targetLocation) {
		if(unit.name == 'player') {			
			if(ability == 'skill_2') {		
				var target = player.position.x + 3 * tileSize;		
				for(var i = 0; i < tiles.length; i++) {
					var tile = tiles[i];
					if(tile.position.x == target) {
						 console.log('lul');						
						for(var j = 0; j < enemies.length; j++) {
							if(tile.position.x == enemies[j].position.x && tile.position.z == enemies[j].position.z) {
								console.log(enemies[j]);
								skillInfoBar.children[0].text = "Player using Skill_2 on enemy " + enemies[j].name + " !";
								skillInfoBar.levelVisible = true;
								enemies[j].health -= 10;
								switch(enemies[j].name) {
									case 'ranged1':										;
										hpFrame.children[4].text = enemies[j].health.toString();
										break;
									case 'ranged2':
										hpFrame.children[6].text = enemies[j].health.toString();
										break;
									case 'ranged3':
										hpFrame.children[8].text = enemies[j].health.toString();		
										break;
								}
								setTimeout(function() {
									skillInfoBar.levelVisible = false;
									console.log(enemies[j]);
									//enemies[j].health -= 10;
								}, 3000);
								// switch(enemies[j].name) {
								// 	case 'ranged1':										;
								// 		hpFrame.children[4].text = enemies[j].health.toString();
								// 		break;
								// 	case 'ranged2':
								// 		hpFrame.children[6].text = enemies[j].health.toString();
								// 		break;
								// 	case 'ranged3':
								// 		hpFrame.children[8].text = enemies[j].health.toString();		
								// 		break;
								// }
								
								console.log(enemies[j].health);
								//break;
							}
						}
					}
				}
			}
		}	
		if(unit.type == 'ranged') {
			if(ability == 'rangedAttack') {
				for(var i = 0; i < tiles.length; i++) {
					var tile = tiles[i];
					if(tile.position.x == player.position.x && tile.position.z == player.position.z) {
						animateTileVisibility(tile, 30, 0.4);
						skillInfoBar.children[0].text = "Enemy using Ranged Attack on the Player!";
						skillInfoBar.levelVisible = true;
						setTimeout(function() {
							console.log(tile);
							scene.stopAnimation(tile);
							tile.visibility = 1.0;
							skillInfoBar.levelVisible = false;
							player.health -= 5;
							hpFrame.children[2].text = player.health.toString();
						}, 3000);
						break;
					}
				}
			}
		}	
	}

	// A function that is used to generate a particle effect that origins from a certain object.
	function emitParticles(targetObject) {

		var origin = BABYLON.Mesh.CreateBox("particlesOrigin", 0.1, scene);
		origin.position = targetObject.position;
		origin.isVisible = true;

		var particleSystem = new BABYLON.ParticleSystem("particleSystem", 2000, scene);

		particleSystem.particleTexture = new BABYLON.Texture("assets/particles/flare.png", scene);

		particleSystem.emitter = origin;
		particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0);
		particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);

		particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
	    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
	    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

		particleSystem.minSize = 0.1;
		particleSystem.maxSize = 0.5;

		particleSystem.minLifeTime = 0.3;
		particleSystem.maxLifeTime = 1.5;

		particleSystem.emitRate = 1500;

		particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

		particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

		particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
		particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

		particleSystem.minAngularSpeed = 0;
		particleSystem.maxAngularSpeed = Math.PI;

		particleSystem.minEmitPower = 1;
		particleSystem.maxEmitPower = 3;
		particleSystem.updateSpeed = 0.005;

		particleSystem.disposeOnStop = true;

		//particleSystem.start();

	}

	// A function that gives a range/area-of-effect preview of a given skill when the cursor is hovered above the skill name in the skill frame.
	function telegraphTiles(range, origin, pattern) {

		var location = origin.position;		

		tiles.forEach(function(tile) {
			switch(pattern) {
				case 1: 
					// Row left of unit.
					if(tile.position.x == location.x - range)  {				
						if(tile.position.z == location.z - range || tile.position.z == location.z || tile.position.z == location.z + range) {
							
							animateTileVisibility(tile, 30, 0.4);				
						}					
					}		
					// Row of unit.
					else if(tile.position.x == location.x) {
						// Skip middle tile since it's the units location.
						if(tile.position.z == location.z - range || tile.position.z == location.z + range) {

							animateTileVisibility(tile, 30, 0.4);					
						}
					}
					// Row right of unit.
					else if(tile.position.x == location.x + range) {
						if(tile.position.z == location.z - range || tile.position.z == location.z || tile.position.z == location.z + range) {
							
							animateTileVisibility(tile, 30, 0.4);			
						}				
					}
					break;
				case 2:
					// Three tiles away from unit.
					if(tile.position.x == location.x + range) {
						if(tile.position.z == location.z)
						{
							//animateTileColor(tile, 30, new BABYLON.Color3(0.5, 0.5,0));
							animateTileVisibility(tile, 30, 0.5);
						}
							
						}					
					break;				 
			}			
		});		
	} 

	function animateTileVisibility(tile, endFrame, targetVisibility) {

		var animationTile = new BABYLON.Animation("tileAnimation", "visibility", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		var keys = [];
		keys.push({
			frame: 0,
			value: 1
		});
		keys.push({
			frame: endFrame,
			value: targetVisibility
		});
		animationTile.setKeys(keys);
		tile.animations.push(animationTile);
		scene.beginAnimation(tile, 0, endFrame, true);	
	}

	function animateTileColor(tile, endFrame, targetColor) {

		var animationTile = new BABYLON.Animation("tileAnimation", "this.material.emissiveColor", 30, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		var keys = [];
		keys.push({
			frame: 0,
			value: new BABYLON.Color3(0, 0, 0)
		});
		keys.push({
			frame: endFrame,
			value: targetColor
		});
		animationTile.setKeys(keys);
		tile.animations.push(animationTile);
		scene.beginAnimation(tile, 0, endFrame, true);	
	}	
};

document.addEventListener("DOMContentLoaded", function () {
	new Game('renderCanvas');
}, false);
