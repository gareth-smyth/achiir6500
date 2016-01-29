import {Http} from 'angular2/http';
import {EventEmitter} from 'angular2/core';
import {Injectable} from 'angular2/core';

@Injectable()
export class ProgramsService {
    _emitter: EventEmitter<string> = new EventEmitter<string>();
    rxEmitter: any;
    constructor(public http: Http) {
        this.rxEmitter = this._emitter;
    }

    public getPrograms() {
        this.http.get('http://localhost:9858/programs')
            .map(res => res.json())
            .subscribe(
                data => this.rxEmitter.next(data['programs']),
                err => ProgramsService.logError(err),
                () => console.log('Random Quote Complete')
            );
    }

    static logError(err) {
        console.error('There was an error: ' + err);
    }
}
