class Step {
    ramp_rate: number;
    target: number;
    dwell: number;
}

export class Program {
    id: string;
    loop_counter: number;
    steps: Step[] = [];

    constructor() {
        for(let i: number = 0; i<8; i++){
            this.steps.push(new Step());
        }
    }
}