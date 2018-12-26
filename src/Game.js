import initXML from './init.xml';
import MathUtils from './utils/MathUtils' ;
import Puzzle from './Puzzle'
import './game.css';
import SoundManager from "./SoundManager";

require('jquery-ui/ui/core') ;
require('jquery-ui/ui/effect') ;
require('jquery-ui/ui/effects/effect-explode') ;

class Game {

    constructor() {
        this.$mainDiv = null;
        this.puzzle = null ;
        this.soundManager = null ;
    }

    static get WIDTH() { return 800 ;}
    static get HEIGHT() { return 600 ;}
    static get PUZZLE_CHANGED() {return "puzzleChanged"} ;

    start() {
        //console.log("Game started") ;
        this.$mainDiv = $('<div id="mainDiv" />') ;
        const $body = $('body') ;

        $body.append(this.$mainDiv) ;
        $body.one(SoundManager.SOUNDS_LOADED, this.createNewPuzzle.bind(this)) ;

        this.soundManager = new SoundManager() ;
    }

    onPuzzleChanged() {
        if (this.puzzle.numberOfCards === 1) {
            //console.log("Finish") ;
            this.disappearAnimation(this.createNewPuzzle.bind(this)) ;
        }
    }

    disappearAnimation(handler) {
        this.puzzle.enabled = false ;
        const $obj = this.puzzle.cardsArr[0].$body ;
        const left = (Game.WIDTH - $obj.width()) / 2 ;

        const disappear = () => {
            $obj.delay(500).hide({effect:"explode", complete:handler}) ;
            setTimeout(this.soundManager.playEffect.bind(this.soundManager), 500, "fireworks") ;
        } ;

        let finalSound = () => {
            this.puzzle.playFinalSound(disappear) ;
        } ;

        this.soundManager.playEffect("correct") ;
        $obj.animate({top:70, left:left}, {complete:finalSound, duration:1000}) ;
    }


    createNewPuzzle() {
        if (this.puzzle) {
            this.puzzle.$body.remove() ;
        }

        const item = this.randomItem ;
        //console.log(item) ;
        this.puzzle = new Puzzle(item, this.soundManager) ;
        this.$mainDiv.append(this.puzzle.$body) ;
        this.puzzle.$body.on(Game.PUZZLE_CHANGED, this.onPuzzleChanged.bind(this)) ;
        this.soundManager.playEffect("whistle") ;
    }

    get randomItem() {
        const arr = initXML.items.item ;
        const i = MathUtils.roundRandRange(0, arr.length-1) ;
        return arr[i].$ ;
        // return arr[6].$ ;
    }

    static get isTouchDevice() {
        return 'ontouchstart' in window ;
    }

}

export default Game;