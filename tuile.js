
tuiles = {};

class Tuile {
	
	constructor(zone, specialisation, x, y) {
		this.setPos(x, y);
		this.zone = zone || null;
		this.specialisation = specialisation || null;
		this.proprietaire = null;
	}
	
	setPos(x, y) {
		this.x = Number.isInteger(x) ? x : null;
		this.y = Number.isInteger(y) ? y : null;
		tuiles[`${x}/${y}`] = this;
	}
	static getTuile(x, y) {
		return tuiles[`${x}/${y}`];
	}
	
}