let torque = 0;
let rightTorque = 0;
let leftTorque = 0;
let rightWeight = 0;
let leftWeight = 0;
let nextWeight = 0;
let oldAngle = 0;
let angle = 0;
let currentId = 0;

//çok kullanılıyor diye global yaptım
const container = document.getElementById("seesawClickable"); 

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

    const savedState = JSON.parse(localStorage.getItem("state") || "{}");

    torque = savedState.torque || 0;
    rightTorque = savedState.rightTorque || 0;
    leftTorque = savedState.leftTorque || 0;
    rightWeight = savedState.rightWeight || 0;
    leftWeight = savedState.leftWeight || 0;
    oldAngle = savedState.oldAngle || 0;
    angle = savedState.angle || 0;
    currentId = savedState.currentId || 0;
    nextWeight = savedState.nextWeight || randomInt(1, 10);

    document.getElementById("nextWeight").innerHTML = `${nextWeight} kg`;
    document.getElementById("rightWeight").innerHTML = `${rightWeight} kg`;
    document.getElementById("leftWeight").innerHTML = `${leftWeight} kg`;
    document.getElementById("angle").innerHTML = `${oldAngle.toFixed(1)}°`;

    const savedBalls = JSON.parse(localStorage.getItem("balls") || "[]");

    savedBalls.forEach(ballData => {

        const ball = document.createElement("div");
        ball.className = "object";
        ball.id = `object-${ballData.id}`;
        ball.style.width = `${ballData.size}px`;
        ball.style.height = `${ballData.size}px`;
        ball.style.background = ballData.color;
        ball.style.position = "absolute";
        ball.style.left = `${ballData.x - ballData.size/2}px`;
        ball.style.top = `${ballData.top}px`;
        ball.textContent = `${ballData.weight}kg`;

        ball.dataset.falling = ballData.falling ? "true" : "false";

        container.append(ball);
    });

    requestAnimationFrame(mainLoop);
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getPlankHeight(x) {
    const pivot = document.getElementById("pivot");
    const pivotRect = pivot.getBoundingClientRect();

    const pivotX = pivotRect.left + pivotRect.width / 2;
    const pivotY = pivotRect.top + pivotRect.height / 2; //rotation pivotun ortasına göre (görsel != logic)

    const theta = oldAngle * Math.PI / 180;
    
    const plankHeight = pivotY + (x - pivotX) * Math.tan(theta);

    return plankHeight;
}

//Check if the ball collides with the plank
function collides(ball) {
    const rect1 = ball.getBoundingClientRect();
    const rectCenterX = rect1.left + rect1.width / 2;

    const plankHeight = getPlankHeight(rectCenterX);

    return rect1.bottom >= plankHeight;
}

function placeBallOnPlank(ball) {
    
    const containerRect = container.getBoundingClientRect();

    const rect1 = ball.getBoundingClientRect();
    const rectCenterX = rect1.left + rect1.width / 2;
    const plankHeight = getPlankHeight(rectCenterX);

    const ballSize = rect1.height;
    const ballTopUnadjusted = plankHeight - ballSize;
    const ballTop = ballTopUnadjusted - containerRect.top;

    ball.style.top = `${ballTop}px`;
}

function createWeight(weight, x) {

    const size = 30 + 4 * weight;
    const color = colors[Math.floor(Math.random() * colors.length)]

    const ball = document.createElement("div");
    ball.className = "object";
    ball.id = `object-${currentId}`;
    ball.style.width = `${size}px`; 
    ball.style.height = `${size}px`; 
    ball.style.background = `${color}`;
    ball.style.position = "absolute";
    ball.style.left = `${x - size/2}px`;
    ball.style.top = "0px";
    ball.textContent = `${weight}kg`;

    ball.dataset.falling = "true"; //bu olmadan yapamadım

    container.append(ball);

    const storedBall = {
        id: currentId,
        size,
        color,
        weight,
        x,
        top: 0,
        falling: true
    };

    let savedBalls = JSON.parse(localStorage.getItem("balls") || "[]");
    savedBalls.push(storedBall);
    localStorage.setItem("balls", JSON.stringify(savedBalls));

    currentId++;

}

document.getElementById('seesawClickable')
.addEventListener('click', function (event) {

    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const randWeight = nextWeight;
    nextWeight = randomInt(1, 10);

    document.getElementById("nextWeight").innerHTML = `${nextWeight} kg`;

    const distance = x-225; //225 tam orta, pdf'te yazıyor

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

    angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));

    createWeight(randWeight, x);

    localStorage.setItem("state", JSON.stringify({
        torque,
        rightTorque,
        leftTorque,
        rightWeight,
        leftWeight,
        nextWeight,
        oldAngle,
        angle,
        currentId
    }));

});

document.getElementById('resetBtn').addEventListener('click', () => {

    while(container.firstChild){
        container.removeChild(container.firstChild);
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

    localStorage.clear();

    document.getElementById("seesawPlank").style.transform = `translateX(-50%) translateY(-50%) rotate(0deg)`;
    document.getElementById("angle").innerHTML = `0.0°`;
    document.getElementById("rightWeight").innerHTML = `0 kg`;
    document.getElementById("leftWeight").innerHTML = `0 kg`;
    
    nextWeight = randomInt(1, 10);
    document.getElementById("nextWeight").innerHTML = `${nextWeight} kg`;

});

function updatePlankAngle() {
    const seesaw = document.getElementById("seesawPlank");

    const diff = angle - oldAngle;
    if(Math.abs(diff) > 0.001){
        oldAngle += diff / 20;
    }

    seesaw.style.transform = `translateX(-50%) translateY(-50%) rotate(${oldAngle}deg)`;
    document.getElementById("angle").innerHTML = `${oldAngle.toFixed(1)}°`;
}

function updateBalls() {
    
    const balls = Array.from(document.querySelectorAll(".object"));

    if (balls.length === 0){
        return;
    }

    balls.forEach(ball => {
        if (ball.dataset.falling === "true") {
            const top = parseFloat(ball.style.top);
            if (!collides(ball)) {
                ball.style.top = top + 4 + "px";
            } 
            else {
                placeBallOnPlank(ball);
                ball.dataset.falling = "false";

                let savedBalls = JSON.parse(localStorage.getItem("balls") || "[]");

                const index = savedBalls.findIndex(function (element) {
                    return Number(element.id) === parseInt(ball.id.split("-")[1]);
                });

                if(index !== -1){
                    savedBalls[index].top = parseFloat(ball.style.top);
                    savedBalls[index].falling = false;
                    localStorage.setItem("balls", JSON.stringify(savedBalls));
                }

            }
        } 
        else {
            placeBallOnPlank(ball);
        }
    });
}

function mainLoop() {
    updatePlankAngle();
    updateBalls();
    requestAnimationFrame(mainLoop);
}