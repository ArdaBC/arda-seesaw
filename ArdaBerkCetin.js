let state = {
    torque: 0,
    rightTorque: 0,
    leftTorque: 0,
    rightWeight: 0,
    leftWeight: 0,
    nextWeight: 0,
    oldAngle: 0,
    angle: 0,
    currentId: 0
};

let placedSound = new Sound("land.ogg");
let resetSound = new Sound("reset.ogg");

function Sound(src) {
    this.sound = new Audio(src);
    this.sound.preload = "auto";
    this.sound.volume = 0.5;
    this.play = function() {
        const clone = this.sound.cloneNode();
        clone.play();
    }
}

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

    Object.assign(state, savedState);

    if (!state.nextWeight) {
        state.nextWeight = randomInt(1, 10);
    }

    updateDisplay();

    const savedBalls = JSON.parse(localStorage.getItem("balls") || "[]");
    savedBalls.forEach(ballData => renderBall(ballData));

    updatePlankAngle();
    updateBalls();
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getPlankHeight(x) {
    const pivot = document.getElementById("pivot");
    const pivotRect = pivot.getBoundingClientRect();

    const pivotX = pivotRect.left + pivotRect.width / 2;
    const pivotY = pivotRect.top + pivotRect.height / 2; //rotation pivotun ortasına göre (görsel != logic)

    const theta = state.oldAngle * Math.PI / 180;
    
    const plankHeight = pivotY + (x - pivotX) * Math.tan(theta);

    return plankHeight;
}

//plank ile ball çarpışıyor mu
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

function updateDisplay() {
    document.getElementById("rightWeight").textContent = `${state.rightWeight.toFixed(1)} kg`;
    document.getElementById("leftWeight").textContent = `${state.leftWeight.toFixed(1)} kg`;
    document.getElementById("nextWeight").textContent = `${state.nextWeight} kg`;
    document.getElementById("angle").textContent = `${state.oldAngle.toFixed(1)}°`;
}

function createWeight(weight, x) {
    const size = 30 + 4 * weight;
    const color = colors[Math.floor(Math.random() * colors.length)];

    const storedBall = {
        id: state.currentId,
        size,
        color,
        weight,
        x,
        top: 0,
        falling: true
    };

    renderBall(storedBall);

    let savedBalls = JSON.parse(localStorage.getItem("balls") || "[]");
    savedBalls.push(storedBall);
    localStorage.setItem("balls", JSON.stringify(savedBalls));

    state.currentId++;
}


function renderBall({id, size, color, weight, x, top, falling}) {

    const ball = document.createElement("div");

    ball.className = "object";
    ball.id = `object-${id}`;
    ball.style.width = `${size}px`;
    ball.style.height = `${size}px`;
    ball.style.background = color;
    ball.style.position = "absolute";
    ball.style.left = `${x - size / 2}px`;
    ball.style.top = `${top}px`;
    ball.textContent = `${weight}kg`;

    ball.dataset.falling = falling ? "true" : "false";

    container.append(ball);
}


document.getElementById('seesawClickable')
.addEventListener('click', function (event) {

    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const randWeight = state.nextWeight;
    state.nextWeight = randomInt(1, 10);

    const containerRect = container.getBoundingClientRect();
    const clickable = document.getElementById("seesawClickable");
    const clickableRect = clickable.getBoundingClientRect();
    const plankCenter = (clickableRect.left + clickableRect.width / 2) - containerRect.left;

    const distance = x - plankCenter;

    let side = "";

    if(distance > 0){
        side = "right";
    }
    else{
        side = "left";
    }

    let finalDist = Math.round(Math.abs(distance));
    
    const logger = document.getElementById("log");

    const log = document.createElement("div");
    log.className = "log-entry";
    log.textContent = `📦 ${randWeight} kg dropped on ${side} side at ${finalDist} px from center`;

    updateDisplay();

    logger.prepend(log);

    createWeight(randWeight, x);

    localStorage.setItem("state", JSON.stringify({ ...state }));

});

document.getElementById('resetBtn').addEventListener('click', () => {

    container.replaceChildren();

    const logger = document.getElementById("log");
    logger.replaceChildren();

    state = {
        torque: 0,
        rightTorque: 0,
        leftTorque: 0,
        rightWeight: 0,
        leftWeight: 0,
        oldAngle: 0,
        angle: 0,
        currentId: 0,
        nextWeight: randomInt(1, 10)
    };

    localStorage.removeItem("state");
    localStorage.removeItem("balls");

    document.getElementById("seesawPlank").style.transform = `translateX(-50%) translateY(-50%) rotate(0deg)`;

    updateDisplay();

    resetSound.play();

});

function updatePlankAngle() {
    const seesaw = document.getElementById("seesawPlank");

    const diff = state.angle - state.oldAngle;
    if(Math.abs(diff) > 0.001){
        state.oldAngle += diff / 20;
    }

    seesaw.style.transform = `translateX(-50%) translateY(-50%) rotate(${state.oldAngle}deg)`;
    document.getElementById("angle").textContent = `${state.oldAngle.toFixed(1)}°`;
    requestAnimationFrame(updatePlankAngle);
}

function updateBalls() {
    
    const balls = Array.from(document.querySelectorAll(".object"));

    balls.forEach(ball => {
        if (ball.dataset.falling === "true") {
            const top = parseFloat(ball.style.top);
            if (!collides(ball)) {
                ball.style.top = top + 4 + "px";
            } 
            else {
                placedSound.play();
                placeBallOnPlank(ball);
                ball.dataset.falling = "false";

                let savedBalls = JSON.parse(localStorage.getItem("balls") || "[]");

                const index = savedBalls.findIndex(function (element) {
                    return Number(element.id) === parseInt(ball.id.split("-")[1]);
                });

                if(index !== -1){
                    if (savedBalls[index].falling) {
                        const weight = savedBalls[index].weight;
                        const x = savedBalls[index].x;

                        //direkt aynı kod, sadece buraya taşındı
                        const containerRect = container.getBoundingClientRect();
                        const clickable = document.getElementById("seesawClickable");
                        const clickableRect = clickable.getBoundingClientRect();
                        const plankCenter = (clickableRect.left + clickableRect.width / 2) - containerRect.left;
                        const distance = x - plankCenter;
                        const currentTorque = weight * distance;

                        if (currentTorque > 0) {
                            state.rightWeight += weight;
                            state.rightTorque += currentTorque;
                        } 
                        else {
                            state.leftWeight += weight;
                            state.leftTorque -= currentTorque;
                        }

                        state.torque += currentTorque;
                        state.angle = Math.max(-30, Math.min(30, (state.rightTorque - state.leftTorque) / 10));

                        updateDisplay();

                        localStorage.setItem("state", JSON.stringify({ ...state }));
                    }
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

    requestAnimationFrame(updateBalls);
}
