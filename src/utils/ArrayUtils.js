class ArrayUtils {

    /**
     * Random sort of array in place
     * @param array
     */
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Removes the object obj from the array arr
     * @param obj
     * @param arr
     * @return {boolean} true if object was removed
     */
    static removeObjectFromArray (obj, arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
                arr.splice(i, 1) ;
                return true;
            }
        }
        return false ;
    }
}

export default ArrayUtils ;