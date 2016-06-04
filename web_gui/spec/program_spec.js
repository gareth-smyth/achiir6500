jest.unmock("../app/program");
jest.unmock('react');

var React = require("react");
var ReactDOM = require("react-dom");
var ProgramService = require("../app/program_service");
var TestUtils = require("react-addons-test-utils");
var {Program} = require("../app/program");
var {ProgramChart} = require("../app/program_chart");
var { ProgramTableComponent }= require("../app/program_table/program_table_component");

describe("Program", () => {
    var NOT_PROMISE = true;
    
    function mockProgramService(call, response, notPromise) {
        notPromise = notPromise | false;
        ProgramService[call] = jest.fn().mockImplementation(function () {
            if(notPromise){
                return response;    
            }else {
                return {
                    then: function (fn) {
                        fn(response);
                    }
                }
            }
        });
    }

    beforeEach(function () {
        mockProgramService('get', [1, 2, 3]);
        mockProgramService('savePrograms', null);
        mockProgramService('deletePrograms', null);
        mockProgramService('runProgram', true, NOT_PROMISE);
    });

    it("loads initial program data on mount", function () {
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        expect(programComponent.state.programs).toEqual([1, 2, 3]);
    });

    it("updates programs when requested", function () {
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        programComponent.updatePrograms([4, 5, 6]);
        expect(programComponent.state.programs).toEqual([4, 5, 6]);
    });

    it("resets programs when requested", function () {
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        mockProgramService('get', [7, 8, 9]);
        programComponent.resetPrograms();
        expect(programComponent.state.programs).toEqual([7, 8, 9]);
    });

    it("saves programs when request save", function(){
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        programComponent.savePrograms();
        expect(ProgramService.savePrograms.mock.calls.length).toBe(1);
    });

    it("deletes programs when request save", function(){
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        programComponent.savePrograms();
        expect(ProgramService.deletePrograms.mock.calls.length).toBe(1);
    });
    
    it("set programRunning to false when run program is unsuccessful", function () {
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        mockProgramService('runProgram', false, NOT_PROMISE);
        programComponent.runProgram();
        expect(programComponent.state.programRunning).toBe(false);
    });

    it("sets programRunning to true when run program is successful", function () {
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        programComponent.runProgram();
        expect(programComponent.state.programRunning).toBe(true);
    });

    it("sets programRun to service supplied value when run program is successful and finished is false", function () {
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        mockProgramService('getCurrentProgramRun', {finished: false});
        programComponent.runProgram();
        jest.runOnlyPendingTimers();
        expect(programComponent.state.programRun).toEqual({finished: false});
    });

    it("sets programRun to service supplied value when run program is successful and finished is true", function () {
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        mockProgramService('getCurrentProgramRun', {finished: true});
        programComponent.runProgram();
        jest.runOnlyPendingTimers();
        expect(programComponent.state.programRun).toEqual({finished: true});
    });
    
    it("updates the selected program state when callback called", function(){
        let programComponent = TestUtils.renderIntoDocument(<Program/>);
        programComponent.selectProgram(1234);
        expect(programComponent.state.selectedProgram).toEqual(1234);
    });
    
    describe("Callbacks", function () {
        it("creates a ProgramChart component", function () {
            let programComponent = TestUtils.renderIntoDocument(<Program/>);

            let programChart = TestUtils.findRenderedComponentWithType(programComponent, ProgramChart);
            expect(programChart).not.toBeNull();
            expect(programChart.props.programs).toEqual([1, 2, 3]);
            expect(programChart.props.selectedProgram).not.toBeNull();
            expect(programChart.props.programRun).not.toBeNull();
        });

        it("creates a ProgramTableComponent component", function () {
            let programComponent = TestUtils.renderIntoDocument(<Program/>);

            let programTable = TestUtils.findRenderedComponentWithType(programComponent, ProgramTableComponent);
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