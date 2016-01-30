interface Step {
    ramp_rate: number,
    target: number,
    dwell: number
}

interface Program {
    id: string,
    loop_counter: number,
    steps: Step[]
}