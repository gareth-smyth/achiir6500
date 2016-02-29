export class Step {
    ramp: number = null;
    level: number = null;
    dwell: number = null;
}

export class Program {
    id: string = "";
    name: string = "";
    loop_counter: number = 1;
    steps: Step[] = [];

    constructor() {
        this.id = generateUUID();
        for(let i: number = 0; i<8; i++){
            this.steps.push(new Step());
        }
    }
}

function generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}