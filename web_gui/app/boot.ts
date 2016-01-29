import {bootstrap}    from 'angular2/platform/browser'
import {ControlStation} from "./control-station";
import {Http, Headers} from 'angular2/http';
import {HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';
import {ProgramsService} from "./programs-service";

bootstrap(<any>ControlStation, [HTTP_PROVIDERS, ProgramsService]);