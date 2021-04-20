import * as THREE from './build/three.module.js';

import Stats from './examples/jsm/libs/stats.module.js';
import { GUI } from './examples/jsm/libs/dat.gui.module.js';

import { GLTFLoader } from './examples/jsm/loaders/GLTFLoader.js';

let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, model, face;
let flipJoker=false
let flipDiamond=false
let flipClub=false
let countFlipJoker=0
let countFlipDiamond=0
let countFlipClub=0

var cards
var diamond, club, joker


var step = 100;
var switchCardsAction = [];
var switchCardsSpeed = [];
var cardsToSwitch;
var accumframe = 0;
var waitframe = 10;

const pos_right = new THREE.Vector3( 1, 1.8, 3)
const pos_left = new THREE.Vector3( -1, 1.8, 3)
const pos_mid = new THREE.Vector3( 0, 1.8, 3)

const pos_list = [pos_left,pos_mid,pos_right]

const api = { state: 'Walking' };


$('.round, .round-bg').click(async function (e) {

    await sleep(8000);
    flipAllCards();
    fadeToAction('Sitting',0.5)

    // read the game mechanism
    step = switchCardsSpeed[round]
    console.log("current speed is ", step)

    cardsToSwitch = switchCardsAction[round]
    console.log("current switch order is ", cardsToSwitch)

    // update the index of round
    round += 1;
});

$(".card").click(function(){
    if (userSelectionState){
        flipAllCards();
        userSelectionState = false;}
})

init();
animate();
function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}

function init() {
    // read game mechanism from game.js

    for (var i = 0; i < gameMech.length; i++) {
        var switch_actions = []
        for  (var j = 0; j < gameMech[i].order.length; j++) {
            switch_actions.push(gameMech[i].order[j])
        }
        switchCardsSpeed.push(gameMech[i].step)
        switchCardsAction.push(switch_actions)
    }

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
    camera.position.set( 0, 5, 10 );
    camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe0e0e0 );
    scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

    clock = new THREE.Clock();

    // lights
    var ambientLight = new THREE.AmbientLight(0x090909);
    scene.add(ambientLight);

    // Spotlight for specific illumination
    var spotLight = new THREE.SpotLight(0xAAAAAA);
    spotLight.position.set(2, 5, 4);
    spotLight.castShadow = true;
    spotLight.shadowBias = 0.0001;
    spotLight.shadowDarkness = 0.2;
    spotLight.shadowMapWidth = 2048; // Shadow Quality
    spotLight.shadowMapHeight = 2048; // Shadow Quality
    scene.add(spotLight);

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );

    // ground

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    scene.add( mesh );

    // desk in front of robot
    createDesk();

    // cards on the table
    cards = createCard();

    // model

    const loader = new GLTFLoader();
    loader.load( './examples/models/gltf/RobotExpressive/RobotExpressive.glb', function ( gltf ) {

        model = gltf.scene;
        scene.add( model );
        createGUI( model, gltf.animations );

        // mixer = new THREE.AnimationMixer( model );

    }, undefined, function ( e ) {

        console.error( e );

} );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

    //test flip card
    document.addEventListener('keydown', function(event) {
        if (event.code === 'KeyA') {
          fadeToAction( 'ThumbsUp', 0.2 );
        }
        if (event.code === 'KeyR') {
            fadeToAction('Running',0.5)
        }
        if (event.code === 'KeyT') {
            fadeToAction('Idle',0.5)
        }
        if (event.code === 'KeyY') {
            fadeToAction('Dance',0.5)
        }
        if (event.code === 'KeyU') {
            fadeToAction('Death',0.5)
        }
});
}

function createGUI( model, animations ) {

				const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
				const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];

				// gui = new GUI();

				mixer = new THREE.AnimationMixer( model );
				// mixer.addEventListener( 'finished', restoreState );

				actions = {};

				for ( let i = 0; i < animations.length; i ++ ) {

					const clip = animations[ i ];
					const action = mixer.clipAction( clip );
					actions[ clip.name ] = action;

					if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {

						action.clampWhenFinished = true;
						action.loop = THREE.LoopOnce;
					}
				}

				// states

				// const statesFolder = gui.addFolder( 'States' );
                //
				// const clipCtrl = statesFolder.add( api, 'state' ).options( states );
                //
				// clipCtrl.onChange( function () {
				// 	fadeToAction( api.state, 0.5 );
				// } );
                //
				// statesFolder.open();

				// emotes

				// const emoteFolder = gui.addFolder( 'Emotes' );

				function createEmoteCallback( name ) {

					api[ name ] = function () {

						fadeToAction( name, 0.2 );

						mixer.addEventListener( 'finished', restoreState );

					};

					emoteFolder.add( api, name );

				}

				function restoreState() {

					mixer.removeEventListener( 'finished', restoreState );

					fadeToAction( 'Idle', 0.2 );

				}

				for ( let i = 0; i < emotes.length; i ++ ) {

					createEmoteCallback( emotes[ i ] );

				}

				// emoteFolder.open();

				// expressions

				face = model.getObjectByName( 'Head_4' );

				const expressions = Object.keys( face.morphTargetDictionary );
				const expressionFolder = gui.addFolder( 'Expressions' );

				for ( let i = 0; i < expressions.length; i ++ ) {
					expressionFolder.add( face.morphTargetInfluences, i, 0, 1, 0.01 ).name( expressions[ i ] );

				}
				activeAction = actions[ 'Walking' ];
				activeAction.play();

				expressionFolder.open();

			}

function fadeToAction( name, duration ) {

    if (!activeAction){
        console.log(activeAction);
        previousAction = actions[ name ];
    }else{
        previousAction = activeAction;
    }
    activeAction = actions[ name ];

    if ( previousAction !== activeAction ) {

        previousAction.fadeOut( duration );

    }

    activeAction
        .reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( duration )
        .play();

}


function createDesk(){
    const table_surface = new THREE.BoxGeometry( 10, 0.5, 2 );
    var material = new THREE.MeshPhongMaterial({ // Required For Shadows
                        color: 0xecebec,
                        specular: 0x000000,
                        shininess: 100,
                        transparent: true,
                        opacity:0.9
                        });
    const cube1 = new THREE.Mesh( table_surface, material );
    cube1.receiveShadow = true;
    cube1.position.set(0, 1.5, 3);
    scene.add( cube1 );

    const table_leg1 = new THREE.BoxGeometry( 0.5, 1.5, 2 );
    const cube2 = new THREE.Mesh( table_leg1, material );
    cube2.receiveShadow = true;
    cube2.position.set(4.75, 0.5, 3);
    scene.add( cube2 );

    const table_leg2 = new THREE.BoxGeometry( 0.5, 1.5, 2 );
    const cube3 = new THREE.Mesh( table_leg1, material );
    cube3.receiveShadow = true;
    cube3.position.set(-4.75, 0.5, 3);
    scene.add( cube3 );
}

function createCard(){
      const boxWidth = 0.8;
      const boxHeight = 0.01;
      const boxDepth = 1.5;
      const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

      const loader = new THREE.TextureLoader();

      const materialsClub = [
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/club.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
      ];

      const materialsDiamond = [
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/diamond.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
      ];

      const materialsJoker = [
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/joker.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
        new THREE.MeshBasicMaterial({map: loader.load('./imgs/backside.png')}),
      ];

      club = new THREE.Mesh(geometry, materialsClub);
      club.position.set(pos_right.x, pos_right.y, pos_right.z);
      scene.add(club);

      diamond = new THREE.Mesh(geometry, materialsDiamond);
      diamond.position.set(pos_left.x, pos_left.y, pos_left.z);
      scene.add(diamond);

      joker = new THREE.Mesh(geometry, materialsJoker);
      joker.position.set(pos_mid.x, pos_mid.y, pos_mid.z);
      scene.add(joker);

      return {"club":club, "diamond":diamond, "joker":joker}
}

function flipCard(meshname,flipVelocity){
    if (meshname ==='club'){club.rotation.z += (Math.PI / 180)*flipVelocity; countFlipClub+=flipVelocity;}
    if (meshname ==='diamond'){diamond.rotation.z += (Math.PI / 180)*flipVelocity; countFlipDiamond+=flipVelocity;}
    if (meshname ==='joker'){joker.rotation.z += (Math.PI / 180)*flipVelocity; countFlipJoker+=flipVelocity;}
}

function switchCard(mesh1,mesh2,position1,position2,step){
    // var pivot = new THREE.Vector3( 0, 0, 0 );
    // var axis = new THREE.Vector3( 0, 1, 0 );
    // rotateAboutPoint(mesh1, pivot, axis, Math.PI/180);
    var horizentalStep = (pos_list[position2].x - pos_list[position1].x)/step
    mesh1.position.x += horizentalStep;
    mesh2.position.x -= horizentalStep;
    if ((mesh2.position.x - pos_list[position1].x) <= ((pos_list[position2].x - pos_list[position1].x)/2)){
        mesh1.position.y -= horizentalStep/2;
        mesh2.position.y -= horizentalStep/3;
    }else{
        mesh1.position.y += horizentalStep/2;
        mesh2.position.y += horizentalStep/3;
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function reassignPos(){
    cards[current_order[0]].position.set(pos_left.x, pos_left.y, pos_left.z);
    cards[current_order[2]].position.set(pos_right.x, pos_right.y, pos_right.z);
    cards[current_order[1]].position.set(pos_mid.x, pos_mid.y, pos_mid.z);
}

function switchOrder(switch1, switch2){
    var temp = current_order[switch1]
    current_order[switch1] = current_order[switch2]
    current_order[switch2] = temp
    reassignPos();
    console.log(current_order)

    if (cardsToSwitch.length === 1){
        console.log("set userSelectionState to true")
        userSelectionState = true
        fadeToAction('Idle',0.5)
        document.getElementById('left-card').classList.add(current_order[0])
        document.getElementById('middle-card').classList.add(current_order[1])
        document.getElementById('right-card').classList.add(current_order[2])
        $("#cards_options").fadeIn(800)
        $(".robot-msg").fadeIn(800)
        $("#robot-words").text("Which one do you think is the Joker card?")

    }
    cardsToSwitch.shift()
    accumframe=0
}

function flipAllCards(){
    flipClub=true;
    countFlipClub=0;
    flipDiamond=true;
    countFlipDiamond=0;
    flipJoker=true;
    countFlipJoker=0;
}

function animate() {
    // flip card
    if (trigger_thumbsUp){
        fadeToAction('ThumbsUp',0.2);
        trigger_thumbsUp=false;
    }
    if (trigger_No){
        fadeToAction('No',0.2);
        trigger_No=false;
    }
    if (flipClub || flipDiamond || flipJoker){
        if (flipClub){
            if (countFlipClub<=179){flipCard('club',4)
            }else{flipClub=false}
        }
        if (flipDiamond){
            if (countFlipDiamond<=179){flipCard('diamond',4)}
            else{flipDiamond=false}
        }
        if (flipJoker){
            if (countFlipJoker<=179){flipCard('joker',4)}
            else{
                flipJoker=false
            }
        }
    }else{
        if (cardsToSwitch){
            accumframe+=1;
            if (accumframe>waitframe){
                if (cardsToSwitch[0] === "1") {
                    if (cards[current_order[0]].position.x <= pos_mid.x){
                        switchCard(cards[current_order[0]], cards[current_order[1]],0,1,step)
                    }
                    else{
                        // switch ground truth order
                        switchOrder(0,1)
                        }
                }
                if (cardsToSwitch[0] === "2"){
                    if (cards[current_order[0]].position.x <= pos_right.x){
                        switchCard(cards[current_order[0]], cards[current_order[2]],0,2,step)}
                    else{
                        // switch ground truth order
                        switchOrder(0,2)
                    }
                }
                if (cardsToSwitch[0] === "3"){
                    if (cards[current_order[1]].position.x <= pos_right.x){
                        switchCard(cards[current_order[1]], cards[current_order[2]],1,2,step)}
                    else{
                        // switch ground truth order
                        switchOrder(1,2)
                    }
                }
            }
        }
    }

    const dt = clock.getDelta();

    if ( mixer ) mixer.update( dt );

    requestAnimationFrame( animate );

    renderer.render( scene, camera );

    stats.update();

}
