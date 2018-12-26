import TotalComplete from "./utils/TotalComplete";
import {Howl} from 'howler';

class SoundManager {

    static get SOUNDS_LOADED() {
        return "soundsLoaded" ;
    }

    constructor() {
        this.alphabet = null ;
        this.efects = null ;

        this.ready = false ;
        this.init() ;
    }

    init() {
        const tc = new TotalComplete(this.onLoaded.bind(this)) ;

        this.efects = new Howl({
            src: 'mp3/effects.mp3',
            sprite: {
                "correct": [0, 1032],
                "fireworks": [1032, 496],
                "toggle": [1528, 262],
                "whistle": [1790, 864]
            },
            onload:tc.onComplete
        }) ;

        this.alphabet = new Howl({
            src: 'mp3/letters.mp3',
            sprite: {
                "А": [0, 575],
                "Б": [575, 809],
                "В": [1384, 836],
                "Г": [2220, 784],
                "Д": [3004, 732],
                "Е": [3736, 783],
                "Ё": [4519, 810],
                "Ж": [5329, 810],
                "З": [6139, 757],
                "И": [6896, 497],
                "Й": [7393, 966],
                "К": [8359, 523],
                "Л": [8882, 627],
                "М": [9509, 522],
                "Н": [10031, 627],
                "О": [10658, 392],
                "П": [11050, 444],
                "Р": [11494, 522],
                "С": [12016, 601],
                "Т": [12617, 470],
                "У": [13087, 497],
                "Ф": [13584, 418],
                "Х": [14002, 653],
                "Ц": [14655, 627],
                "Ч": [15282, 574],
                "Ш": [15856, 653],
                "Щ": [16509, 680],
                "Ъ": [17189, 940],
                "Ь": [18129, 1045],
                "Ы": [19174, 444],
                "Э": [19618, 444],
                "Ю": [20062, 627],
                "Я": [20689, 627]
            },
            onload:tc.onComplete
        }) ;

        tc.start() ;
    }

    onLoaded() {
        console.log("onLoaded") ;
        this.ready = true ;

        $('body').trigger(SoundManager.SOUNDS_LOADED) ;
    }

    playLetter(letter){
        this.alphabet.play(letter) ;
    }

    playEffect(effect) {
        this.efects.play(effect) ;
    }

}

export default SoundManager ;