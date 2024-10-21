
let CONF = {
	foret: {
		NB_TUILE: 44,
		NB_TUILE_TRANSITION: {
			toundra: 2,
			savane: 2,
			jungle: 2,
			lac: 3,
		},
		NB_TUILE_SPECIALISE: {
			village1: 1,
			village2: 1,
			ressource_f1: 3,
			ressource_f2: 3,
			ressource_f3: 3,
			ressource_f4: 2,
			ressource_f5: 2,
			ressource_f7: 1,
			montagne: 3,
		},
	},
	toundra: {
		NB_TUILE: 44,
		NB_TUILE_TRANSITION: {
			foret: 2,
			savane: 2,
			artique: 2,
			lac: 3,
		},
		NB_TUILE_SPECIALISE: {
			village1: 1,
			village2: 1,
			ressource_t1: 3,
			ressource_t2: 3,
			ressource_t3: 3,
			ressource_t4: 2,
			ressource_t5: 2,
			ressource_t7: 1,
			montagne: 3,
		},
	},
	savane: {
		NB_TUILE: 44,
		NB_TUILE_TRANSITION: {
			toundra: 2,
			foret: 2,
			desert: 2,
			lac: 3,
		},
		NB_TUILE_SPECIALISE: {
			village1: 1,
			village2: 1,
			ressource_s1: 3,
			ressource_s2: 3,
			ressource_s3: 3,
			ressource_s4: 2,
			ressource_s5: 2,
			ressource_s7: 1,
			montagne: 3,
		},
	},
	artique: {
		NB_TUILE: 22,
		NB_TUILE_TRANSITION: {
			lac: 1,
		},
		NB_TUILE_SPECIALISE: {
			ressource_t1: 1,
			ressource_t2: 1,
			ressource_t3: 1,
			ressource_t4: 1,
			ressource_t5: 1,
			ressource_t6: 3,
			ressource_t8: 1,
			montagne: 1,
			village3: 1,
		},
	},
	jungle: {
		NB_TUILE: 22,
		NB_TUILE_TRANSITION: {
			lac: 1,
		},
		NB_TUILE_SPECIALISE: {
			ressource_f1: 1,
			ressource_f2: 1,
			ressource_f3: 1,
			ressource_f4: 1,
			ressource_f5: 1,
			ressource_f6: 3,
			ressource_f8: 1,
			montagne: 1,
			village3: 1,
		},
	},
	desert: {
		NB_TUILE: 22,
		NB_TUILE_TRANSITION: {
			lac: 1,
		},
		NB_TUILE_SPECIALISE: {
			ressource_s1: 1,
			ressource_s2: 1,
			ressource_s3: 1,
			ressource_s4: 1,
			ressource_s5: 1,
			ressource_s6: 3,
			ressource_s8: 1,
			montagne: 1,
			village3: 1,
		},
	},
};
	
class Reserve {
    
	constructor() {
		
		this.reserves = Object
			.keys(CONF)
			.reduce((acc, key) => {
				acc[key] = [];
				return acc;
			}, {});
		
		Object.keys(this.reserves)
			.forEach(this.genReserve.bind(this));
		Object.keys(this.reserves)
			.forEach(this.shuffle.bind(this));
	}
	
	genReserve(zone) {
		let conf = CONF[zone];
		let reserve = []
		Object.keys(conf.NB_TUILE_TRANSITION)
			.forEach((transition) => {
				let nbIteration = conf.NB_TUILE_TRANSITION[transition];
				for (let i = 0; i < nbIteration; i++) {
					reserve.push(new Tuile(transition));
				}
			});
		Object.keys(conf.NB_TUILE_SPECIALISE)
			.forEach((specialisation) => {
				let nbIteration = conf.NB_TUILE_SPECIALISE[specialisation];
				for (let i = 0; i < nbIteration; i++) {
					reserve.push(new Tuile(zone, specialisation));
				}
			});
			
		let nbIteration = conf.NB_TUILE - reserve.length;
		for (let i = 0; i < nbIteration; i++) {
			reserve.push(new Tuile(zone));
		}
		
		this.reserves[zone] = reserve;
	}
	
	shuffle(zone) {
		for (let i = this.reserves[zone].length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.reserves[zone][i], this.reserves[zone][j]] = [this.reserves[zone][j], this.reserves[zone][i]];
		}
		return this.reserves[zone];
	}
	
	poseTuile(zone, x, y) {
		let newTuile = this.getTuile(zone)
		if (!newTuile) return null;
		newTuile.setPos(x, y);
		return newTuile;
	}
	getTuile(zone) {
		return this.reserves[zone].pop();
	}
    
}