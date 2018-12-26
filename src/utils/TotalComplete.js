import ArrayUtils from "./ArrayUtils";

class TotalComplete {

    constructor(fff){
        this.totalComplete = fff ;
        this._handlers = [] ;
        this._f0 = this.onComplete ;
    }

    get onComplete() {
        const f = () => {
            if (ArrayUtils.removeObjectFromArray(f, this._handlers))
                this.checkTotalcomplete() ;
        } ;

        this._handlers.push(f) ;
        return f ;
    }

    checkTotalcomplete() {
        if (!this._handlers.length && this.totalComplete) {
            this.totalComplete() ;
            this.totalComplete = null ;
        }
    }

    start() {
        this._f0() ;
    }

}

export default TotalComplete ;

