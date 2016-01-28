import {Component} from "angular2/core";
import {Http} from 'angular2/http';

@Component({
    selector: "control-station",
    templateUrl: '../views/control_station.html'
})
export class ControlStation {
    programs:string;
    maxSteps:Number[];

    constructor(public http: Http) {
        this.http.get('http://localhost:9858/programs')
            .map(res => res.json())
            .subscribe(
                data => this.programs = data.programs,
                err => ControlStation.logError(err),
                () => console.log('Random Quote Complete')
            );
        this.maxSteps = new Array(8);
    }

    static logError(err) {
        console.error('There was an error: ' + err);
    }
}