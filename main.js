import { Ball } from "./ball.js";

/**
 * Calculates the torque for the given arrangement.
 * @param {Ball[]} weights - Array of weights
 * @returns {number} The sum
 */
function calculateTorque(weights){
    return weights.reduce((sum, w) => sum + w.asVector(), 0);
}





const leftBalls = [
  new Ball(1, 1),
  new Ball(4, 1),
  new Ball(2, 5),
];

const rightBalls = [
  new Ball(1, -1),
  new Ball(4, -1),
  new Ball(2, -5),
  new Ball(2, -5),
];

const torque = calculateTorque(leftBalls) + calculateTorque(rightBalls);

console.log(torque);