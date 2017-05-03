Preloader = function(folder, scene) {

	this.folder = folder;

	this.scene = scene;
	this.game = game;
	this.progress = 0;
	this.fileToLoad = [];
	this.fileLoaded = [];
	this.fileLoadedSuccess = 0;
	this.fileLoadedError = [];
	this.isLoading = false;
}