import './game.css' ;
import Game from "./Game";
import ArrayUtils from "./utils/ArrayUtils";

import PuzzleCard from "./PuzzleCard";
import MathUtils from "./utils/MathUtils";
import {Howl} from 'howler';

require('jquery-ui/ui/core') ;
require('jquery-ui/ui/effect') ;
require('jquery-ui/ui/effects/effect-puff') ;

class Puzzle {

    constructor(config, soundManager) {
        this.imgUrl = config.img ;
        this.word = config.word ;
        this.$body = $('<div class="puzzle"/>') ;
        this.cardsArr = [] ;
        this.enabled = false ;
        this.soundManager = soundManager ;

        this.createParts() ;
        this.showAnimation() ;

        this.sound = new Howl({
            src: config.mp3
        });
        setTimeout(this.startDnD.bind(this), 1000) ;
    }

    static get WIDTH() { return 500 ;}

    createParts() {
        [...this.word].forEach((c,i) => {
            let card = new PuzzleCard(i, this) ;
            this.$body.append(card.$body) ;
            this.cardsArr.push(card) ;
            if (i > 0) {
                this.cardsArr[i-1].rightPart = card ;
                card.leftPart = this.cardsArr[i-1] ;
            }
        }) ;

        ArrayUtils.shuffleArray(this.cardsArr) ;

        const gap = 30 ;
        let curX = (Game.WIDTH - Puzzle.WIDTH - (this.word.length-1)*gap) / 2 ;

        this.cardsArr.forEach(card => {
            const $item = card.$body ;
            $item.css("left", curX) ;
            curX += $item.width() + gap ;
        }) ;
    }

    showAnimation() {
        this.cardsArr.forEach((card, index) => {
            const $card = card.$body ;
            $card.hide().delay(index*100).show({effect:"puff"}) ;
        }) ;
    }

    static get dragArea() {
        return {left:20, top:20, width:Game.WIDTH-40, height:Game.HEIGHT-40}
    }

    startDnD() {
        this.enabled = true ;

        let mouseDown = "mousedown";
        let mouseMove = "mousemove";
        let mouseUp = "mouseup";

        if (Game.isTouchDevice) {
            mouseDown = "touchstart";
            mouseMove = "touchmove";
            mouseUp = "touchend";
        }

        let $document = $(document) ;
        let dragArea = Puzzle.dragArea ;

        this.cardsArr.forEach(card => {
            const $card = card.$body ;
            let dx = 0, dy = 0, w = $card.width(), h = $card.height() ;

            const onMouseDown = event => {
                if (!this.enabled) return ;
                calculateShift(event) ;
                $card.parent().append($card) ;
                $card.addClass("puzzle-item_drag") ;

                if (card.letter.length === 1)
                    this.soundManager.playLetter(card.letter) ;

                $document.on(mouseMove, onMouseMove) ;
                $document.on(mouseUp, onMouseUp) ;
            } ;

            function onMouseMove(event) {
                let p = getPointerCoords(event) ;

                p.left += dx ; p.top += dy ;
                $card.offset(p) ;
                p = $card.position() ;
                p.left = MathUtils.clamp(p.left, dragArea.left, dragArea.left + dragArea.width - w ) ;
                p.top = MathUtils.clamp(p.top, dragArea.top, dragArea.top + dragArea.height - h) ;
                $card.css(p) ;
            }

            function onMouseUp(event) {
                $document.off(mouseUp, null, onMouseUp) ;
                $document.off(mouseMove, null,onMouseMove) ;
                $card.removeClass("puzzle-item_drag") ;
                checkPosition(card) ;
                w = $card.width();
                h = $card.height() ;
            }

            function calculateShift(event) {
                let p = $card.offset() ;
                let mp = getPointerCoords(event) ;
                dx = p.left - mp.left ;
                dy = p.top - mp.top ;
            }

            $card.on(mouseDown, onMouseDown);

        });

        function getPointerCoords(event) {
            let xx, yy ;

            if ("touches" in event && event.touches ) {
                let touch = event.touches.item(0);
                xx = touch.pageX; yy = touch.pageY ;
            } else {
                xx = event.pageX ;
                yy = event.pageY ;
            }

            return {left:xx,top:yy} ;
        }

        let checkPosition = card => {
            const eps = 30 ;

            if (card.leftPart && card.distanceToLeftPart < eps) {
                removeCardFromArray(card) ;
                card.leftPart.absorbCard(card) ;
                this.$body.trigger(Game.PUZZLE_CHANGED) ;
            } else if (card.rightPart && card.distanceToRightPart < eps) {
                removeCardFromArray(card.rightPart) ;
                card.absorbCard(card.rightPart) ;
                this.$body.trigger(Game.PUZZLE_CHANGED) ;
            }
        } ;

        let playToggleSound = () => {
            this.soundManager.playEffect("toggle") ;
        };

        let removeCardFromArray = (card) => {
            ArrayUtils.removeObjectFromArray(card, this.cardsArr) ;
            playToggleSound() ;
        } ;

    }

    get numberOfCards() {
        //console.log(this.cardsArr) ;
        return this.cardsArr.length ;
    }

    playFinalSound(handler) {

        this.sound.once('end', onComplete) ;

        //console.log("this.sound.state()",this.sound.state()) ;

        switch (this.sound.state()) {
            case "loaded" : this.sound.play() ; break ;
            case "loading" : this.sound.autoplay = true ; break ;
            default : onComplete() ;
        }

        function onComplete() {
            if (handler !== null)
                handler() ;
        }
    }

}

export default Puzzle ;