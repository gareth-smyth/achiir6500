import {Component} from "angular2/core";
import {ProgramsService} from "./../services/programs-service";
import { FORM_DIRECTIVES, CORE_DIRECTIVES } from 'angular2/common';

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

    public valueChanged(event){
        console.log(event);
    }
}