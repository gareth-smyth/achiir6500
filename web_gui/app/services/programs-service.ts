import {Http} from 'angular2/http';
import {EventEmitter} from 'angular2/core';
import {Injectable} from 'angular2/core';
import {Program, Step} from "../data/program";
import 'rxjs/operator/map'

@Injectable()
export class ProgramsService {
    programs:Program[];
    originalPrograms:Program[];
    _emitter:EventEmitter<string> = new EventEmitter<string>();
    rxEmitter:any;

    constructor(public http:Http) {
        this.rxEmitter = this._emitter;
    }

    public getPrograms() {
        this.http.get('http://localhost:9858/programs')
            .map(res => res.json())
            .subscribe(
                data => this.updateFromServer(data),
                err => ProgramsService.logError(err)
            );
    }

    public save() {
        var dirtyPrograms:Program[] = this.gatherDirtyPrograms(this.programs);
        if(dirtyPrograms.length>0){
            this.http.post('http://localhost:9858/programs', JSON.stringify(dirtyPrograms))
                .map(res => res.json())
                .subscribe(
                    data => this.saved(),
                    err => ProgramsService.logError(err)
                );
        }
    }

    public run(programId:string):void {
        this.http.post('http://localhost:9858/start-program/'+programId, '').map(res => res.json())
            .subscribe(
                data => console.log("ran program "+programId),
                err => ProgramsService.logError(err)
            );
    }

    private saved() {
        this.originalPrograms = <Program[]>JSON.parse(JSON.stringify(this.programs));
        console.log('Saved');
    };

    private updateFromServer(data) {
        console.log('Updating data from server');
        this.programs = <Program[]>data;
        this.originalPrograms = <Program[]>JSON.parse(JSON.stringify(this.programs));
        this.rxEmitter.next(this.programs);
    };

    private gatherDirtyPrograms(updatedPrograms:Program[]):Program[] {
        var dirty = [];
        for (var updatedProgramNum = 0; updatedProgramNum<updatedPrograms.length; updatedProgramNum++) {
            var updatedProgram = updatedPrograms[updatedProgramNum];
            var originalProgram = ProgramsService.findProgram(this.originalPrograms, updatedProgram.id);
            if (originalProgram == null || ProgramsService.programDirty(originalProgram, updatedProgram)) {
                dirty.push(updatedProgram)
            }
        }
        return dirty;
    }

    private static programDirty(program1:Program, program2:Program):boolean {
        return program1.id != program2.id ||
                program1.name != program2.name ||
                program1.loop_counter != program2.loop_counter ||
                ProgramsService.stepsDirty(program1.steps, program2.steps);
    }

    private static stepsDirty(steps1:Step[], steps2:Step[]):boolean {
        if(steps1.length != steps2.length) return true;
        for(var step: number; step<steps1.length;step++){
            if(ProgramsService.stepDirty(steps1[step], steps2[step])){
                return true;
            }
        }
        return false;
    }

    private static stepDirty(step1:Step, step2:Step):boolean {
        return step1.dwell != step2.dwell ||
                step1.ramp_rate != step2.ramp_rate ||
                step1.target != step2.target;
    }

    private static findProgram(programs:Program[], id:string):Program {
        for (var programNum = 0; programNum<programs.length; programNum++) {
            var program = programs[programNum];
            if (program.id === id) return program;
        }
        return null;
    }

    private static logError(err) {
        console.error('There was an error: ' + err);
    }
}
