class Vector {

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    static add(...vectors){
        let current_x = 0;
        let current_y = 0;

        for(const vector of vectors){
            current_x += vector.x;
            current_y += vector.y;
        }

        return new Vector(current_x, current_y);
    }
}

/*

let v1 = new Vector(1, 2);
let v2 = new Vector(2, 1);
let v3 = new Vector(1, 1);

let v = Vector.add(v1, v2, v3);

console.log(v.x, v.y);

*/