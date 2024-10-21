
const transformationAdjacent = [
	{x:-1,y:-1},
	{x: 0,y:-1},
	{x:+1,y: 0},
	{x:+1,y:+1},
	{x: 0,y:+1},
	{x:-1,y: 0},
];
const transformationAdjacentN2 = [
	{x:-2,y:-2},
	{x:-1,y:-2},
	{x: 0,y:-2},
	{x:+1,y:-1},
	{x:+2,y: 0},
	{x:+2,y:+1},
	{x:+2,y:+2},
	{x:+1,y:+2},
	{x: 0,y:+2},
	{x:-1,y:+1},
	{x:-2,y: 0},
	{x:-2,y:-1},
];

class Dizolo {
    
	constructor(domSvg) {
		this.tuileDrawer = new TuileDrawer(domSvg);
		this.reserve = new Reserve(domSvg);

		// console.log('passent ici : ', this.nbPlayer);
		// while(!Number.isInteger(this.nbPlayer) && this.nbPlayer < 5 && this.nbPlayer > 0) {
		// 	console.log('passent ici : ', this.nbPlayer);
		// 	this.nbPlayer = parseInt(prompt("quelle est votre nombres de joueur ? :", "2, 3, ..."));
		// }
		this.nbPlayer = 2;
		this.players = Array.apply(null, {length: this.nbPlayer}).map((v, i) => new Player(`j${i+1}`));
		this.currentPlayer = this.players.shift();
		this.majCurrentPlayerButton();
		
		this.tuileDrawer.drawTuiles([
			// new Tuile('lac' ,null,19 ,9),
			// new Tuile('foret' ,null,18 ,8),
			// new Tuile('toundra' ,null,19 ,8),
			// new Tuile('foret' ,null,18 ,9),
			// new Tuile('toundra' ,null,20 ,9),
			// new Tuile('savane',null,19,10),
			// new Tuile('savane',null,20,10),
			
			new Tuile('lac',null,19,9),
			new Tuile('lac',null,18,8),
			new Tuile('lac',null,19,8),
			new Tuile('lac',null,18,9),
			new Tuile('lac',null,20,9),
			new Tuile('lac',null,19,10),
			new Tuile('lac',null,20,10),
			new Tuile('toundra',null,17,7),
			new Tuile('toundra',null,18,7),
			new Tuile('foret',null,19,7),
			new Tuile('foret',null,20,8),
			new Tuile('savane',null,21,9),
			new Tuile('savane',null,21,10),
			new Tuile('toundra',null,21,11),
			new Tuile('toundra',null,20,11),
			new Tuile('foret',null,19,11),
			new Tuile('foret',null,18,10),
			new Tuile('savane',null,17,9),
			new Tuile('savane',null,17,8),
		]);
		
		this.tuileDrawer.onClickTuile(this.onClickTuile.bind(this));
		this.tuileDrawer.onClickTuileWithMaj(this.onClickTuileWithMaj.bind(this));

		document.getElementById('current-player').addEventListener('click', () => this.onClickCurrentPlayer.bind(this)());
		document.addEventListener('keypress', (event) => (event.keyCode == 13 || event.keyCode == 0 || event.keyCode == 32) ? this.onClickCurrentPlayer.bind(this)() : null);
	}
	
	onClickCurrentPlayer() {
		console.log('on click Current Player ... ')
		// if (this.currentPlayer.position === this.currentPlayer.lastPosition) return;
		// change de joueur
		this.players.push(this.currentPlayer);
		this.currentPlayer = this.players.shift();
		// maj du boutton
		this.majCurrentPlayerButton();
		// affiche les cases autour du joueur courant
		if (this.currentPlayer.position !== null) {
			transformationAdjacent.forEach(this.decouvreByTransformation(this.currentPlayer.position));
			if (this.currentPlayer.position.specialisation === 'montagne') {
				transformationAdjacentN2.forEach(this.decouvreByTransformation(this.currentPlayer.position));
			};
			this.currentPlayer.lastPosition = this.currentPlayer.position;
		}
	}
	onClickTuile(tuile) {
		console.log('on click ... ', tuile)
		if (tuile.zone === 'lac') return null;
		// gestion meeple
		this.tuileDrawer.drawMeeple(this.currentPlayer, tuile);
		// maj la position du joueur
		this.currentPlayer.position = tuile;
	}
	onClickTuileWithMaj(tuile) {
		console.log('on click with maj ... ', tuile)

		if (tuile.proprietaire === null) {
			tuile.proprietaire = this.currentPlayer;
		} else {
			tuile.proprietaire = null;
		}

		// affichage de tuile meeple
		this.tuileDrawer.updateDrawTuiles();
	}
	decouvreByTransformation(tuile, reserve) {
		return (transformation) => {
			let adjX = tuile.x + transformation.x;
			let adjY = tuile.y + transformation.y;
			if (isHorsBorne(adjX, adjY)) return;
			let adjTuile = Tuile.getTuile(adjX, adjY);
			if (adjTuile == null) {
				let newTuile = this.reserve.poseTuile(tuile.zone, adjX, adjY);
				if (newTuile) {
					this.tuileDrawer.drawTuile(newTuile);
				}
			}
		}
	}
	majCurrentPlayerButton() {
		document.getElementById('current-player').innerHTML = this.currentPlayer.name;
		document.getElementById('current-player').style = `background-color: ${MEEPLE_COLOR[this.currentPlayer.name]}; color: white`
	}
}

function isHorsBorne(adjX, adjY) {
	// if (adjX < 10) return true;
	if (adjY < 0) return true;
	// if (adjX - adjY > 18) return true;
	return false
}