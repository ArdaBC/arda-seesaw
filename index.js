let torque = 0;
let rightTorque = 0;
let leftTorque = 0;
let rightWeight = 0;
let leftWeight = 0;
let nextWeight = 0;
let oldAngle = 0;
let angle = 0;

const colors = [
  "rgb(230, 126, 34)",
  "rgb(155, 89, 182)",
  "rgb(231, 76, 60)",
  "rgb(46, 204, 113)",
  "rgb(52, 73, 94)",
  "rgb(26, 188, 156)",
  "rgb(243, 156, 18)",
  "rgb(52, 152, 219)"
];

document.addEventListener("DOMContentLoaded", () => {
    nextWeight = randomInt(1, 10);
    document.getElementById("nextWeight").innerHTML = `${nextWeight} kg`;
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getPlankHeight(x) {
    const pivot = document.getElementById("pivot");
    const pivotRect = pivot.getBoundingClientRect();

    const pivotX = pivotRect.left + pivotRect.width / 2;
    const pivotY = pivotRect.top + pivotRect.height / 2;

    const theta = oldAngle * Math.PI / 180;
    
    const plankHeight = pivotY + (x - pivotX) * Math.tan(theta);

    return plankHeight;
}

function collides(ball) {
    const rect1 = ball.getBoundingClientRect();
    const rectCenterX = rect1.left + rect1.width / 2;

    const plankHeight = getPlankHeight(rectCenterX);

    return rect1.bottom >= plankHeight;
}

function placeBallOnPlank(ball) {
    const container = document.getElementById("seesawClickable");
    const containerRect = container.getBoundingClientRect();

    const rect1 = ball.getBoundingClientRect();
    const rectCenterX = rect1.left + rect1.width / 2;
    const plankHeight = getPlankHeight(rectCenterX);

    const ballSize = rect1.height;
    const ballTopUnadjusted = plankHeight - ballSize;
    const ballTop = ballTopUnadjusted - containerRect.top;

    ball.style.top = `${ballTop}px`;
}

function weightAnimation(weight, x, y){

    const size = 30 + 4 * weight;
    const color = colors[Math.floor(Math.random() * colors.length)]

    const container = document.getElementById("seesawClickable");

    const ball = document.createElement("div");
    ball.className = "object";
    ball.style.width = `${size}px`; 
    ball.style.height = `${size}px`; 
    ball.style.background = `${color}`;
    ball.style.position = "absolute";
    ball.style.left = `${x - size/2}px`;
    ball.style.top = "0px";
    ball.textContent = `${weight}kg`;

    ball.dataset.falling = "true"; //bu olmadan yapamadım

    container.append(ball);

    function animate() {

        const top = parseFloat(ball.style.top);

        if(ball.dataset.falling !== "false"){

            if(!collides(ball)){
                ball.style.top = top + 4 + "px";
                requestAnimationFrame(animate);
            } 
            else{
                placeBallOnPlank(ball);
                ball.dataset.falling = "false";
                ballsOnPlankAnimation();
                return;
            }
        } 
        else{
            placeBallOnPlank(ball);
            return;
        }
    }

  requestAnimationFrame(animate);
}

function plankAnimation(){

    angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));

    function animate() {
        if(Math.abs(oldAngle - angle) < 0.01){
            oldAngle = angle;
            document.getElementById("seesawPlank").style.transform = `translateX(-50%) translateY(-50%) rotate(${oldAngle}deg)`;
            return;
        }

        if(oldAngle > angle){
            oldAngle -= (oldAngle - angle)/30;
        }
        else{
            oldAngle += (angle - oldAngle)/30;
        }

        document.getElementById("seesawPlank").style.transform = `translateX(-50%) translateY(-50%) rotate(${oldAngle}deg)`;
        document.getElementById("angle").innerHTML = `${oldAngle.toFixed(1)}°`;

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function ballsOnPlankAnimation(){

    function animate(){

        const balls = Array.from(document.querySelectorAll(".object"));

        if(balls.length === 0){
            return;
        }

        balls.forEach(ball => {
            if(ball.dataset.falling === "false"){
                placeBallOnPlank(ball);
            } 
            else{
                if(collides(ball)){
                    placeBallOnPlank(ball);
                    ball.dataset.falling = "false";
                }
            }
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

document.getElementsByClassName('seesaw-clickable')[0]
.addEventListener('click', function (event) {

    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const randWeight = nextWeight;
    nextWeight = randomInt(1, 10);

    document.getElementById("nextWeight").innerHTML = `${nextWeight} kg`;

    const distance = x-225;

    const currentTorque = randWeight * distance;

    let side = "";

    if(currentTorque > 0){

        rightWeight += randWeight;
        document.getElementById("rightWeight").innerHTML = `${rightWeight} kg`;
        rightTorque += currentTorque;
        side = "right";
    }
    else{

        leftWeight += randWeight;
        document.getElementById("leftWeight").innerHTML = `${leftWeight} kg`;
        leftTorque -= currentTorque;
        side = "left";

    }

    let finalDist = Math.round(Math.abs(distance));
    
    const logger = document.getElementById("log");

    const log = document.createElement("div");
    log.className = "log-entry";
    log.innerHTML = `📦 ${randWeight} kg dropped on ${side} side at ${finalDist} px from center`;

    logger.append(log);

    torque += currentTorque;

    weightAnimation(randWeight, x, y);

    plankAnimation();

    ballsOnPlankAnimation();

});

document.getElementById('resetBtn').addEventListener('click', () => {

    const parent = document.getElementById('seesawClickable');

    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }

    const logger = document.getElementById("log");

    while(logger.firstChild){
        logger.removeChild(logger.firstChild);
    }

    torque = 0;
    rightTorque = 0;
    leftTorque = 0;
    rightWeight = 0;
    leftWeight = 0;
    oldAngle = 0;
    angle = 0;

    document.getElementById("seesawPlank").style.transform = `translateX(-50%) translateY(-50%) rotate(0deg)`;
    document.getElementById("angle").innerHTML = `0.0°`;
    document.getElementById("rightWeight").innerHTML = `0 kg`;
    document.getElementById("leftWeight").innerHTML = `0 kg`;
    
    nextWeight = randomInt(1, 10);
    document.getElementById("nextWeight").innerHTML = `${nextWeight} kg`;

});
