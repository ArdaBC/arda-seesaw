let torque = 0;
let rightTorque = 0;
let leftTorque = 0;
let oldAngle = 0;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function weightAnimation(weight, x, y){

    const container = document.getElementById("seesawClickable");

    const ball = document.createElement("div");
    ball.className = "object";
    ball.style.width = "34px"; //depends on weight
    ball.style.height = "34px"; //depends on weight
    ball.style.background = "rgb(230, 126, 34)";
    ball.style.position = "absolute";
    ball.style.left = `${x}px`;
    ball.style.top = "0px";
    ball.textContent = `${weight}kg`;

    container.append(ball);

    function animate() {
        let top = parseFloat(ball.style.top);
        if (top < y) {
            ball.style.top = top + 2 + "px";
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);

}

function plankAnimation(){

    const angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));

    function animate() {
    
        if(oldAngle > angle){
            oldAngle -= (oldAngle - angle)/60;
        }
        else{
            oldAngle += (angle - oldAngle)/60;
        }

        document.getElementById("seesawPlank").style.transform = `translateX(-50%) translateY(-50%) rotate(${oldAngle}deg)`;

        if(Math.abs(oldAngle - angle) < 0.1){
            return;
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

}

document.getElementsByClassName('seesaw-clickable')[0]
.addEventListener('click', function (event) {

    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const randWeight = randomInt(1, 10);

    const distance = x-225;

    //console.log("Clicked at:", x, y); //225 tam orta

    const currentTorque = randWeight * distance;

    currentTorque > 0 ? rightTorque += currentTorque : leftTorque -= currentTorque;
    
    torque += currentTorque;

    weightAnimation(randWeight, x, y);

    plankAnimation();

    console.log("Torque:", torque)
});
