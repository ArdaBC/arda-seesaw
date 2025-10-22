class Ball {

    constructor(weight, distance){
        this.weight = weight;
        this.distance = distance;
    }

    asVector(){
        return this.weight * this.distance;
    }

}

const leftBalls = []
const rightBalls = []

/**
 * Calculates the torque for the given arrangement.
 * @param {Ball[]} weights - Array of weights
 * @returns {number} The sum
 */
function calculateTorque(weights){
    return weights.reduce((sum, w) => sum + w.asVector(), 0);
}

/**
 * Returns a random int from the included min-max range
 * @param {number} min - lower bound (included)
 * @param {number} max - upper bound (included)
 * @returns {number} The random int
 */
function randomInt(min, max) {
return Math.floor(Math.random() * (max - min + 1) + min);
}

document.getElementsByClassName('seesaw-left')[0]
.addEventListener('click', function (event) {
    
    const rndInt = randomInt(1, 10);
    console.log("Left: ", rndInt);

    leftBalls.push(new Ball(rndInt, -1));

    getTorque();
});

document.getElementsByClassName('seesaw-right')[0]
.addEventListener('click', function (event) {

    const rndInt = randomInt(1, 10);
    console.log("Righte: ", rndInt);

    rightBalls.push(new Ball(rndInt, 1));

    getTorque();
});

function getTorque() {
    const torque = calculateTorque(leftBalls) + calculateTorque(rightBalls);
    console.log("Torque:", torque);
}