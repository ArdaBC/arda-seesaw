export class Ball {

    constructor(weight, distance){
        this.weight = weight;
        this.distance = distance;
    }

    asVector(){
        return this.weight * this.distance;
    }

}
