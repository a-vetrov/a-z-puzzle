class MathUtils {

    /**
     * Get random number in the interval between r1 and r2
     * @param r1
     * @param r2
     * @return {number}
     */
    static randRange(r1,r2) {
        return r1 + Math.random() * (r2 - r1)
    }

    /**
     * Get random whole number in the interval between r1 and r2
     * @param r1
     * @param r2
     * @return {number}
     */
    static roundRandRange(r1, r2) {
        return Math.round(MathUtils.randRange(r1,r2)) ;
    }

    /**
     * Limits the number n by the interval [min, max]
     * @param n
     * @param min
     * @param max
     * @return {number}
     */
    static clamp(n, min, max) {
        if (n < min)
            return min;
        if (n > max)
            return max;
        return n;
    }
}

export default MathUtils ;