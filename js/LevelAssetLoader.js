// Class LevelAssetLoader: Loads Assets for given leveltype
// Example: var levelassets = new LevelAssetLoader(scene, manager, "mountains");
class LevelAssetLoader {
    // Constructor: Initializes members, loads assets
    constructor(scene, manager, type) {

        // The assets-Object where all assets are saved
        this.assets = {
            backgrounds: [],
            tiles: {
                base: [],
                debris: []
            }
        };

        // Save leveltype
        this.leveltype = type;

        // Load Tiles and Backgrounds
        this.loadTiles(scene, manager);
       // this.loadBackgrounds(scene, manager);
    }

    // Getter & Setter
    // TODO: If setter for leveltype is available, reloading all assets
    // should be done
    // get assets(){ return this.assets; }
    // get leveltype(){ return leveltype; }
    // set leveltype(type){ this.leveltype = type; }

    // loadTiles(): Method for loading all Tiles (Base & Debris) for
    // corresponding leveltype
    loadTiles(scene, manager) {
        // task is for the while-condition, count for (file-)name-generation
       // var task, count = 0;
        var count = 0;
        var condition = true;
        // while opening works
        // TODO: Does the condition works like this?
        // while(task = manager.addTextureTask("image task", "assets/levels/" + this.leveltype + "/tiles/base/" + count + ".png") != undefined) {
        //     console.log('lul');
        //     // push Material-Objects in assets-Array
        //     this.assets.tiles.base.push(new BABYLON.StandardMaterial(this.leveltype + "Base" + count, scene));
        //     // If file is loaded, link texture - does this work?
        //     // Maybe the state of loading is undefined when checked by while
        //     task.onSuccess = function(loaded) {
        // 		this.assets.tiles.base[count].emissiveTexture = loaded.texture;
        //     }
        //     // count up - Maybe only on success? Loop could be endless either
        //     // way
        //     count++;
        // }

        while(condition) {
            var textureTask = manager.addTextureTask("image task", "assets/levels/" + this.leveltype + "/tiles/base/" + count + ".png");
            console.log('lul');
            // push Material-Objects in assets-Array
            this.assets.tiles.base.push(new BABYLON.StandardMaterial(this.leveltype + "Base" + count, scene));
            // If file is loaded, link texture - does this work?
            // Maybe the state of loading is undefined when checked by while
            textureTask.onSuccess = function(loaded) {
                console.log('onSuccess');
                this.assets.tiles.base[count].emissiveTexture = loaded.texture;
            }
            textureTask.onError = function(loaded) {
                console.log('onError');
                condition = false;
            }
            // count up - Maybe only on success? Loop could be endless either
            // way
            if(this.assets.tiles.base[count] == undefined) 
                condition = false;
            count++;
        }

        // Reset count, same procedure as above, this time for debris
        // count = 0;
        // while(task = manager.addTextureTask("image task", "assets/levels/" + this.leveltype + "/tiles/debris/" + count + ".png")) {

        //     this.assets.tiles.debris.push(new BABYLON.StandardMaterial(this.leveltype + "Debris" + count, scene));
        //     task.onSuccess = function(loaded) {
        // 		this.assets.tiles.debris[count].emissiveTexture = loaded.texture;
        //     }
        //     count++;
        // }
    }

    // LevelAssetLoader could (and should?) load Backgrounds aswell
    //loadBackgrounds(scene, manager) {}
    //}
}
