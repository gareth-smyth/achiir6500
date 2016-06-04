jest.unmock("../app/program_chart");

var React = require("react");
var ReactDOM = require("react-dom");
var TestUtils = require("react-addons-test-utils");
var {ProgramChart} = require("../app/program_chart");
var Sparklines = require('react-sparklines').Sparklines;

describe("Program Table", () => {
    var emptyPrograms = [{steps: []}];
    var emptyRunData = {data_points: []};

    it("creates program data chart components", () => {
        let programTable = TestUtils.renderIntoDocument(<ProgramChart/>);
        programTable.config = {secondsPerTick: 1};

        let programDataCharts = TestUtils.scryRenderedComponentsWithType(programTable, Sparklines);
        expect(programDataCharts.length).toBe(2);
    });

    it("generates chart data for program run", () => {
        let node = document.createElement('div');
        var runData = {
            data_points: [
                {timestamp: new Date(0).toISOString("dd/MM/yyyy HH:mm:ss fff"), value: 1},
                {timestamp: new Date(500).toISOString("dd/MM/yyyy HH:mm:ss fff"), value: 2},
                {timestamp: new Date(1002).toISOString("dd/MM/yyyy HH:mm:ss fff"), value: 3},
                {timestamp: new Date(1500).toISOString("dd/MM/yyyy HH:mm:ss fff"), value: 4},
                {timestamp: new Date(2003).toISOString("dd/MM/yyyy HH:mm:ss fff"), value: 5}
            ]
        };

        let programTable = ReactDOM.render(<ProgramChart programRun={runData} programs={emptyPrograms}/>, node);
        programTable.config = {secondsPerTick: 1};
        ReactDOM.render(<ProgramChart programRun={runData} programs={emptyPrograms}/>, node);

        expect(programTable.state.runData).toEqual([3, 5]);
    });

    it("generates no chart data for program run with no data points", () => {
        let node = document.createElement('div');
        var runData = { };

        let programTable = ReactDOM.render(<ProgramChart programRun={runData} programs={emptyPrograms}/>, node);
        ReactDOM.render(<ProgramChart programRun={runData} programs={emptyPrograms}/>, node);

        expect(programTable.state.runData).toEqual([]);
    });
    
    it("generates chart data for program", () => {
        let node = document.createElement('div');
        var programs = [
            {
                id:0,
                steps:[
                    {level: 10, ramp:5, dwell:0},
                    {level: 13, ramp:1, dwell:1},
                    {level: 18, ramp:4, dwell:2}   // This will only rise to 17 then dwell at 18 - the last ramp is
                                                   // missed as it would take it ABOVE 18.
                ]
            }
        ];

        let programTable = ReactDOM.render(<ProgramChart programRun={emptyRunData} programs={programs}/>, node);
        programTable.config = {secondsPerTick: 1};
        ReactDOM.render(<ProgramChart programRun={emptyRunData} programs={programs}/>, node);

        expect(programTable.state.chartData).toEqual([0, 5, 10, 11, 12, 13, 13, 17, 18, 18]);
    });

    it("generates no chart data for program or program run when there are no programs", () => {
        let node = document.createElement('div');
        let runData = {
            data_points: [
                {timestamp: new Date(0).toISOString("dd/MM/yyyy HH:mm:ss fff"), value: 1}
            ]
        };
        let programs = [];

        let programTable = ReactDOM.render(<ProgramChart programRun={runData} programs={programs}/>, node);
        ReactDOM.render(<ProgramChart programRun={runData} programs={programs}/>, node);

        expect(programTable.state.runData).toEqual([]);
        expect(programTable.state.chartData).toEqual([]);
    });
});