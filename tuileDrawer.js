
// object hexa :
// {
//   x: INT
//   y: INT
//   type: STRING ['foret','plaine','dessert']
// }

// disposition :
// 
//   H(0,0)    H(1,0)
//        H(1,1)
//   H(1,2)    H(2,2)
// 

//constante
const TUILE_HEIGHT = 50;
const TUILE_WIDTH = TUILE_HEIGHT * Math.sin(Math.PI / 3);
const TUILE_HORIZONTAL_SPACING = TUILE_WIDTH;
const TUILE_HEIGHT_VERTICAL_SPACING_COMMUN = (TUILE_WIDTH / 2) / Math.tan(Math.PI / 3);
const TUILE_VERTICAL_SPACING = TUILE_HEIGHT - TUILE_HEIGHT_VERTICAL_SPACING_COMMUN;
const TUILE_COTE_SIZE = TUILE_VERTICAL_SPACING * 2 - TUILE_HEIGHT;

const TUILE_RSR_SIZE = 20;

const COLOR_BY_ZONE = {
	foret: '#86ab31',
	toundra: '#d3f52a',
	savane: '#ffad2a',
	jungle: '#325e21',
	artique: '#e7e7eb',
	desert: '#feeca9',
	lac: '#6cbbdd',
	default: 'black',
};
const MOTIF_BY_SPE = {
	montagne: drawMontagne,
	village1: drawVillagefn('green'),
	village2: drawVillagefn('orange'),
	village3: drawVillagefn('purple'),
	marchand: drawMarchand,
	blessee: drawBlessee,
	ressource_f1: drawRessourcefn(drawSrcCercle, 'crimson'),
	ressource_f2: drawRessourcefn(drawSrcCercle, 'yellow'),
	ressource_f3: drawRessourcefn(drawSrcCercle, 'dodgerblue'),
	ressource_f4: drawRessourcefn(drawSrcTriangle, 'green'),
	ressource_f5: drawRessourcefn(drawSrcCarre, 'orange'),
	ressource_f6: drawRessourcefn(drawSrcEtoile, 'purple'),
	ressource_f7: drawRessourcefn(drawSrcEtoile, 'lightgray'),
	ressource_f8: drawRessourcefn(drawSrcCercle, 'black'),
	ressource_t1: drawRessourcefn(drawSrcCarre, 'crimson'),
	ressource_t2: drawRessourcefn(drawSrcCarre, 'yellow'),
	ressource_t3: drawRessourcefn(drawSrcCarre, 'dodgerblue'),
	ressource_t4: drawRessourcefn(drawSrcCercle, 'green'),
	ressource_t5: drawRessourcefn(drawSrcTriangle, 'orange'),
	ressource_t6: drawRessourcefn(drawSrcEtoile, 'purple'),
	ressource_t7: drawRessourcefn(drawSrcEtoile, 'lightgray'),
	ressource_t8: drawRessourcefn(drawSrcCarre, 'black'),
	ressource_s1: drawRessourcefn(drawSrcTriangle, 'crimson'),
	ressource_s2: drawRessourcefn(drawSrcTriangle, 'yellow'),
	ressource_s3: drawRessourcefn(drawSrcTriangle, 'dodgerblue'),
	ressource_s4: drawRessourcefn(drawSrcCarre, 'green'),
	ressource_s5: drawRessourcefn(drawSrcCercle, 'orange'),
	ressource_s6: drawRessourcefn(drawSrcEtoile, 'purple'),
	ressource_s7: drawRessourcefn(drawSrcEtoile, 'lightgray'),
	ressource_s8: drawRessourcefn(drawSrcTriangle, 'black'),
}
const MEEPLE_PATH = `${TUILE_HEIGHT/2}`
	
class TuileDrawer {
    
	constructor(plateau){
		this.tuilePoints = `0,${-TUILE_HEIGHT/2} ${TUILE_WIDTH/2},${-TUILE_HEIGHT/4} ${TUILE_WIDTH/2},${TUILE_HEIGHT/4} 0,${TUILE_HEIGHT/2} ${-TUILE_WIDTH/2},${TUILE_HEIGHT/4} ${-TUILE_WIDTH/2},${-TUILE_HEIGHT/4}`;
		
		this.listennerClickTuile = [];
		this.listennerClickTuileWithMaj = [];
		
		this.plateauD3 = d3.select(plateau);
		this.tuilesD3 = this.plateauD3.append('g')
			.classed('tuiles', true);
		this.meeplesD3 = this.plateauD3.append('g')
			.classed('meeples', true);
		this.plateauWidth = plateau.offsetWidth || plateau.width.animVal.value;
		this.plateauHeight = plateau.offsetHeight || plateau.height.animVal.value;
	}
	
    drawTuile(tuile) {
        return this.drawTuiles([tuile])[0];
    }
    drawTuiles(tuiles) {
        let selectDataTuiles = this.tuilesD3.selectAll('.tuile')
            .data(tuiles, (tuile) => tuile.x+'/'+tuile.y);
            
        let selectNewTuile = selectDataTuiles.enter()
            .append('g')
            .classed('tuile', true)
            .attr('transform', getTransform)
			.on('click', (tuile) => this.emitClickTuile(tuile));
            
        selectNewTuile.append('polygon')
			.classed('tuile-terrain', true)
			.attr('points', this.tuilePoints)
			.attr('fill', getColor);

		selectNewTuile.append('polygon')
			.classed('tuile-influence', true)
            .attr('points', this.tuilePoints)
			.attr('fill', 'none')
			// .attr('stroke-dasharray', '8,8')
			.attr('stroke-width', '5')
            .attr('stroke', getInfluenceColor);
		
		selectNewTuile.each(function (tuile) {
			if (!tuile.specialisation) return;
			if (!MOTIF_BY_SPE[tuile.specialisation]) return;
			MOTIF_BY_SPE[tuile.specialisation](d3.select(this));
		});
            
        return selectNewTuile;
	}
	
    updateDrawTuiles() {
        const tuile3Ds = this.tuilesD3.selectAll('.tuile');
            
        tuile3Ds.select('.tuile-influence')
			.attr('stroke', getInfluenceColor);
	}
	
	drawMeeple(meepleId, tuile) {
		console.log('drawMeeple => meepleId : ', meepleId);
		let meepleD3 = this.meeplesD3.select(`#meeple${meepleId.name}`);
		if (!meepleD3.size()) {
			meepleD3 = this.meeplesD3.append('circle')
				.attr('id', `meeple${meepleId.name}`)
				.attr('fill', MEEPLE_COLOR[meepleId.name])
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', TUILE_HEIGHT/4);
		}
		meepleD3.attr('transform', getTransform(tuile));
	}
	
    onClickTuile(fun) {
		this.listennerClickTuile.push(fun);
    }
    onClickTuileWithMaj(fun) {
		this.listennerClickTuileWithMaj.push(fun);
    }
    emitClickTuile(tuile) {
		console.log("d3.event : ", d3.event);
		if (d3.event.ctrlKey) {
			this.listennerClickTuileWithMaj.forEach((fun) => fun(tuile));
		} else {
			this.listennerClickTuile.forEach((fun) => fun(tuile));
		}
    }
    
}

// accessor
function getColor(tuile) {
	return COLOR_BY_ZONE[tuile.zone] || COLOR_BY_ZONE.default;
}
function getInfluenceColor(tuile) {
	if (tuile.proprietaire === null) return 'none';
	return MEEPLE_COLOR[tuile.proprietaire.name];
}
function getTransform(tuile) {
	let x = TUILE_WIDTH / 2 + tuile.x * TUILE_HORIZONTAL_SPACING - tuile.y * TUILE_HORIZONTAL_SPACING / 2;
	let y = TUILE_HEIGHT / 2 + tuile.y * TUILE_VERTICAL_SPACING;
	return `translate(${x}, ${y})`;
}

// motifDrawer
function drawMontagne(tuileD3) {
	tuileD3.append('polygon')
		.attr('points', `${-TUILE_WIDTH*2/6},${TUILE_HEIGHT*1/6} ${TUILE_WIDTH*2/6},${TUILE_HEIGHT*1/6} 0,${-TUILE_HEIGHT*3/8}`)
		.attr('fill', 'grey');
}

function drawVillagefn(couleur) {
	return function drawVillage(tuileD3) {
		
		// EP pour epaisseur
		const EP_ROUTE = 2;
		const EP_TROTOIRE = 1;
		
		tuileD3.append('polygon')
			.attr('points', `${-EP_ROUTE},${-TUILE_HEIGHT*3/8} ${-EP_ROUTE},${+TUILE_HEIGHT*3/8} 0,${+TUILE_HEIGHT*3/8} 0,0 ${TUILE_WIDTH*2/6},0 ${TUILE_WIDTH*2/6},${-EP_ROUTE} 0,${-EP_ROUTE} 0,${-TUILE_HEIGHT*3/8}`)
			.attr('fill', 'chocolate');
			
		tuileD3.append('polygon')
			.attr('points', `${EP_TROTOIRE},${-EP_TROTOIRE-EP_ROUTE} ${EP_TROTOIRE},${-TUILE_HEIGHT*2/8} ${TUILE_WIDTH*1/6},${-TUILE_HEIGHT*2/8} ${TUILE_WIDTH*1/6},${-EP_TROTOIRE-EP_ROUTE}`)
			.attr('fill', 'goldenrod');
			
		tuileD3.append('polygon')
			.attr('points', `${EP_TROTOIRE},${EP_TROTOIRE} ${EP_TROTOIRE},${TUILE_HEIGHT*1/8} ${TUILE_WIDTH*1/6},${TUILE_HEIGHT*1/8} ${TUILE_WIDTH*1/6},${EP_TROTOIRE}`)
			.attr('fill', 'goldenrod');
			
		tuileD3.append('polygon')
			.attr('points', `${-EP_TROTOIRE-EP_ROUTE},${-TUILE_HEIGHT*1/8} ${-EP_TROTOIRE-EP_ROUTE},${TUILE_HEIGHT*1/8} ${-TUILE_WIDTH*2/6},${TUILE_HEIGHT*1/8} ${-TUILE_WIDTH*2/6},${-TUILE_HEIGHT*1/8}`)
			.attr('fill', couleur);
			
		tuileD3.append('polygon')
			.attr('points', `${-EP_TROTOIRE-EP_ROUTE},${-TUILE_HEIGHT*2/8} ${-EP_TROTOIRE-EP_ROUTE},${-TUILE_HEIGHT*1/8-EP_TROTOIRE} ${-TUILE_WIDTH*1/6},${-TUILE_HEIGHT*1/8-EP_TROTOIRE} ${-TUILE_WIDTH*1/6},${-TUILE_HEIGHT*2/8}`)
			.attr('fill', 'goldenrod');
			
		tuileD3.append('polygon')
			.attr('points', `${-EP_TROTOIRE-EP_ROUTE},${TUILE_HEIGHT*2/8} ${-EP_TROTOIRE-EP_ROUTE},${TUILE_HEIGHT*1/8+EP_TROTOIRE} ${-TUILE_WIDTH*1/6},${TUILE_HEIGHT*1/8+EP_TROTOIRE} ${-TUILE_WIDTH*1/6},${TUILE_HEIGHT*2/8}`)
			.attr('fill', 'goldenrod');
	}
}
function drawRessourcefn(drawerForm, color) {
	const ratio = 5/8;
	const transform = `translate(${-TUILE_COTE_SIZE/2*ratio}, ${-TUILE_COTE_SIZE/2*ratio})`;
	// const transform = `translate(0, 0)`;
	
	return (tuileD3) => {
		let ressourceD3 = tuileD3.append('g')
			.attr('transform', transform);
		ressourceD3.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('r', TUILE_RSR_SIZE/2)
			.attr('fill', 'white');
		
		if (!drawerForm) return;
		
		drawerForm(ressourceD3)
			.attr('fill', color);
	}
}

// dessinateur de figure
function drawSrcCarre(srcD3) {
	let ratio = 1/2;
	return srcD3.append('rect')
		.attr('x', -TUILE_RSR_SIZE/2*ratio)
		.attr('y', -TUILE_RSR_SIZE/2*ratio)
		.attr('height', TUILE_RSR_SIZE*ratio)
		.attr('width', TUILE_RSR_SIZE*ratio)
}
function drawSrcEtoile(srcD3) {
	let ratio = 3/4;
	let x1 = 0;
	let y1 = -TUILE_RSR_SIZE/2*ratio;
	let x1c = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.618*ratio;
	let y1c = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.382*ratio;
	let x2 = TUILE_RSR_SIZE/2*ratio;
	let y2 = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.382*ratio;
	let x2c = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.691*ratio;
	let y2c = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.618*ratio;
	let x3 = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.809*ratio;
	let y3 = TUILE_RSR_SIZE/2*ratio;
	let x3c = 0;
	let y3c = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.764*ratio;
	let x4 = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.191*ratio;
	let y4 = TUILE_RSR_SIZE/2*ratio;
	let x4c = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.309*ratio;
	let y4c = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.618*ratio;
	let x5 = -TUILE_RSR_SIZE/2*ratio;
	let y5 = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.382*ratio;
	let x5c = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.382*ratio;
	let y5c = -TUILE_RSR_SIZE/2*ratio + TUILE_RSR_SIZE*0.382*ratio;
	
	return srcD3.append('polygon')
		.attr('points', `${x1},${y1} ${x1c},${y1c} ${x2},${y2} ${x2c},${y2c} ${x3},${y3} ${x3c},${y3c} ${x4},${y4} ${x4c},${y4c} ${x5},${y5} ${x5c},${y5c}`);
}
function drawSrcCercle(srcD3) {
	let ratio = 2/3;
	return srcD3.append('circle')
		.attr('cx', 0)
		.attr('cy', 0)
		.attr('r', TUILE_RSR_SIZE/2*ratio)
}
function drawSrcTriangle(srcD3) {
	let ratio = 2/3;
	let hypotenus = TUILE_RSR_SIZE/2*ratio;
	let coteAdjacent = Math.cos(Math.PI/6) * hypotenus;
	let coteOppose = Math.sin(Math.PI/6) * hypotenus;
	
	return srcD3.append('polygon')
		.attr('points', `0,${-hypotenus} ${coteAdjacent},${coteOppose} ${-coteAdjacent},${coteOppose}`);
}

// dessinateur d'evenement
function drawMarchand(tuileD3) {

	let marchandD3 = tuileD3.append('g');
	
	let marge = 2;
	let pieceSize = 2;

	marchandD3.append('circle')
		.attr('cx', TUILE_WIDTH*1/8)
		.attr('cy', -TUILE_HEIGHT*1/6)
		.attr('r', TUILE_WIDTH*1/8)
		
	marchandD3.append('polygon')
		.attr('points', `${TUILE_WIDTH*1/8},${-TUILE_HEIGHT*1/6} ${TUILE_WIDTH*1/8},${-TUILE_HEIGHT*1/6+TUILE_WIDTH*1/8+marge}  0,${-TUILE_HEIGHT*1/15} `);
		
	marchandD3.append('circle')
		.attr('cx', 0)
		.attr('cy', 0)
		.attr('r', pieceSize)
	marchandD3.append('circle')
		.attr('cx', 2)
		.attr('cy', 3)
		.attr('r', pieceSize)
	marchandD3.append('circle')
		.attr('cx', -2)
		.attr('cy', 6)
		.attr('r', pieceSize)
	marchandD3.append('circle')
		.attr('cx', -8)
		.attr('cy', 4)
		.attr('r', pieceSize)
}

function drawBlessee(tuileD3) {
	let blesseeD3 = tuileD3.append('g');

	blesseeD3.append('path')
		.attr('d', `M ${-TUILE_WIDTH*1/4} 0 L${-TUILE_WIDTH*1/8} 0 L${-TUILE_WIDTH*1/9} ${-TUILE_HEIGHT*1/8} L0 ${TUILE_HEIGHT*1/3} L${TUILE_WIDTH*1/12} ${-TUILE_HEIGHT*1/4} L${TUILE_WIDTH*1/8} 0 L${TUILE_WIDTH*1/4} 0`)
		.attr('fill',  'none')
		.attr('stroke',  'black')
		.attr('stroke-width', 1)
		.attr('stroke-linejoin',  'round');
}
