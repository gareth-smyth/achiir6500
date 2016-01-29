import {Component} from "angular2/core";
import {ProgramsService} from "./programs-service";

@Component({
    selector: "control-station",
    templateUrl: '../views/control_station.html'
})
export class ControlStation {
    programs:string;
    maxSteps:Number[];

    constructor(programsService: ProgramsService) {
        programsService.rxEmitter.subscribe((data) => {
           this.programs = data;
        });
        programsService.getPrograms();
        this.maxSteps = new Array(8);
    }
}