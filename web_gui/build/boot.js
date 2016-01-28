System.register(['angular2/platform/browser', "./control-station", 'angular2/http', 'rxjs/add/operator/map'], function(exports_1) {
    var browser_1, control_station_1, http_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (control_station_1_1) {
                control_station_1 = control_station_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            browser_1.bootstrap(control_station_1.ControlStation, [http_1.HTTP_PROVIDERS]);
        }
    }
});
//# sourceMappingURL=boot.js.map