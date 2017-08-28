Game = function(canvasId) {

	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(93 / 255, 93 / 255, 93 / 255);

	// Load assets via assets manager.
	var preloader = new BABYLON.AssetsManager(scene);

	// Load sound files via asset manager.
	var sound1, sound2, sound3, sound4, sound5, sound6, sound7, sound8, sound9, music;
	var musicTrack = new BABYLON.SoundTrack(scene);
	var soundTask = preloader.addBinaryFileTask("sound_1", "assets/sounds/blade.aac");
	soundTask.onSuccess = function (task) {		
		sound1 = new BABYLON.Sound("sound_1", task.data, scene);		
	};
	var soundTask2 = preloader.addBinaryFileTask("sound_2", "assets/sounds/shift.aac");
	soundTask2.onSuccess = function (task) {		 
		sound2 = new BABYLON.Sound("sound_2", task.data, scene);
	};
	var soundTask3 = preloader.addBinaryFileTask("sound_3", "assets/sounds/explosion.aac");
	soundTask3.onSuccess = function (task) {
		sound3 = new BABYLON.Sound("sound_3", task.data, scene);
		sound3.setVolume(0.7);
	};	
	var soundTask4 = preloader.addBinaryFileTask("sound_4", "assets/sounds/arrow.aac");
	soundTask4.onSuccess = function (task) {
		sound4 = new BABYLON.Sound("sound_4", task.data, scene);
	};
	var soundTask5 = preloader.addBinaryFileTask("sound_5", "assets/sounds/arrow2.aac");
	soundTask5.onSuccess = function (task) {
		sound5 = new BABYLON.Sound("sound_5", task.data, scene);
	};
	var soundTask6 = preloader.addBinaryFileTask("sound_6", "assets/sounds/beep.aac");
	soundTask6.onSuccess = function (task) {
		sound6 = new BABYLON.Sound("sound_6", task.data, scene);
	};
	var soundTask7 = preloader.addBinaryFileTask("sound_7", "assets/sounds/smack.aac");
	soundTask7.onSuccess = function (task) {
		sound7 = new BABYLON.Sound("sound_7", task.data, scene);
	};
	var soundTask8 = preloader.addBinaryFileTask("sound_8", "assets/sounds/slowmo_punch.aac");
	soundTask8.onSuccess = function (task) {
		sound8 = new BABYLON.Sound("sound_8", task.data, scene);
		sound8.setVolume(2);
	};
	var soundTask9 = preloader.addBinaryFileTask("sound_9", "assets/sounds/mark.aac");
	soundTask9.onSuccess = function (task) {
		sound9 = new BABYLON.Sound("sound_9", task.data, scene);
	};
	var soundTask10 = preloader.addBinaryFileTask("sound_10", "assets/sounds/music.aac");
	soundTask10.onSuccess = function (task) {
		music = new BABYLON.Sound("Sound_10", task.data, scene,  function() { music.play(2); }, { loop: true } );
		musicTrack.AddSound(music);		
		musicTrack.setVolume(0.5);
	};
	
	// Set up camera.
	var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3.Zero(), scene);
	camera.position.y = 14; // 14 before
	camera.position.z = -9; // -9 before
	camera.position.x = 18;		
	camera.rotation.x = 0.61; // 61 before
	//camera.attachControl(canvas, false);
	camera.fov = 0.8;
	// Store camera alpha angle that will be applied to background image plane.
	var cameraAngle = camera.rotation.x;		

	// Sprite player manager and player parameters.
	var spriteManagerPlayer = new BABYLON.SpriteManager('playerManager', 'assets/characters/cProtagonist.png', 1, 512, scene);
	var player = new BABYLON.Sprite('player', spriteManagerPlayer);
	player.size = 2.5;
	player.position.y = 1;
	player.position.x = 11;
	player.position.z = 5;
	player.cellIndex = 0;
	player.health = 100;
	player.maxHealth = 100;
	player.initiative = 2;
	player.isPickable = false;	
	addPlayerAbilities();
	
	// Idle sprite animation.
	player.playAnimation(0, 2, true, 400);

	// Sprite enemy manager. As of now, allocate memory for 1 instance of melee type and 2 instances of ranged type.
	var spriteManagerEnemyMelee = new BABYLON.SpriteManager('enemyManager', 'assets/characters/cGenericMelee.png', 1, 512, scene);
	var spriteManagerEnemyRange = new BABYLON.SpriteManager('enemyManager', 'assets/characters/cGenericRange.png', 2, 512, scene);
	var enemies = [];	

	// Load different textures. /* HINT: Adding texture tasks in a loop won't work, because at runtime the loop-index reference doesn't exist anymore. */
	var groundMaterials = [];
	var textureTask;
	var particleTexture;	

	textureTask = preloader.addTextureTask("image task", "assets/particles/flare.png");
	textureTask.onSuccess = function (task) {
		particleTexture = task.texture;
	};	

	var groundMaterial0 = new BABYLON.StandardMaterial("Grass0", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/mountains/TilesMountainGround0.png");
	textureTask.onSuccess = function(task) {
		groundMaterial0.emissiveTexture = task.texture;
		groundMaterials.push(groundMaterial0);
	}

	var groundMaterial1 = new BABYLON.StandardMaterial("Grass1", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/mountains/TilesMountainGround1.png");
	textureTask.onSuccess = function(task) {
		groundMaterial1.emissiveTexture = task.texture;
		groundMaterials.push(groundMaterial1);
	}

	var groundMaterial2 = new BABYLON.StandardMaterial("Grass2", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/mountains/TilesMountainGround2.png");
	textureTask.onSuccess = function(task) {
		groundMaterial2.emissiveTexture = task.texture;
		groundMaterials.push(groundMaterial2);
	}

	var groundMaterial3 = new BABYLON.StandardMaterial("Grass3", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/mountains/TilesMountainGround3.png");
	textureTask.onSuccess = function(task) {
		groundMaterial3.emissiveTexture = task.texture;
		groundMaterials.push(groundMaterial3);
	}

	var groundMaterial4 = new BABYLON.StandardMaterial("Grass4", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/mountains/TilesMountainGround4.png");
	textureTask.onSuccess = function(task) {
		groundMaterial4.emissiveTexture = task.texture;
		groundMaterials.push(groundMaterial4);
	}

	var groundMaterial5 = new BABYLON.StandardMaterial("Grass5", scene);
	textureTask = preloader.addTextureTask("image task", "assets/tiles/mountains/TilesMountainGround5.png");
	textureTask.onSuccess = function(task) {
		groundMaterial5.emissiveTexture = task.texture;
		groundMaterials.push(groundMaterial5);
	}	

	// Create a grid that resembles the ground.	
	var tileSize = 2;
	var gridHeight = 6 * tileSize;
	var gridWidth = 20 * tileSize;
	var boundaries = {
		"left" : 0,
		"right" : gridWidth,
		"front" : 0,
		"back" : gridHeight
	};
	
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
	var playerMovable = true;
	scene.actionManager = new BABYLON.ActionManager(scene);

	// Turn controls.	
	var playerTurn = true;
	var enemyTurn = false;	
	var turnNumber = 1;		
	var tick = 1;
	var aimSkill = false;
	var hoverInterface = false;
	var currentLevel = 'mountains';
	var gameOver = false;
	var currentPositions = new Map();
	currentPositions.set("player", player.position);	

	// 2D canvas that is used to display various ingame info.
	var canvas2D = new BABYLON.ScreenSpaceCanvas2D(scene, {
        id: "ScreenCanvas",
        size: new BABYLON.Size(canvas.width, canvas.height),
        cachingStrategy: BABYLON.Canvas2D.CACHESTRATEGY_DONTCACHE
    });

	// Spawn enemies.
	var enemy1 = spawnEnemy(boundaries.right / 2, boundaries.right, boundaries.front, boundaries.back, 'Marksman 1', 'ranged', new BABYLON.Vector3(25, 1, 7));
	var enemy2 = spawnEnemy(boundaries.right / 2, boundaries.right, boundaries.front, boundaries.back, 'Marksman 2', 'ranged', new BABYLON.Vector3(25, 1, 3));
	var enemy3 = spawnEnemy(boundaries.right / 2, boundaries.right, boundaries.front, boundaries.back, 'Scrapper', 'melee', new BABYLON.Vector3(21, 1, 5));
	var currentEnemy = enemies.length - 1;	
   
  	// Rect for player hp bar.
	player.hpRect = new BABYLON.Rectangle2D({
		id: "hpRect", parent: canvas2D, x: 0, y: 0, width: canvas2D.width / 12, height: 18,
		fill: "#494C99A0", border: "#FF0000FF, #FF0000AF", borderThickness: 3, roundRadius: 2, isPickable: false, isVisible: true,
		children: 
		[
			new BABYLON.Rectangle2D(
			{
				id: "insideRect", marginAlignment: "v: center, h: right", marginRight: 1, width: canvas2D.width / 12 - 2, height: 15, fill: "#FF8C00FF", roundRadius: 0
			}),
			new BABYLON.Text2D("100", {id: "playerHPtext", fontName: "11pt Century Gothic", fontSuperSample: false, fontSignedDistanceField: false, marginAlignment: "h: right, v: center", marginRight: 5, 
				defaultFontColor: new BABYLON.Color4(0.0, 0.0, 0.0, 1.0) })
		]
	});

    var spriteUImain;   
	textureTask = preloader.addTextureTask("image task", "assets_ALT/levels/mountains/interface/0.png");	
	textureTask.onSuccess = function(task) {	
		// Scale sprite to fit current canvas dimensions.
		var scaleFactor =  canvas2D.width / task.texture._texture._baseWidth;			
		task.texture.hasAlpha = true;
		spriteUImain = new BABYLON.Sprite2D(task.texture, 
		{	
			parent: canvas2D, id: "spriteUImain", x: -1, y: -1, invertY: false, spriteSize: null, 
			spriteLocation: BABYLON.Vector2.Zero(), 
			scaleX: scaleFactor, scaleY: scaleFactor,			
			origin: BABYLON.Vector2.Zero(),
			isPickable: false
		});				
	} 	

	var sprite_skill_icon_1;
	textureTask = preloader.addTextureTask("image task", "img/skill_icon_1.png");
	textureTask.onSuccess = function(task) {
		task.texture.hasAlpha = true;
		var scaleFactor = 0.3;
		sprite_skill_icon_1 = new BABYLON.Sprite2D(task.texture,
		{
			parent: canvas2D, id: "spriteSkillIcon1", x: canvas2D.width * (1 / 60), y: canvas2D.height* (3 / 40), invertY: false, spriteSize: null,
			spriteLocation: BABYLON.Vector2.Zero(), origin: BABYLON.Vector2.Zero(),
			isVisible: true, isPickable: true,
			scaleX: scaleFactor, scaleY: scaleFactor
		});
	}

	var sprite_skill_icon_2;
	textureTask = preloader.addTextureTask("image task", "img/skill_icon_3.png");
	textureTask.onSuccess = function(task) {
		task.texture.hasAlpha = true;
		var scaleFactor = 0.3;
		sprite_skill_icon_2 = new BABYLON.Sprite2D(task.texture,
		{
			parent: canvas2D, id: "spriteSkillIcon1", x: canvas2D.width * (5.25 / 60), y: canvas2D.height * (1 / 40), invertY: false, spriteSize: null,
			spriteLocation: BABYLON.Vector2.Zero(), origin: BABYLON.Vector2.Zero(),
			isVisible: true, isPickable: true,
			scaleX: scaleFactor, scaleY: scaleFactor
		});
	}

	var sprite_skill_icon_3;
	textureTask = preloader.addTextureTask("image task", "img/skill_icon_2.png");
	textureTask.onSuccess = function(task) {
		task.texture.hasAlpha = true;
		var scaleFactor = 0.3;
		sprite_skill_icon_3 = new BABYLON.Sprite2D(task.texture,
		{
			parent: canvas2D, id: "spriteSkillIcon1", x: canvas2D.width * (11 / 60), y: canvas2D.height * (1.75 / 40), invertY: false, spriteSize: null,
			spriteLocation: BABYLON.Vector2.Zero(), origin: BABYLON.Vector2.Zero(),
			isVisible: true, isPickable: true,
			scaleX: scaleFactor, scaleY: scaleFactor
		});
	}

	var sprite_skill_icon_4;
	textureTask = preloader.addTextureTask("image task", "img/skill_icon_4.png");
	textureTask.onSuccess = function(task) {
		task.texture.hasAlpha = true;
		var scaleFactor = 0.3;
		sprite_skill_icon_4 = new BABYLON.Sprite2D(task.texture,
		{
			parent: canvas2D, id: "spriteSkillIcon1", x: canvas2D.width * (15.25 / 60), y: canvas2D.height * (1 / 40), invertY: false, spriteSize: null,
			spriteLocation: BABYLON.Vector2.Zero(), origin: BABYLON.Vector2.Zero(),
			isVisible: true, isPickable: true,
			scaleX: scaleFactor, scaleY: scaleFactor
		});
	}

    // Add frame for the current turn.
    var turnFrame = new BABYLON.Rectangle2D({
    	id: "rectTopLeft", parent: canvas2D, width: 200, height: 100, x: 0, y: canvas2D.height - 100,
    	fill: "#4040408F", border: "#A040A0D0, #FFFFFF", borderThickness: 5,
    	roundRadius: 10, isVisible: false, isPickable: false,
    	children:
    	[
    		new BABYLON.Text2D("Current Turn:", { id: "turnTextTitle", fontName: "20pt Arial", marginAlignment: "h: center, v: top", marginTop: 5 }),
    		new BABYLON.Text2D(turnNumber.toString(), { id: "turnNumber", fontName: "25pt Arial", marginAlignment: "h: center, v: bottom", marginBottom: 15 })
    	]
    });

    // Frame for hit poitns display.
    var hpFrame = new BABYLON.Rectangle2D({
    	id: "rectTopRight", parent: canvas2D, width: 300, height: 200, x: canvas2D.width - 300, y: canvas2D.height - 250,
    	fill: "#4040408F", border: "#A040A0D0, #FFFFFF", borderThickness: 5,
    	roundRadius: 10, isVisible: false,
    	children:
    	[
    	new BABYLON.Text2D("Hit Points", { id: "hpTitle", fontName: "20pt Arial", marginAlignment: "h: center, v:top", marginTop: 5 }),
    	new BABYLON.Text2D("Player:", { id: "playerHpText", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 35, marginLeft: 5 }),
    	new BABYLON.Text2D(player.health.toString(), { id: "playerHp", fontName: "20pt Arial", marginAlignment: "h: right, v: top", marginTop: 35, marginRight: 5 }),
    	new BABYLON.Text2D("Scrapper:", { id: "enemy_1HpText", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 65, marginLeft: 5}),
    	new BABYLON.Text2D(enemy3.health.toString(), { id: "enemy_1Hp", fontName: "20pt Arial", marginAlignment: "h: right, v: top", marginTop: 65, marginRight: 5 }),
    	new BABYLON.Text2D("Marksman 1:", { id: "enemy_2HpText", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 95, marginLeft: 5}),
    	new BABYLON.Text2D(enemy1.health.toString(), { id: "enemy_2Hp", fontName: "20pt Arial", marginAlignment: "h:right, v: top", marginTop: 95, marginRight: 5 }),
    	new BABYLON.Text2D("Marksman 2:", { id: "enemy_3HpText", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 125, marginLeft: 5}),
    	new BABYLON.Text2D(enemy2.health.toString(), { id: "enemy_3Hp", fontName: "20pt Arial", marginAlignment: "h: right, v: top", marginTop: 125, marginRight: 5 }),
    	]
    });
    
    // Add a skill info bar at the top of the screen.
    var abilityName;
    var infoBar = new BABYLON.Rectangle2D({
    	id: "infoBar", parent: canvas2D, width: 700, height: 80, x: canvas.width / 2 - 350, y: canvas2D.height - 80,
    	fill: "#4040408F", border: "#A040A0D0, #FFFFFF", borderThickness: 5,
    	roundRadius: 10, isVisible: false,
    	children:
    	[
    		new BABYLON.Text2D("Player has used the ability " + abilityName, { id: "skillInfo", fontName: "20pt Arial", marginAlignment: "h: center, v: center" })
    		//new BABYLON.Text2D(abilityUsed, { id: "abilityUsed", fontName: "20pt Arial", marginAlignment: "h: right, v: center"})
    	]
    });

    // Add an ability-frame.
    var skillsFrame = new BABYLON.Rectangle2D({
    	id: "rectBottom", parent: canvas2D, width: 500, height: 300, x: 0, y: canvas2D.height - 450,
    	fill: "#4040408F", border: "#A040A0D0, #FFFFFF", borderThickness: 5,
    	roundRadius: 10, isVisible: false, isPickable: false
    });

    // Add content to the frame.
    var skillsTitle = new BABYLON.Text2D("Abilities:", {parent: skillsFrame, id: "skillsTextTitle", fontName: "22pt Arial", marginAlignment: "h: center, v: top", marginTop: 5 });
    var skill_1 = new BABYLON.Text2D("Dimensional Stab", {parent: skillsFrame, id: "attack_1", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 50, marginLeft: 10 });
    var skill_2 = new BABYLON.Text2D("Intensyfing Mark", {parent: skillsFrame, id: "attack_2", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 90, marginLeft: 10 });
    var skill_3 = new BABYLON.Text2D("Shatter", {parent: skillsFrame, id: "attack_3", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 130, marginLeft: 10 });
    var skill_4 = new BABYLON.Text2D("Multidimensional Dash", {parent: skillsFrame, id: "attack_4", fontName: "20pt Arial", marginAlignment: "h: left, v: top", marginTop: 170, marginLeft: 10 });    

    /* This doesnt work for some reason...    */
    // scene.actionManager = new BABYLON.ActionManager(scene);
    // scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
    // 	console.log('scenemanager');
    // 	if (evt.sourceEvent.key == "r")  {
    // 		console.log('spacebar');
    // 		playerTurn = false;
    // 		enemyTurn = true;
    // 		actEnemy(boundaries, enemies[currentEnemy]);
    // 	}
    // }));

    /* ... so we use standard event listener instead, to end the player turn once spacebar is pressed. 
    	Needed for when the player wants to end the turn early without attacking or moving. 
    */
    window.addEventListener("keydown", function (evt) {
    	// End turn manually. SPACEBAR
    	if (evt.keyCode == 32 && playerTurn) {
    		var animatable = scene.getAnimatableByTarget(player);
    		if(animatable != null)
    			return;
    		
			playerTurn = false;
    		enemyTurn = true;
    		actEnemy(boundaries, enemies[currentEnemy]);    		    		
    	}
    	// Leave skill aim mode. ESC
    	else if(evt.keyCode == 27 && aimSkill) {
    		for(var ability in player.abilities) {
						if(player.abilities[ability].active == true) {
							player.abilities[ability].active = false;
						}
					}
			aimSkill = false;	
    	}    
    	// Stop music or resume it.
    	else if(evt.keyCode == 77) {
    		if(music.isPlaying)
    			music.pause();
    		else if(music.isPaused)
    			music.play();
    	}

    	else if(evt.keyCode == 67) {
    		music.stop();
    		document.getElementById('renderCanvas').style.display = 'none';
    		document.getElementById('imageCanvas').style.display = 'block';
    		document.getElementById('imageCanvas').style.animation = 'fadeIn 2.5s linear 0s 1 normal forwards running';  
    		
    		document.getElementById('imageCanvas').addEventListener('click', function(e) {
    				// Stop the event from firing automatically.
    				e.stopPropagation();
    				// Execute the scene reloading.
    				onClickTrigger();
    			});	    		     			
    	}
    });

	// Iterate through rows and columns; create tiles for the ground and add respective interaction with the pointer.
	var tiles = [];
	for (var x = 0 + tileSize / 2; x < gridWidth ; x += tileSize) {
		for (var z = 0 + tileSize / 2; z < gridHeight; z += tileSize){

			var tile = BABYLON.Mesh.CreatePlane('tile_' + x + '_' + z, tileSize, scene);
			tile.position = new BABYLON.Vector3(x, 0, z);			
			tile.rotation.x = Math.PI / 2;
			tile.actionManager = new BABYLON.ActionManager(scene);
			var action = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, tile, "visibility", 0.5, 200);
			var action2 = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, tile, "visibility", 1.0, 400);
			var action3 = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function(event) {

				// Avoid interference with 2D-canvas interaction.
				if(hoverInterface)
					return;

				// Retrieve the mesh that is currently under the pointer.
				tile = event.meshUnderPointer;	

				// This is the pointer click mode that is activated when a skill has been chosen and is now aimed at a tile.
				if(aimSkill) {

					var abilityId;
					for(var prop in player.abilities) {
						if(player.abilities[prop].active == true) {
							abilityId = prop;							
							break;
						}
					}
					useAbility(player, abilityId, tile);				
				}

				// Second pointer click mode that is the default one. Moves the player to the targeted tile, if in range.
				else if(playerMovable && playerTurn && !enemyTurn && (Math.abs(player.position.x - tile.position.x) <= tileSize && Math.abs(player.position.z - tile.position.z) <= tileSize) && !comparePositions(tile.position)) {	

					playerMovable = false;						

					var nextPos = new BABYLON.Vector3(tile.getAbsolutePosition().x, player.position.y, tile.getAbsolutePosition().z);


					if(nextPos.x < player.position.x)
						player.invertU = true;
					else
						player.invertU = false;
					var distance = BABYLON.Vector3.DistanceSquared(player.position, nextPos);

					var animationPlayer = new BABYLON.Animation("playerAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
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
						
						player.playAnimation(0, 2, true, 400);
						
						// var transformMatrix = scene.getTransformMatrix();
						// var viewport = scene.activeCamera.viewport;
						// var coordinates = BABYLON.Vector3.Project(player.position, BABYLON.Matrix.Identity(), transformMatrix, viewport);
						
						// if (coordinates.x > 0.8) {
						// 	playerMovable = false;
						// 	var animationCamera = new BABYLON.Animation("cameraAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
						// 	var nextPos = camera.position.add(new BABYLON.Vector3(10, 0, 0));

						// 	var keysCamera = [];
						// 	keysCamera.push( { frame: 0, value: camera.position });
						// 	keysCamera.push( { frame: 60, value: nextPos });
						// 	animationCamera.setKeys(keysCamera);

						// 	animationCamera.setEasingFunction(easingFunction);
						// 	camera.animations.push(animationCamera);
						// 	scene.beginAnimation(camera, 0, 60, false, 1.0, function() {
						// 		//playerMovable = true;
						// 	});
						// }
						
						
						// enemyTurn = true;
						// playerTurn = false;		

						// actEnemy(boundaries, enemies[currentEnemy]);				
					});
				}
				else if(!(Math.abs(player.position.x - tile.position.x) <= tileSize && Math.abs(player.position.z - tile.position.z) <= tileSize)) {
					infoBar.children[0].text = "Can't move so far at once!";
					infoBar.levelVisible = true;
					setTimeout(function() {
						infoBar.levelVisible = false;
					}, 2000);
				}
			});

			// Add the actions to each tile.
			tile.actionManager.registerAction(action);
			tile.actionManager.registerAction(action2);
			tile.actionManager.registerAction(action3);

			// Distribute tile textures randomly.
			var randomNumber = Math.floor(Math.random() * 6);
			if (randomNumber == 0)
				tile.material = groundMaterial0;
			else if (randomNumber == 1)
				tile.material = groundMaterial1;
			else if (randomNumber == 2)
				tile.material = groundMaterial2;
			else if( randomNumber == 3)
				tile.material = groundMaterial3;
			else if(randomNumber == 4)
				tile.material = groundMaterial4;
			else
				tile.material = groundMaterial5; 			

			// Add tile to tiles array.
			tiles.push(tile);
		}
	}

	// Two random U-offset to get a randomized touch on the background placements.
	var randomUOffset1 = Math.random();
	var randomUOffset2 = Math.random();

	// Texture for sky material.
	var skyMaterial = new BABYLON.StandardMaterial('skyMaterial', scene);
	textureTask = preloader.addTextureTask("image task", "assets/levels/mountains/backgrounds/back/0.png");
	textureTask.onSuccess = function (task) {
		skyMaterial.emissiveTexture = task.texture;
		// skyMaterial.opacityTexture = skyMaterial.emissiveTexture;
		skyMaterial.emissiveTexture.uScale = 2.0;
	}

	// Texture for background plane.
	var bgMaterial = new BABYLON.StandardMaterial('bgMaterial', scene);
	textureTask = preloader.addTextureTask("image task", "assets/levels/mountains/backgrounds/front/1.png");
	textureTask.onSuccess = function (task) {
		bgMaterial.emissiveTexture = task.texture;
		bgMaterial.opacityTexture = bgMaterial.emissiveTexture;
		// bgMaterial.hasAlpha = true;
		//bgMaterial.alpha = 1.0;
		bgMaterial.emissiveTexture.hasAlpha = true;
		bgMaterial.useAlphaFromEmissiveTexture = true;
		//bgMaterial.emissiveTexture.getAlphaFromRGB = true;
		bgMaterial.emissiveTexture.uScale = 2.0;
		bgMaterial.emissiveTexture.uOffset = randomUOffset1;
	}

	var bgMaterialSmall = new BABYLON.StandardMaterial('bgMaterialSmall', scene);
	textureTask = preloader.addTextureTask("image task", "assets/levels/mountains/backgrounds/front/0.png");
	textureTask.onSuccess = function (task) {
		bgMaterialSmall.emissiveTexture = task.texture;
		bgMaterialSmall.opacityTexture = bgMaterialSmall.emissiveTexture;
		// bgMaterialSmall.hasAlpha = true;
		bgMaterialSmall.emissiveTexture.hasAlpha = true;
		bgMaterialSmall.useAlphaFromEmissiveTexture;
		bgMaterialSmall.emissiveTexture.uScale= 2.0;
		bgMaterialSmall.emissiveTexture.uOffset = randomUOffset2;
	}

	var bgMaterialSmall2 = new BABYLON.StandardMaterial('bgMaterialSmall2', scene);
	textureTask = preloader.addTextureTask("image task", "assets/levels/mountains/backgrounds/front/2.png");
	textureTask.onSuccess = function (task) {
		bgMaterialSmall2.emissiveTexture = task.texture;
		bgMaterialSmall2.opacityTexture = bgMaterialSmall2.emissiveTexture;
		// bgMaterialSmall2.hasAlpha = true;
		bgMaterialSmall2.emissiveTexture.hasAlpha = true;
		bgMaterialSmall2.useAlphaFromEmissiveTexture;
		bgMaterialSmall2.emissiveTexture.uScale= 2.0;
		bgMaterialSmall2.emissiveTexture.uOffset = randomUOffset2;
	}

	// Create background plane for sky.
	var skyPlane = BABYLON.MeshBuilder.CreatePlane('skyPlane', {width: gridWidth * 2.5, height: gridHeight}, scene, false, BABYLON.MeshBuilder.FRONTSIDE);
	skyPlane.material = skyMaterial;
	// skyPlane.position = new BABYLON.Vector3(gridWidth / 2, -2.9 , gridHeight + 16 * tileSize);
	skyPlane.position = new BABYLON.Vector3(gridWidth / 2, -2.9 , gridHeight + 16 * tileSize);
	skyPlane.rotation.x = cameraAngle;

	// Create front-background plane.
	var bgPlane = BABYLON.MeshBuilder.CreatePlane('bgPlane', {width: gridWidth * 1.5, height: gridHeight}, scene, false, BABYLON.MeshBuilder.FRONTSIDE);
	bgPlane.material = bgMaterial;
	//bgPlane.showBoundingBox = true;
	//var offsetY = bgPlane.height / 2;
	bgPlane.position = new BABYLON.Vector3(gridWidth / 2 , 3, gridHeight + 2 * tileSize);
	bgPlane.rotation.x = cameraAngle;	
	// bgPlane.renderingGroupId = 1;

	// 
	var bgPlaneSmall = BABYLON.MeshBuilder.CreatePlane('bgPlaneSmall', {width: 2.25 * gridWidth, height: 2 * gridWidth / 8}, scene, false, BABYLON.MeshBuilder.FRONTSIDE);
	bgPlaneSmall.position = new BABYLON.Vector3(gridWidth / 2 , 0.5, gridHeight + 10 * tileSize);
	bgPlaneSmall.material = ~~(Math.random() * 2) ? bgMaterialSmall : bgMaterialSmall2;
	bgPlaneSmall.rotation.x = cameraAngle;
	// bgPlane.renderingGroupId = 1;

	// Debug function to show the 3 axis.
	var showAxis = function(size) {
		var axisX = BABYLON.Mesh.CreateLines("axisX", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0) ], scene);
  		axisX.color = new BABYLON.Color3(1, 0, 0);
  		var axisY = BABYLON.Mesh.CreateLines("axisY", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0) ], scene);
  		axisY.color = new BABYLON.Color3(0, 1, 0);
  		var axisZ = BABYLON.Mesh.CreateLines("axisZ", [new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size) ], scene);
  		axisZ.color = new BABYLON.Color3(0, 0, 1);
	};

	// Called every frame before rendering.
	scene.registerBeforeRender(function() {		
		
		// End round when both parties are finished.			
		if (!playerTurn && !enemyTurn) {		
			roundEndClear();
		}		
	});
	
	// Called every frame after rendering.
	var doOnce = 0;
	scene.registerAfterRender(function() {

		// Move hp bars with units when they're moving.
		var animatable = scene.getAnimatableByTarget(player);
		// Place the hp bars above the units (this has to be done here, after rendering once, possibly because the viewport dimensions are not "known" beforehand (?)). 
		if(doOnce == 0) {
			var targetVector = new BABYLON.Vector3(player.position.x - 1, player.position.y + 1.6, player.position.z);
			var projection = BABYLON.Vector3.Project(targetVector, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
			player.hpRect.x = projection.x;
			player.hpRect.y = engine.getRenderHeight() - projection.y;
			enemies.forEach(function(enemy) {
				var targetVector = new BABYLON.Vector3(enemy.position.x - 1.5, enemy.position.y + 1.25, enemy.position.z);
				var projection = BABYLON.Vector3.Project(targetVector, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
				enemy.hpRect.x = projection.x;
				enemy.hpRect.y = engine.getRenderHeight() - projection.y;
			});
		}		
		else if(animatable != null) {
			var targetVector = new BABYLON.Vector3(player.position.x - 1, player.position.y + 1.6, player.position.z);
			var projection = BABYLON.Vector3.Project(targetVector, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
			player.hpRect.x = projection.x;
			player.hpRect.y = engine.getRenderHeight() - projection.y;
		}
		else {
			for(var i = 0; i < enemies.length; i++) {
				var enemy = enemies[i];
				animatable = scene.getAnimatableByTarget(enemy);
				if(animatable != null) {
					var targetVector = new BABYLON.Vector3(enemy.position.x - 1.5, enemy.position.y + 1.25, enemy.position.z);
					var projection = BABYLON.Vector3.Project(targetVector, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
					enemy.hpRect.x = projection.x;
					enemy.hpRect.y = engine.getRenderHeight() - projection.y;
					break;
				}
			}
		}
		doOnce++;
	});

	// When asset manager has loaded everything, we're ready to render.
	preloader.onFinish = function (tasks) {
		// Put the interface sprite at the bottom of Z-ordering, so it doesn't override mouse interaction with the skill set.
		spriteUImain.zOrder = 1;		

		// Add observable that leads to tile telegraphing when the cursor hovers over the box boundaries.
	    sprite_skill_icon_1.pointerEventObservable.add(function() {
	    	hoverInterface = true;
	    	telegraphTiles(player.abilities.player_skill_1.range, player, 1);
	    	infoBar.children[0].text = "Damaging close combat skill that marks an enemy";
	    	infoBar.levelVisible = true;
	    }, BABYLON.PrimitivePointerInfo.PointerOver);

	    // Add observable that leads to animation cancelling / value resetting when the cursor leaves the box boundaries.
	    sprite_skill_icon_1.pointerEventObservable.add(function() {
	    	hoverInterface = false;
	    	tiles.forEach(function(tile) {
	    		var animatable = scene.getAnimatableByTarget(tile);
	    		if(animatable != null) {
	    			tile.visibility = 1.0;
	    			animatable.stop();
	    		}
	    	});   
	    	if(infoBar.children[0].text == "Damaging close combat skill that marks an enemy")
	    		infoBar.levelVisible = false; 	
	    }, BABYLON.PrimitivePointerInfo.PointerLeave);

	    // Add observable that leads to tile telegraphing when the cursor hovers over the box boundaries.
	    sprite_skill_icon_2.pointerEventObservable.add(function() {
	    	hoverInterface = true;
	    	telegraphTiles(player.abilities.player_skill_2.range, player, 2);
	    	infoBar.children[0].text = "Increases enemy marks by 1 for the next 3 turns";
	    	infoBar.levelVisible = true;
	    }, BABYLON.PrimitivePointerInfo.PointerOver);

		// Add observable that leads to animation cancelling / value resetting when the cursor leaves the box boundaries.
	    sprite_skill_icon_2.pointerEventObservable.add(function() {
	    	hoverInterface = false;
	    	tiles.forEach(function(tile) {
	    		var animatable = scene.getAnimatableByTarget(tile);
	    		if(animatable != null) {
	    			tile.visibility = 1.0;
	    			animatable.stop();
	    		}
	    	});
	    	if(infoBar.children[0].text == "Increases enemy marks by 1 for the next 3 turns")
	    		infoBar.levelVisible = false;
	    }, BABYLON.PrimitivePointerInfo.PointerLeave);

	    // Add observable that leads to tile telegraphing when the cursor hovers over the box boundaries.
	    sprite_skill_icon_3.pointerEventObservable.add(function() {
	    	hoverInterface = true;
	    	telegraphTiles(player.abilities.player_skill_3.range, player, 3);
	    	infoBar.children[0].text = "Consume 2 marks and stun an enemy for 2 turns";
	    	infoBar.levelVisible = true;
	    }, BABYLON.PrimitivePointerInfo.PointerOver);

	    // Add observable that leads to animation cancelling / value resetting when the cursor leaves the box boundaries.
	    sprite_skill_icon_3.pointerEventObservable.add(function() {
	    	hoverInterface = false;
	    	tiles.forEach(function(tile) {
	    		var animatable = scene.getAnimatableByTarget(tile);
	    		if(animatable != null) {
	    			tile.visibility = 1.0;
	    			animatable.stop();
	    		}
	    	});
	    	if(infoBar.children[0].text == "Stuns an enemy for 2 turns")
	    		infoBar.levelVisible = false;
	    }, BABYLON.PrimitivePointerInfo.PointerLeave);	

	    // Add observable that leads to tile telegraphing when the cursor hovers over the box boundaries.
	    sprite_skill_icon_4.pointerEventObservable.add(function() {
	    	hoverInterface = true;
	    	telegraphTiles(player.abilities.player_skill_4.range, player, 4);
	    	infoBar.children[0].text = "Teleport attack that can reset by killing an enemy"
	    		infoBar.levelVisible = true;
	    }, BABYLON.PrimitivePointerInfo.PointerOver);

	    // Add observable that leads to animation cancelling / value resetting when the cursor leaves the box boundaries.
	    sprite_skill_icon_4.pointerEventObservable.add(function() {
	    	hoverInterface = false;
	    	tiles.forEach(function(tile) {
	    		var animatable = scene.getAnimatableByTarget(tile);
	    		if(animatable != null) {
	    			tile.visibility = 1.0;
	    			animatable.stop();
	    		}
	    	});
	    	if(infoBar.children[0].text == "Teleport attack that can reset by killing an enemy")
	    		infoBar.levelVisible = false;
	    }, BABYLON.PrimitivePointerInfo.PointerLeave);

	    // Left mouse-click enables the aiming mode of this skill, unless it's on cooldown.
	    sprite_skill_icon_1.pointerEventObservable.add(function() {	    	
	    	if(player.abilities.player_skill_1.cooldown == 0) {
	    		infoBar.children[0].text = "Press ESC to cancel aiming";
				infoBar.levelVisible = true;
	    		aimSkill = true;
	    		player.abilities.player_skill_1.active = true;
		    	player.abilities.player_skill_1.cooldown = player.abilities.player_skill_1.cost;	    	
	    	}
	    	else {
	    		infoBar.children[0].text = "This ability is still on cooldown!";
				infoBar.levelVisible = true;
				setTimeout(function() {
					infoBar.levelVisible = false;													
				}, 2000);				
	    	}
	    }, BABYLON.PrimitivePointerInfo.PointerUp);

	    // Left mouse-click enables the aiming mode of this skill, unless it's on cooldown.
	    sprite_skill_icon_2.pointerEventObservable.add(function() {
	    	if(player.abilities.player_skill_2.cooldown == 0) {
	    		infoBar.children[0].text = "Press ESC to cancel aiming";
				infoBar.levelVisible = true;
	    		aimSkill = true;
	    		player.abilities.player_skill_2.active = true;    		
		    	player.abilities.player_skill_2.cooldown = player.abilities.player_skill_2.cost;		    	    	
	    	}
	    	else {
	    		infoBar.children[0].text = "This ability is still on cooldown!";
				infoBar.levelVisible = true;
				setTimeout(function() {
					infoBar.levelVisible = false;													
				}, 2000);				
	    	}
	    }, BABYLON.PrimitivePointerInfo.PointerUp);

	    // Left mouse-click enables the aiming mode of this skill, unless it's on cooldown.
	    sprite_skill_icon_3.pointerEventObservable.add(function() {
	    	if(player.abilities.player_skill_3.cooldown == 0) {
	    		infoBar.children[0].text = "Press ESC to cancel aiming";
				infoBar.levelVisible = true;
	    		aimSkill = true;
	    		player.abilities.player_skill_3.active = true; 
		    	player.abilities.player_skill_3.cooldown = player.abilities.player_skill_3.cost;	    	
	    	}
	    	else {
	    		infoBar.children[0].text = "This ability is still on cooldown!";
				infoBar.levelVisible = true;
				setTimeout(function() {
					infoBar.levelVisible = false;													
				}, 2000);				
	    	}
	    }, BABYLON.PrimitivePointerInfo.PointerUp);

	    // Left mouse-click enables the aiming mode of this skill, unless it's on cooldown.
	    sprite_skill_icon_4.pointerEventObservable.add(function() {
	    	if(player.abilities.player_skill_4.cooldown == 0) {
	    		infoBar.children[0].text = "Press ESC to cancel aiming";
				infoBar.levelVisible = true;
	    		aimSkill = true;
	    		player.abilities.player_skill_4.active = true; 
		    	player.abilities.player_skill_4.cooldown = player.abilities.player_skill_4.cost;	    	
	    	}
	    	else {
	    		infoBar.children[0].text = "This ability is still on cooldown!";
				infoBar.levelVisible = true;
				setTimeout(function() {
					infoBar.levelVisible = false;													
				}, 2000);				
	    	}
	    }, BABYLON.PrimitivePointerInfo.PointerUp);
	   
	    // music.play();

		// Render loop.
		engine.runRenderLoop(function() {

			// Simulate sky movement.
			skyMaterial.emissiveTexture.uOffset += 0.0002;

			// Render scene.		
			scene.render();
		});
	}

	// Load assets.
	preloader.load();

	// Resize render window on window change.
	window.addEventListener('resize', function() {
		engine.resize();
	});


	// A function that is called when both parties are finished and mechanic parameters must be re-evalued. It prepares for the next round.
	function roundEndClear() {

		var dangerousTile = scene.getMeshByID('dangerousTile');
		if(dangerousTile != undefined) {
			if(dangerousTile.ticksToExplode < 1) {
				infoBar.children[0].text = "EVERYONE GET IN COVER!";
				infoBar.levelVisible = true;
				setTimeout(function() {
					sound3.play();
				}, 1200);
				setTimeout(function() {
					infoBar.levelVisible = false;
				}, 3000);
				if(player.position.x == dangerousTile.position.x && player.position.z == tile.position.z) {
					player.health -= dangerousTile.damage;
				}
				dangerousTile.dispose();
			}
			else
				dangerousTile.ticksToExplode -= 1;
		}
					
		enemies.forEach(function(enemy) {

			// Adjust parameter changes (such as cooldown reduction) for each enemy.
			// CDR.
			for(var ability in enemy.abilities) {
				var currentAbility = enemy.abilities[ability];
				if(currentAbility.cooldown > 0) {
					currentAbility.cooldown -= 1;					
				}				
			}	
			// Enemy tagged; increase marks per round.
			if(enemy.tagged) {
				if(enemy.taggedCounter <= 3) {
					if(enemy.marks < 4)
						enemy.marks += 1;
					enemy.taggedCounter += 1;
				}
				else {
					enemy.taggedCounter = 0;
					enemy.tagged = false;
				}				
			}	
			// Enemy disabled; can't act.
			if(enemy.disabled) {
				if(enemy.disabledCounter <= 2) 
					enemy.disabledCounter += 1;
				else {
					enemy.disabledCounter = 0;
					enemy.disabled = false;
				}				
			}
			checkMarks(enemy);	
		});

		// Adjust parameter changes (such as cooldown reduction) for the player.
		// CDR.
		for(var ability in player.abilities) {
			var currentAbility = player.abilities[ability];
			if(currentAbility.cooldown > 0) {
				currentAbility.cooldown -= 1;				
			}
		}		
		// Adjust/reset game control values. 		
		turnNumber++;
		tick++;
		turnFrame.children[1].text = turnNumber.toString();
		currentEnemy = enemies.length - 1;		
		playerTurn = true;
		playerMovable = true;
	}

	// A function that loads a new level and resets game parameters.
	function reloadScene(level) {		

		currentLevel = 'grasslands';
		preloader.reset();

		// Reset positions.
		camera.position.y = 14;
		camera.position.z = -9;
		camera.position.x = 18;

		player.position.y = 1;
		player.position.x = 11;
		player.position.z = 5;
		player.hpRect.dispose();
		player.health = 100;

		player.hpRect = new BABYLON.Rectangle2D({
			id: "hpRect", parent: canvas2D, x: 0, y: 0, width: canvas2D.width / 12, height: 18,
			fill: "#494C99A0", border: "#FF0000FF, #FF0000AF", borderThickness: 3, roundRadius: 2, isPickable: false, isVisible: true,
			children: 
			[
				new BABYLON.Rectangle2D(
				{
					id: "insideRect", marginAlignment: "v: center, h: right", marginRight: 1, width: canvas2D.width / 12 - 2, height: 15, fill: "#FF8C00FF", roundRadius: 0
				}),
				new BABYLON.Text2D("100", {id: "playerHPtext", fontName: "11pt Century Gothic", fontSuperSample: false, fontSignedDistanceField: false, marginAlignment: "h: right, v: center", marginRight: 5, 
					defaultFontColor: new BABYLON.Color4(0.0, 0.0, 0.0, 1.0) })
			]
		});		

		// Reset cooldowns.
		for(var ability in player.abilities) {
			var currentAbility = player.abilities[ability];
			currentAbility.cooldown = 0;
		}			

		// Spawn enemies.
		var enemy1 = spawnEnemy(boundaries.right / 2, boundaries.right, boundaries.front, boundaries.back, 'Marksman 1', 'ranged', new BABYLON.Vector3(25, 1, 7));
		var enemy2 = spawnEnemy(boundaries.right / 2, boundaries.right, boundaries.front, boundaries.back, 'Marksman 2', 'ranged', new BABYLON.Vector3(25, 1, 3));
		var enemy3 = spawnEnemy(boundaries.right / 2, boundaries.right, boundaries.front, boundaries.back, 'Scrapper', 'melee', new BABYLON.Vector3(21, 1, 5));
		currentEnemy = enemies.length - 1;
			
		// Reset game parameters.	
		doOnce = 0;		
		playerTurn = true;
		playerMovable = true;
		enemyTurn = false;
		turnNumber = 1;
		turnFrame.children[1].text = turnNumber.toString();
		hpFrame.children[2].text = player.health.toString();
		hpFrame.children[4].text = enemy3.health.toString();
		hpFrame.children[6].text = enemy1.health.toString();
		hpFrame.children[8].text = enemy2.health.toString();

		if(level == 'grasslands') {

			scene.clearColor = new BABYLON.Color3(74 / 255, 249 / 255, 68 / 255);
			   
			textureTask = preloader.addTextureTask("image task", "assets_ALT/levels/grasslands/interface/0.png");	
			spriteUImain.dispose();
			textureTask.onSuccess = function(task) {	
				var scaleFactor =  canvas2D.width / task.texture._texture._baseWidth;			
				task.texture.hasAlpha = true;
				spriteUImain = new BABYLON.Sprite2D(task.texture, 
				{	
					parent: canvas2D, id: "spriteUImain", x: -1, y: -1, invertY: false, spriteSize: null, 
					spriteLocation: BABYLON.Vector2.Zero(), 
					scaleX: scaleFactor, scaleY: scaleFactor,			
					origin: BABYLON.Vector2.Zero(),
					isPickable: false
				});		
			} 	

			textureTask = preloader.addTextureTask('image task', "assets/levels/grasslands/backgrounds/front/1.png");
			textureTask.onSuccess = function (task) {
				bgMaterial.emissiveTexture.dispose();
				bgMaterial.emissiveTexture = task.texture;
				bgMaterial.opacityTexture = bgMaterial.emissiveTexture;
				bgMaterial.hasAlpha = true;
				bgMaterial.emissiveTexture.hasAlpha = true;
				bgMaterial.useAlphaFromEmissiveTexture;
				bgMaterial.emissiveTexture.uScale = 2.0;
			}

			textureTask = preloader.addTextureTask("image task", "assets/levels/grasslands/backgrounds/front/2.png");
			textureTask.onSuccess = function (task) {
				bgMaterialSmall.emissiveTexture.dispose();
				bgMaterialSmall.emissiveTexture = task.texture;
				bgMaterialSmall.opacityTexture = bgMaterialSmall.emissiveTexture;
				bgMaterialSmall.hasAlpha = true;
				bgMaterialSmall.emissiveTexture.hasAlpha = true;
				bgMaterialSmall.useAlphaFromEmissiveTexture;
				bgMaterialSmall.emissiveTexture.uScale = 2.0;
			}

			textureTask = preloader.addTextureTask("image task", "assets/levels/grasslands/backgrounds/front/0.png");
			textureTask.onSuccess = function (task) {
				bgMaterialSmall2.emissiveTexture.dispose();
				bgMaterialSmall2.emissiveTexture = task.texture;
				bgMaterialSmall2.opacityTexture = bgMaterialSmall2.emissiveTexture;
				bgMaterialSmall2.hasAlpha = true;
				bgMaterialSmall2.emissiveTexture.hasAlpha = true;
				bgMaterialSmall2.useAlphaFromEmissiveTexture;
				bgMaterialSmall2.emissiveTexture.uScale = 2.0;
			}			

			textureTask = preloader.addTextureTask('image task', "assets/tiles/plains/TilesGrassVariant0_128.png");
			textureTask.onSuccess = function (task) {
				groundMaterial0.emissiveTexture.dispose();
				groundMaterial0.emissiveTexture = task.texture;				
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/plains/TilesGrassVariant1_128.png");
			textureTask.onSuccess = function (task) {
				groundMaterial1.emissiveTexture.dispose();
				groundMaterial1.emissiveTexture = task.texture;				
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/plains/TilesGrassVariant2_128.png");
			textureTask.onSuccess = function (task) {
				groundMaterial2.emissiveTexture.dispose();
				groundMaterial2.emissiveTexture = task.texture;				
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/plains/TilesGrassVariant3_128.png");
			textureTask.onSuccess = function (task) {
				groundMaterial3.emissiveTexture.dispose();
				groundMaterial3.emissiveTexture = task.texture;				
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/plains/TilesGrassVariant4_128.png");
			textureTask.onSuccess = function (task) {
				groundMaterial4.emissiveTexture.dispose();
				groundMaterial4.emissiveTexture = task.texture;				
			}

			textureTask = preloader.addTextureTask('image task', "assets/tiles/plains/TilesGrassVariant0_128.png");
			textureTask.onSuccess = function (task) {
				groundMaterial5.emissiveTexture.dispose();
				groundMaterial5.emissiveTexture = task.texture;
			}

			for(var j = 0; j < tiles.length; j++) {

				var randomNumber = Math.floor(Math.random() * 5);
				if (randomNumber == 0)
					tiles[j].material = groundMaterial0;
				else if (randomNumber == 1)
					tiles[j].material = groundMaterial1;
				else if (randomNumber == 2)
					tiles[j].material = groundMaterial2;
				else if (randomNumber == 3)
					tiles[j].material = groundMaterial3;
				else 
					tiles[j].material = groundMaterial4;				
			}
		}
		preloader.load();
	}

	// Callback function for event that is triggered at level change.
	function onClickTrigger() {
		
		var imageDiv = document.getElementById('imageCanvas');
		imageDiv.style.display = 'none';
		document.getElementById('renderCanvas').style.display = 'block';
		reloadScene('grasslands');				
	}

	// A function that spawns an enemy unit, depending on type. It can either be spawned randomly withing a given range, or at a fixed location.
	function spawnEnemy(minX, maxX, minZ, maxZ, id, enemyType, fixedPosition) {
		
		var enemyDummy;

		if(enemyType == 'melee') {
			enemyDummy = new BABYLON.Sprite(id, spriteManagerEnemyMelee);
		}
		else if(enemyType == 'ranged') {
			enemyDummy = new BABYLON.Sprite(id, spriteManagerEnemyRange);
		}
		
		// Add properties.
		enemyDummy.size = 2.5;		
		enemyDummy.marks = 0;
		enemyDummy.disabled = false;
		enemyDummy.disabledCounter = 0;
		enemyDummy.tagged = false;
		enemyDummy.taggedCounter = 0;
		enemyDummy.isPickable = false;
	
		// Distinguish between types and add properties accordingly.
		enemyDummy.type = enemyType;
		if(enemyDummy.type == 'ranged') {
			enemyDummy.health = 10;
			enemyDummy.maxHealth = 10;
			enemyDummy.initiative = 2;
			enemyDummy.abilities = {
				'ranged_default_attack' : {
					range : 3,
					cooldown : 0,
					cost : 0,
					damage : 5
				},
				'ranged_special_attack' : {
					range : 3,
					cooldown : 0,
					cost : 5,
					damage : 10
				}
			}
		}
		else if(enemyDummy.type == 'melee') {
			enemyDummy.health = 20;
			enemyDummy.maxHealth = 20;
			enemyDummy.initiative = 3;
			enemyDummy.abilities = {
				'melee_default_attack' : {
					range : 1,
					cooldown : 0,
					cost : 0,
					damage : 10
				},
				'melee_special_attack' : {
					range : 1,
					cooldown : 0,
					cost : 3,
					damage : 0
				}
			}
		}		

		// Determine enemy spawn position, which can either be random or fixed, depending on the call.
		if(!fixedPosition) {
			var randomOddX, randomOddZ, targetVector;
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
		}		
		
		else {
			enemyDummy.position = fixedPosition;
		}

		currentPositions.set(id, enemyDummy.position);

		// Create a hp bar frame for each enemy that shows his current health.
		enemyDummy.hpRect = new BABYLON.Rectangle2D({
			id: "enemyhpRect", parent: canvas2D, x: 0, y: 0, width: canvas2D.width / 12, height: 18,
			fill: "#494C99A0", border: "#FF0000FF, #FF0000AF", borderThickness: 3, roundRadius: 2, isPickable: false, isVisible: true,
			children: 
			[
				new BABYLON.Rectangle2D(
				{
					id: "insideRect", marginAlignment: "v: center, h: right", marginRight: 1, width: canvas2D.width / 12 - 2, height: 15, fill: "#FF8C00FF", roundRadius: 0					
				}),
				new BABYLON.Text2D(enemyDummy.health.toString(), {id: "enemyHPtext", fontName: "11pt Cenutry Gothic", fontSuperSample: false, fontSignedDistanceField: false, marginAlignment: "h: right, v: center", marginRight: 5, 
					defaultFontColor: new BABYLON.Color4(0.0, 0.0, 0.0, 1.0)	
				})
			]
		});

		// Create four marks for each enemy that can be used by the player.
		enemyDummy.enemyMarks = [];
		for(var i = 0; i < 4; i++)  {
			var enemyMark = BABYLON.Mesh.CreateSphere('sphere_' + i, 5, 0.3, scene, false, BABYLON.Mesh.DEFAULTSIDE);
			enemyMark.material = new BABYLON.StandardMaterial('markMaterial', scene);
			enemyMark.material.emissiveColor = new BABYLON.Color3(1.0, 0.2, 0.7);
			enemyMark.position = new BABYLON.Vector3(enemyDummy.position.x - 0.5 + i / 3, 2, enemyDummy.position.z);			
			enemyMark.visibility = false;
			enemyDummy.enemyMarks.push(enemyMark);
		}

		enemies.push(enemyDummy);
		
		return enemyDummy;
	}

	// A function that adjusts the enemy marks after an enemy was hit with a marking ability.
	function checkMarks(enemy) {

		if(enemy.marks == 0) {
			enemy.enemyMarks[0].visibility = false;
			enemy.enemyMarks[1].visibility = false;
			enemy.enemyMarks[2].visibility = false;
			enemy.enemyMarks[3].visibility = false;
		}
		else if(enemy.marks == 1) {
			enemy.enemyMarks[0].visibility = true;
			enemy.enemyMarks[1].visibility = false;
			enemy.enemyMarks[2].visibility = false;
			enemy.enemyMarks[3].visibility = false;
		}
		else if(enemy.marks == 2) {
			enemy.enemyMarks[0].visibility = true;
			enemy.enemyMarks[1].visibility = true;
			enemy.enemyMarks[2].visibility = false;
			enemy.enemyMarks[3].visibility = false;
		}
		else if(enemy.marks == 3) {
			enemy.enemyMarks[0].visibility = true;
			enemy.enemyMarks[1].visibility = true;
			enemy.enemyMarks[2].visibility = true;
			enemy.enemyMarks[3].visibility = false;
		}		
		else if(enemy.marks == 4) {
			enemy.enemyMarks[0].visibility = true;
			enemy.enemyMarks[1].visibility = true;
			enemy.enemyMarks[2].visibility = true;
			enemy.enemyMarks[3].visibility = true;
		}		
	}

	// A function that compares a desired position (vector) to the currently taken positions on the board by all units.
	function comparePositions(vector) {
		for(var value of currentPositions.values()) {
			if(vector.x == value.x && vector.z == value.z)
				return true;
		}
		return false;
	}	

	// A function that moves an enemy unit.
	function actEnemy(boundaries, enemy) {

		// Check if the enemy is unable to act, then select next enemy, unless he's the last in line to act. 
		if(enemy.disabled /*|| !checkInitiative(enemy)*/) {
			infoBar.children[0].text = enemy.name + " still stunned!";
			infoBar.levelVisible = true;
			setTimeout(function(){
				infoBar.levelVisible = false;
				if(currentEnemy >= 1) 
					actEnemy(boundaries, enemies[--currentEnemy]);
				else 
					enemyTurn = false;				
			}, 3000);		
			return;	
		}
		
		var minDistanceToPlayer = enemy.type == 'ranged' ? 2 * tileSize : tileSize;		
		var distanceX = Math.abs(player.position.x - enemy.position.x);
		var distanceZ = Math.abs(player.position.z - enemy.position.z);
		var distanceToPlayer = BABYLON.Vector3.Distance(player.position, enemy.position);
		var distanceToPlayerSquared = BABYLON.Vector3.DistanceSquared(player.position, enemy.position);		
		var hideMarks = true;		

		// Determine movement direction on X-direction.
		var stepX = (enemy.position.x > player.position.x) ? -tileSize : tileSize;		
		// If one the same row, stay there. 
		if(enemy.position.x == player.position.x)
			stepX = 0; 

		// Determine movement direction on Z-direction.
		var stepZ = (enemy.position.z > player.position.z) ? -tileSize : tileSize;
		// If on the same column, stay there.
		if(enemy.position.z == player.position.z) 
			stepZ = 0;

		var nextPos = new BABYLON.Vector3(enemy.position.x + stepX, 1, enemy.position.z + stepZ);

		// Check if the desired positon is already taken by a unit.
		while(comparePositions(nextPos)) {
		
			if(stepX == tileSize || stepX == -tileSize) {
				if(stepZ == tileSize || stepZ == -tileSize) {
					// console.log('1');
					nextPos.z = enemy.position.z;
					stepZ = 0;
				}
				else {						
					// console.log('2');
					// console.log(nextPos);
					nextPos.z = enemy.position.z + tileSize;
					stepZ = tileSize;
					// console.log(nextPos);						
				}
			}
			else {
				// console.log('3');
				nextPos.x = enemy.position.x - tileSize;
				stepX = -tileSize;
			}
		}
		
		if(BABYLON.Vector3.DistanceSquared(player.position, enemy.position) >= Math.pow(minDistanceToPlayer, 2) && BABYLON.Vector3.DistanceSquared(player.position, enemy.position) <= 2 * Math.pow(minDistanceToPlayer, 2)) {		
			hideMarks = true;
			nextPos = enemy.position;			
		}
		else if(minDistanceToPlayer > distanceX && minDistanceToPlayer > distanceZ) {
			
			if(enemy.position.x > player.position.x) {
				nextPos.x = enemy.position.x + tileSize;
			}
			else if(enemy.position.x < player.position.x) {
				nextPos.z = enemy.position.x - tileSize;				
			}
			else if(enemy.position.x == player.position.x) {
				nextPos.x = enemy.position.x;
			}

			if(enemy.position.z > player.position.z) {
				nextPos.z = enemy.position.z + tileSize;				
			}
			else if(enemy.position.z < player.position.z) {
				nextPos.z = enemy.position.z - tileSize;
			}
			else if(enemy.position.z == player.position.z) {
				nextPos.z = enemy.position.z;
			}			
		}

		// Set up animation.
		var animationEnemy = new BABYLON.Animation("enemyAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
		var keysEnemy = [];
		var finalFrame = 60;
		keysEnemy.push({ frame: 0, value: enemy.position });
		keysEnemy.push({ frame: finalFrame, value: nextPos });
		animationEnemy.setKeys(keysEnemy);

		// Set up easing function which is added to animation.
		var easingFunction = new BABYLON.SineEase();
		easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
		animationEnemy.setEasingFunction(easingFunction);
		enemy.animations.push(animationEnemy);

		// Hide marks prior to animation (don't if the position remains the same.)
		if(hideMarks) {
			enemy.enemyMarks.forEach(function(mark) {
				if(mark.visibility = true)
					mark.visibility = false;
			});
		}		

		// Adjust facing direction towards movement.
		if(enemy.position.x > nextPos.x)
			enemy.invertU = false;
		else if(enemy.position.x < nextPos.x)
			enemy.invertU = true;

		// Start animating.
		scene.beginAnimation(enemy, 0, finalFrame, false, 1.0, function() {

			// Update saved position.
			currentPositions.set(enemy.name, nextPos);				

			// Adjust facing direction towards player.
			if(enemy.position.x > player.position.x) 
				enemy.invertU = false;
			else
				enemy.invertU = true;

			// Change position of marks and make marks visible again.
			if(hideMarks) {
				for(var i = 0; i < enemy.enemyMarks.length; i++) {
					enemy.enemyMarks[i].position = new BABYLON.Vector3(enemy.position.x - 0.5 + i / 3, 2, enemy.position.z);				
				}
				checkMarks(enemy);
			}			

			// When in range, attack player.
			var attackType;		
			if(enemy.type == 'melee') 
				attackType = enemy.abilities['melee_special_attack'].cooldown == 0 ? 'melee_special_attack' : 'melee_default_attack';
			else if(enemy.type == 'ranged')		
				attackType = enemy.abilities['ranged_special_attack'].cooldown == 0 ? 'ranged_special_attack' : 'ranged_default_attack';

			if(BABYLON.Vector3.DistanceSquared(player.position, nextPos) >= Math.pow(minDistanceToPlayer, 2) && BABYLON.Vector3.DistanceSquared(player.position, nextPos) <= 2 * Math.pow(minDistanceToPlayer, 2)) 				
				useAbility(enemy, attackType);

			if(gameOver) {
				infoBar.children[0].text = 'Game over! Press F5 to start again!';
				infoBar.levelVisible = true;
				setTimeout( function() {
					infoBar.levelVisible = false;
				}, 3000);
				return;
			}
			
			// Select next enemy.				
			currentEnemy--;
			while(enemies[currentEnemy.disabled] /*|| !checkInitiative(enemies[currentEnemy])*/){
				currentEnemy--;	
			}			
			// Act with next enemy after a short delay.	
			if(currentEnemy >= 0) {
				setTimeout(function() {
					actEnemy(boundaries, enemies[currentEnemy]);
				}, 1500);				
			}
			// When every enemy has acted, end round.
			else
				enemyTurn = false;				
		}); 				
	}

	function sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	// Use ability of player or enemy.
	function useAbility(unit, ability, tile, targetLocation) {	

		if(unit.name == 'player') {

			if(player.position.x > tile.position.x)
				player.invertU = true;
			else 
				player.invertU = false;

			// Get ability range and current tile/player-distance.
			var range = tileSize * player.abilities[ability].range;
			var distanceX = Math.abs(player.position.x - tile.position.x);
			var distanceZ = Math.abs(player.position.z - tile.position.z);

			// Individual skill names that are later used to display.
			var textPiece;		
			if(ability == 'player_skill_1') {
				textPiece = "Dimensional Stab";				
			}			
			else if(ability == 'player_skill_2') {
				textPiece = "Intensifying Mark";
			}	
			else if(ability == 'player_skill_3') {
				textPiece = "Shatter";
			}
			else if(ability == 'player_skill_4') {
				textPiece = "Multidimensional Dash";
			}			
			
			var hit = false;				
			
			if(distanceX <= range && distanceZ <= range) {
					
				for(var j = 0; j < enemies.length; j++) {

					var enemy = enemies[j];
					if(tile.position.x == enemy.position.x && tile.position.z == enemy.position.z) {		

						// Display current ability used, onto which enemy.
						// infoBar.children[0].text = "Player using " + textPiece + "\n\t on enemy " + enemy.name + " !";
						// infoBar.levelVisible = true;						
						
						// Some abilities need further damage calculation and/or implementation of special effects, such as stun.
						var damage = player.abilities[ability].damage;

						if(ability == 'player_skill_4') {	

							for(var index = 0; index < enemies.length; index++) {
								var restrictedTilePos = enemy.position.x + tileSize;
								if(enemies[index].position.x == restrictedTilePos) {
									infoBar.children[0].text = "Place behind " + enemy.name + " is blocked!";
									infoBar.levelVisible = true;
									aimSkill = false;			
									player.abilities[ability].active = false;
									setTimeout(function() {
										infoBar.levelVisible = false;										
									}, 3000);
									return;
								}
							}							

							// Invoke a particle system that simulates a teleportation move if the player.
							player.color = new BABYLON.Color4(0.0, 0.0, 0.0, 0.0);
							var particleSkillAnimation = emitParticles(tile);
							particleSkillAnimation.start();	

							// Let the player reappear when the particle system 'animation' has approximately finished. 
							setTimeout(function() {
								sound2.play();
								particleSkillAnimation.stop();
								player.position.x = enemy.position.x + tileSize;
								player.position.z = enemy.position.z;
								currentPositions.set("player", player.position);

								// Move hp bar with the player.
								var targetVector = new BABYLON.Vector3(player.position.x - 1, player.position.y + 1.5, player.position.z);
								var projection = BABYLON.Vector3.Project(targetVector, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));
								player.hpRect.x = projection.x;
								player.hpRect.y = engine.getRenderHeight() - projection.y;

								// Make the player turn to the back of his enemy.
								if(player.position.x > enemy.position.x)
									player.invertU = true;
								else
									player.invertU = false;
								player.color = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
							}, 1750);

							// Damage increased by 100% per mark. Consumes marks.
							damage += damage * enemy.marks;	
							enemy.marks = 0;					
						}
						else if(ability == 'player_skill_3') {
							if(enemy.marks >= 2) {
								infoBar.children[0].text = enemy.name + ' is stunned!';
								infoBar.levelVisible = true;	
								enemy.disabled = true;
								enemy.marks -= 2;
							}							
						}
						else if(ability == 'player_skill_2') {
							infoBar.children[0].text = enemy.name + ' is marked!';
							infoBar.levelVisible = true;	
							enemy.tagged = true;
						}
						else if(ability == 'player_skill_1') {
							if(enemy.marks < 4)
								enemy.marks += 1;							
						}
						checkMarks(enemy);

						// Calculate new enemy health.
						if(enemy.health > 0){
							enemy.health -= damage;
						}

						// Update enemy health display.
						switch(enemy.name) {
							case 'Scrapper':										
								hpFrame.children[4].text = enemy.health.toString();
								break;
							case 'Marksman 1':
								hpFrame.children[6].text = enemy.health.toString();
								break;
							case 'Marksman 2':
								hpFrame.children[8].text = enemy.health.toString();
								break;
						}

						enemy.hpRect.children[1].text = enemy.health.toString();
						enemy.hpRect.children[0].width *= enemy.health / enemy.maxHealth;

						setTimeout(function() {
							infoBar.levelVisible = false;															
						}, 3000);
						
						// Remove enemy from the game if health has reached zero and cleanup its parameters.
						if(enemies[j].health <= 0){
							if(ability == 'player_skill_4') {
								player.abilities['player_skill_4'].cooldown = 0;
							}
							enemy.enemyMarks.forEach(function(mark) {
								mark.dispose();
							});
							enemy.hpRect.dispose();
							infoBar.children[0].text = enemies[j].name + " vanquished!";
							infoBar.levelVisible = true;								
							currentPositions.delete(enemy.name);							
							enemies.splice(j, 1);
							enemy.dispose();
							currentEnemy = enemies.length - 1;							
							setTimeout(function() {
								infoBar.levelVisible = false;
							}, 3000);
						}							
						var hit = true;
						break;
					}					
				}
				if(!hit) {
						infoBar.children[0].text = "No enemy was hit!";
						infoBar.levelVisible = true;
						setTimeout(function() {
							infoBar.levelVisible = false;																
						}, 3000);
				}
			}
			else {
				infoBar.children[0].text = "That's too far away!";
				infoBar.levelVisible = true;
				aimSkill = false;			
				player.abilities[ability].active = false;
				setTimeout(function() {
					infoBar.levelVisible = false;													
				}, 3000);				
				return;
			}	
			if(ability == 'player_skill_1')		
				sound1.play();	
			else if(ability == 'player_skill_2')
				sound9.play();
			else if(ability == 'player_skill_3')
				sound8.play();


			// Reset values.
			playerTurn = false;
			enemyTurn = true;
			aimSkill = false;			
			player.abilities[ability].active = false;	

			// Now that a player action has been used, it's the enemy's turn. Change level if all enemies are dead instead.
			if(enemies.length < 1) {
				infoBar.children[0].text = "Level completed!";
				infoBar.levelVisible = true;
				if(currentLevel == 'grasslands') {
					setTimeout(function() {
						infoBar.levelVisible = false;
					}, 3000);
					return;
				}
				setTimeout(function() {
					infoBar.levelVisible = false;
					reloadScene('grasslands');					
				}, 3000);
				return;
			}
			else {
				setTimeout(function() {
					actEnemy(boundaries, enemies[currentEnemy]);	
				}, 3000);	
			}						
		}
		else if(unit.type == 'ranged' || unit.type == 'melee') {

			if(unit.position.x > player.position.x)
				unit.invertU = false;
			else
				unit.invertU = true;

			var textPiece;
			if(ability == 'ranged_default_attack') 
				textPiece = 'Ranged Attack';
			else if(ability == 'ranged_special_attack')
				textPiece = 'Ranged Special Attack';
			else if(ability == 'melee_default_attack')
				textPiece = 'Melee Attack';
			else if(ability == 'melee_special_attack')
				textPiece = 'Melee Special Attack';

			for(var i = 0; i < tiles.length; i++) {
				var tile = tiles[i];
				if(tile.position.x == player.position.x && tile.position.z == player.position.z) {
					animateTileVisibility(tile, 30, 0.4);
					infoBar.children[0].text = "Enemy using " + textPiece + " on the Player!";
					infoBar.levelVisible = true;
					if(ability == 'ranged_default_attack')
						sound4.play();
					else if(ability == 'ranged_special_attack')
						sound5.play();
					else if(ability == 'melee_default_attack')
						sound7.play();
					else if(ability == 'melee_special_attack')
						sound6.play();
					setTimeout(function() {		
						if(ability == 'melee_special_attack')
							addDangerTile(tile);				
						scene.stopAnimation(tile);
						tile.visibility = 1.0;
						infoBar.levelVisible = false;
						player.health -= unit.abilities[ability].damage;
						if(player.health <= 0) {
							player.health = 0;
							gameOver = true;
						}
						hpFrame.children[2].text = player.health.toString();
						player.hpRect.children[1].text = player.health.toString();
						player.hpRect.children[0].width *= player.health / player.maxHealth; 						
					}, 3000);
					break;
				}
			}			
		}	
		// Set ability on its cooldown.
		unit.abilities[ability].cooldown = unit.abilities[ability].cost;	
	}

	// Add player abilities.
	function addPlayerAbilities() {

		player.abilities = {
			// Dimensional Stab
			'player_skill_1' : {
				range : 1,
				cooldown : 0,
				cost : 0,
				damage : 10,
				active : false
			},
			// Intensfying Mark
			'player_skill_2' : {
				range : 2,
				cooldown : 0,
				cost : 3,
				damage : 0,
				active : false
			},
			// Shatter
			'player_skill_3' : {
				range : 2,
				cooldown : 0,
				cost : 5,
				damage : 0,
				active : false
			},
			// Multidimensional Dash
			'player_skill_4' : {
				range : 999,
				cooldown : 0,
				cost : 10,
				damage : 5,
				active : false
			}
		};
	}

	// A function that is used to generate a particle effect that origins from a certain object.
	function emitParticles(targetLocation) {

		// Vector variable that will be used for the fountain displacement.
		var targetPos = new BABYLON.Vector3(0, 0, 0);
		targetPos.copyFrom(targetLocation.position);
		
		// Origin of the particle system.
		var fountain = BABYLON.Mesh.CreateBox("particlesOrigin", 0.1, scene);
		fountain.position = new BABYLON.Vector3(9, 1, 5);
		fountain.isVisible = false;

		// Amount and texture of particles.
		var particleSystem = new BABYLON.ParticleSystem("particleSystem", 1000, scene);
		particleSystem.particleTexture = particleTexture;

		// Origin of the particle emittion.
		particleSystem.emitter = fountain;
		particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
		particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);

		// Color stages of the particles.
		particleSystem.color1 = new BABYLON.Color4(0.9, 0.4, 0.2, 1.0);
	    particleSystem.color2 = new BABYLON.Color4(1.0, 0.5, 0.5, 1.0);
	    particleSystem.colorDead = new BABYLON.Color4(0.0, 0.0, 0.0, 0.0);

	    // Min and max of the particle size (random in between).
		particleSystem.minSize = 0.3;
		particleSystem.maxSize = 1.3;

		// Min and max life time of the particles (random in between).
		particleSystem.minLifeTime = 1.0;
		particleSystem.maxLifeTime = 2.0;

		// Emittion rate of the particles.
		particleSystem.emitRate = 1000;

		// Blend mode of the particles.
		particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

		// No nedd for default gravity.
		particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

		// Possible starting directions of the particle movement (random in between).
		particleSystem.direction1 = new BABYLON.Vector3(-2.5, 3, -1);
		particleSystem.direction2 = new BABYLON.Vector3(2.5, -1, 1);

		// Min and max angular speed of the particles (random in between).
		particleSystem.minAngularSpeed = 0;
		particleSystem.maxAngularSpeed = Math.PI;

		// Min and max emittion power of the particle movement (random in between). 
		// Update speed that determines the update rate of the particle movement.
		particleSystem.minEmitPower = 3;
		particleSystem.maxEmitPower = 5;
		particleSystem.updateSpeed = 0.025;

		// Time the particle system is running. Disposed on stop.
		particleSystem.targetStopDuration = 2.0;
		particleSystem.disposeOnStop = true;

		// Draw particles in front of the (alpha-tested) background.
		particleSystem.renderingGroupId = 1;
		particleSystem.updateFunction = updateParticles;		

		// Move the fountain when needed.
		var isMoving = false;
		function startMoving(targetMesh) {

			if(!isMoving) {
				isMoving = true;
				targetMesh.position = targetPos;	
			}
		}

		// Function to manually calculate the particle behavior.
		function updateParticles(particles) {

			for (var i = 0; i < particles.length; i++) {

				var particle = particles[i];
				particle.age += this._scaledUpdateSpeed;

				if(particle.age >= particle.lifeTime / 1.75) {
					// Place the fountain at the aimed tile, specifically right next to it. 
					if(!isMoving) 
						startMoving(fountain);
					var directionLength = particle.direction.length();
					var newDirection = this.emitter.position.subtract(particle.position);
					particle.direction = newDirection.scale(3);
					startMoving(fountain);
				}
				// Stock particles when they've exceeded lifetime.
				if(particle.age >= particle.lifetime) {
					particles.splice(index, 1);
					this._stockParticles.push(particle);
					index--;
					continue;
				} 
				// Alter the movement and its direction of the particles when they're still alive.
				else {
					particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep);
					particle.color.addInPlace(this._scaledColorStep);

					if(particle.color.a < 0) 
						particle.color.a = 0;

					particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;

					particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
					particle.position.addInPlace(this._scaledDirection);

					this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
					particle.direction.addInPlace(this._scaledGravity);
				}
			}
		}
		return particleSystem;
	}

	// A function that gives a range/area-of-effect preview of a given skill when the cursor is hovered above the skill name in the skill frame.
	function telegraphTiles(range, origin, pattern) {

		var location = origin.position;
		var abilityRange = range * tileSize;

		tiles.forEach(function(tile) {
			switch(pattern) {
				case 1:
					// Row left of unit.
					if(tile.position.x == location.x - abilityRange)  {
						if(tile.position.z == location.z - abilityRange || tile.position.z == location.z || tile.position.z == location.z + abilityRange) {

							animateTileVisibility(tile, 30, 0.4);
						}
					}
					// Row of unit.
					else if(tile.position.x == location.x) {
						// Skip middle tile since it's the units location.
						if(tile.position.z == location.z - abilityRange || tile.position.z == location.z + abilityRange) {

							animateTileVisibility(tile, 30, 0.4);
						}
					}
					// Row right of unit.
					else if(tile.position.x == location.x + abilityRange) {
						if(tile.position.z == location.z - abilityRange || tile.position.z == location.z || tile.position.z == location.z + abilityRange) {

							animateTileVisibility(tile, 30, 0.4);
						}
					}
					break;
				case 2:
					// Three tiles away from unit.
					// if(tile.position.x == location.x + abilityRange) {
					// 	if(tile.position.z == location.z)
					// 	{
					// 		//animateTileColor(tile, 30, new BABYLON.Color3(0.5, 0.5,0));
					// 		animateTileVisibility(tile, 30, 0.5);
					// 	}

					// }
					if( !(location.x == tile.position.x && location.z == tile.position.z) && Math.sqrt(Math.pow(location.x - tile.position.x, 2) + Math.pow(location.z - tile.position.z, 2)) <= Math.sqrt(2 * Math.pow(abilityRange, 2)) ) {										
						animateTileVisibility(tile, 30, 0.5);
					}
					break;
				case 3: 
					if( !(location.x == tile.position.x && location.z == tile.position.z) && Math.sqrt(Math.pow(location.x - tile.position.x, 2) + Math.pow(location.z - tile.position.z, 2)) <= Math.sqrt(2 * Math.pow(abilityRange, 2)) ) {										
						animateTileVisibility(tile, 30, 0.5);
					}
					break;
				case 4:
					// Whole grid.
					if(!(location.x == tile.position.x && location.z == tile.position.z))
						animateTileVisibility(tile, 30, 0.4);
					break;
			}
		});
	}

	// Animate the visibility of tile(s).
	function animateTileVisibility(tile, endFrame, targetVisibility) {

		var animationTile = new BABYLON.Animation("tileAnimation", "visibility", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		var keys = [];
		keys.push({
			frame: 0,
			value: tile.visibility
		});
		keys.push({
			frame: endFrame,
			value: targetVisibility
		});
		animationTile.setKeys(keys);
		tile.animations.push(animationTile);
		scene.beginAnimation(tile, 0, endFrame, true);
	}

	// Animate the color of a tile -- *!*NOTE: doesn't work as of now, since changes to the used material apply to ALL tiles using the same material.*!*
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

	function checkInitiative(unit) {
	console('inside');
	if(tick % unit.initiative == 0) 
		return true;
	else
		return false;
	}

	// Telegraph dangerous tile from enemy melee unit's special attack.
	function addDangerTile(tile) {
		
		var dangerousTile = BABYLON.Mesh.CreatePlane('dangerousTile', tileSize, scene);
		dangerousTile.position = new BABYLON.Vector3(tile.position.x, .01, tile.position.z);
		dangerousTile.visibility = 0.4;	
		dangerousTile.rotation.x = Math.PI / 2;
		dangerousTile.ticksToExplode = 1;
		dangerousTile.damage = 50;

		var material = new BABYLON.StandardMaterial("dangerousMaterial", scene);
		material.emissiveColor = new BABYLON.Color3(1, 0, 0);
		dangerousTile.material = material;		
		
		animateTileVisibility(dangerousTile, 45, 0.1);
	}
	
};

document.addEventListener("DOMContentLoaded", function () {
	new Game('renderCanvas');
}, false);
