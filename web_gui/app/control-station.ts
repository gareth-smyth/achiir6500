import {Component} from "angular2/core";
import {Http} from 'angular2/http';

@Component({
    selector: "control-station",
    templateUrl: '../views/control_station.html'
})
export class ControlStation {
    programs:string;

    constructor(public http: Http) {
        this.http.get('http://localhost:9858/programs')
            .map(res => res.json())
            .subscribe(
                data => this.programs = data,
                err => ControlStation.logError(err),
                () => console.log('Random Quote Complete')
            );
    }

    static logError(err) {
        console.error('There was an error: ' + err);
    }
}