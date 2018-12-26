import Puzzle from './Puzzle' ;

class PuzzleCard {

    constructor(i, puzzle) {
        this.index = i ;
        this.puzzle = puzzle ;
        this.$picture = null ;
        this.$letter = null ;
        this.$body = this.createBody();

        this.leftPart = null ;
        this.rightPart = null ;
        this._letter = null ;
        this.letter = puzzle.word[i] ;
    }

    createBody() {
        const w = Puzzle.WIDTH  / this.puzzle.word.length ;
        const $part = $('<div class="puzzle-item" />') ;
        const $picture = this.$picture = $('<div class="puzzle-item-picture" />') ;
        const i = this.index ;
        $part.append($picture) ;
        $picture.css("background", `url(${this.puzzle.imgUrl})`) ;
        $part.css("width", w+"px") ;
        $picture.css("width", (w-2)+"px") ;
        $picture.css("background-position", String(-w*i)+"px") ;
        $picture.css({"background-repeat": "no-repeat", "background-size": "500px"}) ;

        this.$letter = $('<div class="puzzle-item-letter"> </div>') ;
        $part.append(this.$letter) ;

        return $part ;
    }

    get rightCornerPosition() {
        let p = this.$body.position() ;
        p.left += this.$body.width() ;
        return p ;
    }

    get leftCornerPosition() {
        return this.$body.position() ;
    }

    get distanceToLeftPart() {
        if (!this.leftPart)
            return NaN ;
        return this.distance(this.leftCornerPosition, this.leftPart.rightCornerPosition) ;
    }

    get distanceToRightPart() {
        if (!this.rightPart)
            return NaN ;
        return this.distance(this.rightCornerPosition, this.rightPart.leftCornerPosition) ;
    }

    distance(p1, p2) {
        const dx = (p2.left-p1.left) ;
        const dy = (p2.top - p1.top) ;
        return Math.sqrt(dx*dx + dy*dy) ;
    }

    absorbCard(newCard) {
        newCard.$body.remove() ;
        const w = newCard.$body.width() ;

        this.$body.width(this.$body.width() + w) ;
        this.$picture.width(this.$picture.width() + w) ;
        this.rightPart = newCard.rightPart ;
        if (this.rightPart)
            this.rightPart.leftPart = this ;
        this.letter += newCard.letter ;
        this.$body.parent().append(this.$body) ;
    }

    get letter() {
        return this._letter ;
    }

    set letter(value) {
        this._letter = value ;
        this.$letter.html(value) ;
        if (value.length > 1) {
            this.$letter.css("letter-spacing", "30px") ;
            this.$letter.css("padding-left", "30px") ;
        }
    }
}

export default PuzzleCard ;