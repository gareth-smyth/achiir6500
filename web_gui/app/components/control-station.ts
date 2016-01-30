import {Component} from "angular2/core";
import {ProgramsService} from "./../services/programs-service";
import { FORM_DIRECTIVES, CORE_DIRECTIVES } from 'angular2/common';
import {Program} from "../data/program";

@Component({
    selector: "control-station",
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    templateUrl: '../views/control_station.html'
})
export class ControlStation {
    programs:Program[];
    maxSteps:Number[];

    constructor(programsService: ProgramsService) {
        programsService.rxEmitter.subscribe((programs) => {
           this.programs = programs;
        });
        programsService.getPrograms();
        this.maxSteps = new Array(8);
    }

    public addProgram(input, $event) {
        this.programs.push(new Program())
    }

    public valueChanged(event){
        console.log(event);
    }
}