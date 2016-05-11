jest.unmock("../app/program");
jest.unmock("promise");

var React = require("react");
var ReactDOM = require("react-dom");
var Promise = require("promise");
var ProgramService = require("../app/program_service");
var TestUtils = require("react-addons-test-utils");
var Program = require("../app/program");
var ProgramChart = require("../app/program_chart");
var ProgramTable = require("../app/program_table/program_table_component");

describe("Program", () => {
    describe("Callbacks", function () {
        it("creates a ProgramChart component", function () {
            ProgramService.get = jest.fn().mockImplementation(function(){
                return {
                    then: function (fn) {
                        fn([1, 2, 3]);
                    }
                }
            });

            let programComponent = TestUtils.renderIntoDocument(<Program/>);
            
            let programChart = TestUtils.findRenderedComponentWithType(programComponent, ProgramChart);
            expect(programChart).not.toBeNull();
            expect(programChart.props.programs).toEqual([1, 2, 3]);
            expect(programChart.props.selectedProgram).not.toBeNull();
            expect(programChart.props.programRun).not.toBeNull();
        });

        it("creates a ProgramTable component", function () {
            ProgramService.get = jest.fn().mockImplementation(function(){
                return {
                    then: function (fn) {
                        fn([1, 2, 3]);
                    }
                }
            });

            let programComponent = TestUtils.renderIntoDocument(<Program/>);

            let programTable = TestUtils.findRenderedComponentWithType(programComponent, ProgramTable);
            expect(programTable).not.toBeNull();
            expect(programTable.props.programs).toEqual([1, 2, 3]);
            expect(programTable.props.programRunning).toBe(false);
            expect(programTable.props.onProgramsChanged).toEqual(jasmine.any(Function));
            expect(programTable.props.onReset).toEqual(jasmine.any(Function));
            expect(programTable.props.onSave).toEqual(jasmine.any(Function));
            expect(programTable.props.onRun).toEqual(jasmine.any(Function));
            expect(programTable.props.onSelectProgram).toEqual(jasmine.any(Function));
        });
    });
});