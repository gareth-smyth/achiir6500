jest.unmock("../../app/program_table/program_table_component");

var React = require("react");
var ReactDOM = require("react-dom");
var TestUtils = require("react-addons-test-utils");
var ReactDataGrid = require('react-data-grid/addons');
var {ProgramToolbar} = require("../../app/program_table/program_toolbar");
var {ProgramTableComponent} = require("../../app/program_table/program_table_component");

describe("Program Table", () => {
    describe("components", function () {
        it("creates a ProgramToolbar component", function () {
            let programTable = TestUtils.renderIntoDocument(<ProgramTableComponent/>);

            let programChart = TestUtils.findRenderedComponentWithType(programTable, ProgramToolbar);
            expect(programChart).not.toBeNull();
        });

        it("creates a Datagrid component", function () {
            let programTable = TestUtils.renderIntoDocument(<ProgramTableComponent/>);

            let dataGrid = TestUtils.findRenderedComponentWithType(programTable, ReactDataGrid);
            expect(dataGrid).not.toBeNull();
        });
    });

    describe("merging new program prop", function () {
        it("adds new rows marked as not dirty when new rows exist in props and none currently exist", function () {
            let node = document.createElement('div');
            let programTable = ReactDOM.render(<ProgramTableComponent programs={[]}/>, node);
            ReactDOM.render(<ProgramTableComponent programs={[{id:'new', steps:[]}]}/>, node);

            expect(programTable.getRow('new').dirty).not.toBe(undefined);
            expect(programTable.getRow('new').dirty).toBe(false);
            expect(programTable.getRow('new').queueDelete).toBe(false);
        });

        it("adds new rows marked as not dirty when new rows exist in props and some currently exist", function () {
            let node = document.createElement('div');
            let programTable = ReactDOM.render(<ProgramTableComponent programs={[{id:'1', steps:[]}]}/>, node);
            ReactDOM.render(<ProgramTableComponent
                programs={[{id:'1', steps:[]}, {id:'new', steps:[]}]}/>, node);

            expect(programTable.getRow('1')).not.toBe(undefined);
            expect(programTable.getRow('new')).not.toBe(undefined);
            expect(programTable.getRow('new').dirty).toBe(false);
            expect(programTable.getRow('new').queueDelete).toBe(false);
        });

        it("updates step values for matching programs", function () {
            let node = document.createElement('div');
            let programTable = ReactDOM.render(<ProgramTableComponent
                programs={[{id:'1', steps:[{ramp:4, level:4, dwell:6}]}]}/>, node);
            ReactDOM.render(<ProgramTableComponent
                programs={[program(1)]}/>, node);

            expect(programTable.getRow('1').Ramp1).toEqual(1);
            expect(programTable.getRow('1').Level1).toEqual(2);
            expect(programTable.getRow('1').Dwell1).toEqual(3);
        });

        it("updates dirty, selected, and deleting flags for changes to existing programs", function () {
            let node = document.createElement('div');
            let programTable = ReactDOM.render(<ProgramTableComponent
                programs={[{id:'1', steps:[{ramp:4, level:5, dwell:6}]}]}/>, node);
            ReactDOM.render(<ProgramTableComponent
                programs={[{id:'1', steps:[{ramp:4, level:5, dwell:6}]}]}/>, node);

            programTable.getRow('1').dirty = 1;
            programTable.getRow('1').isSelected = 2;
            programTable.getRow('1').queueDelete = 3;

            ReactDOM.render(<ProgramTableComponent
                programs={[program(1)]}/>, node);

            expect(programTable.getRow('1').dirty).toEqual(false);
            expect(programTable.getRow('1').isSelected).toEqual(false);
            expect(programTable.getRow('1').queueDelete).toEqual(false);
        });

        /* This is testing current functionality as a test added after the code was written.  I think it is only needed
         because we get into endless update loops when we send changes up the event chain and the parent sees changes
         and sends them back to us.  I.e. we need to ignore changes with no actual updates in the row data. 
         */
        it("does not update dirty, selected, and deleting flags for NO changes to existing programs", function () {
            let node = document.createElement('div');
            let programTable = ReactDOM.render(<ProgramTableComponent
                programs={[program(1)]}/>, node);
            ReactDOM.render(<ProgramTableComponent
                programs={[program(1)]}/>, node);

            programTable.getRow('1').dirty = 1;
            programTable.getRow('1').isSelected = 2;
            programTable.getRow('1').queueDelete = 3;

            ReactDOM.render(<ProgramTableComponent
                programs={[program(1)]}/>, node);

            expect(programTable.getRow('1').dirty).toEqual(1);
            expect(programTable.getRow('1').isSelected).toEqual(2);
            expect(programTable.getRow('1').queueDelete).toEqual(3);
        });
    });

    it("calls the row selected callback when a row is selected", function () {
        let node = document.createElement('div');
        var rowSelected = [];
        let selectProgram = (rowId) => {
            rowSelected = rowId;
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]}
                                   onSelectProgram={selectProgram}/>, node);
        ReactDOM.render(
            <ProgramTableComponent
                programs={[program(1)]}
                onSelectProgram={selectProgram}/>, node);

        programTable.onRowSelect([{id: 1234}]);

        expect(rowSelected).toEqual(1234);
    });

    it("calls the row updated callback when a row is changed", function () {
        let node = document.createElement('div');
        var programsUpdated = [];
        let updateProgram = (programs) => {
            programsUpdated = programs;
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]}
                                   onProgramsChanged={updateProgram}/>, node);
        ReactDOM.render(
            <ProgramTableComponent
                programs={[program(1)]}
                onProgramsChanged={updateProgram}/>, node);

        programTable.onRowUpdated({
            rowIdx: 0,
            updated: {id: '1', name: 'hello', loop_counter: 123, Ramp1: 5, Level1: 6, Dwell1: 7}
        });

        expect(programsUpdated[0].id).toEqual('1');
        expect(programsUpdated[0].name).toEqual('hello');
        expect(programsUpdated[0].loop_counter).toEqual(123);
        expect(programsUpdated[0].steps[0]).toEqual({ramp: 5, level: 6, dwell: 7});
    });

    it("sets the row to dirty when a row is changed", function () {
        let node = document.createElement('div');
        var programsUpdated;
        let updateProgram = (programs) => {
            programsUpdated = programs;
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]}
                                   onProgramsChanged={updateProgram}/>, node);
        ReactDOM.render(
            <ProgramTableComponent
                programs={[program(1)]}
                onProgramsChanged={updateProgram}/>, node);

        programTable.onRowUpdated({
            rowIdx: 0,
            updated: {id: '1', name: 'hello', loop_counter: 123, Ramp1: 5, Level1: 6, Dwell1: 7}
        });

        expect(programTable.state.rows[0].dirty).toBe(true);
    });

    it("sets the row to queueDelete false when a row is changed", function () {
        let node = document.createElement('div');
        var programsUpdated;
        let updateProgram = (programs) => {
            programsUpdated = programs;
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]}
                                   onProgramsChanged={updateProgram}/>, node);
        ReactDOM.render(
            <ProgramTableComponent
                programs={[program(1)]}
                onProgramsChanged={updateProgram}/>, node);

        programTable.state.rows[0].queueDelete = true;
        programTable.onRowUpdated({
            rowIdx: 0,
            updated: {id: '1', name: 'hello', loop_counter: 123, Ramp1: 5, Level1: 6, Dwell1: 7}
        });

        expect(programTable.state.rows[0].queueDelete).toBe(false);
    });

    it("calls the run program callback when a program is executed", function () {
        let node = document.createElement('div');
        let programRun = [];
        let runProgram = (programId) => {
            programRun = programId;
        };
        let selectProgram = (rowId) => {
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]}
                                   onSelectProgram={selectProgram} onRun={runProgram}/>, node);
        ReactDOM.render(
            <ProgramTableComponent
                programs={[program(1)]}
                onSelectProgram={selectProgram} onRun={runProgram}/>, node);

        programTable.onRowSelect([{id: '1'}]);
        programTable.runProgram();

        expect(programRun).toEqual('1');
    });

    it("calls the on save callback when save requested", function () {
        let node = document.createElement('div');
        let dirtyPrograms = [], deletingPrograms = [];
        let savePrograms = (dirty, deleting) => {
            dirtyPrograms = dirty;
            deletingPrograms = deleting;
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1), program(2), program(3), program(4)]}
                                   onSave={savePrograms} onProgramsChanged={()=>{}}/>, node);
        ReactDOM.render(
            <ProgramTableComponent programs={[program(1), program(2), program(3), program(4)]}
                                   onSave={savePrograms} onProgramsChanged={()=>{}}/>, node);

        programTable.state.rows[0].dirty = true;
        programTable.state.rows[1].queueDelete = true;
        programTable.state.rows[2].dirty = true;
        programTable.state.rows[3].queueDelete = true;

        programTable.saveAllPrograms();

        expect(dirtyPrograms.map((program) => {
            return program.id
        })).toEqual([1, 3]);
        expect(deletingPrograms.map((program) => {
            return program.id
        })).toEqual([2, 4]);
    });

    it("resets the dirty flag for saved programs", function () {
        let node = document.createElement('div');
        let dirtyPrograms = [], deletingPrograms = [];
        let savePrograms = (dirty, deleting) => {
            dirtyPrograms = dirty;
            deletingPrograms = deleting;
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1), program(2), program(3), program(4)]}
                                   onSave={savePrograms} onProgramsChanged={()=>{}}/>, node);
        ReactDOM.render(
            <ProgramTableComponent programs={[program(1), program(2), program(3), program(4)]}
                                   onSave={savePrograms} onProgramsChanged={()=>{}}/>, node);

        programTable.state.rows[0].dirty = true;
        programTable.state.rows[1].queueDelete = true;
        programTable.state.rows[2].dirty = true;
        programTable.state.rows[3].queueDelete = true;

        programTable.saveAllPrograms();

        expect(programTable.state.rows.map((row) => {
            return row.dirty
        })).toEqual([false, false]);
    });

    it("deletes rows queued for delete on save", function () {
        let node = document.createElement('div');
        let dirtyPrograms = [], deletingPrograms = [];
        let savePrograms = (dirty, deleting) => {
            dirtyPrograms = dirty;
            deletingPrograms = deleting;
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1), program(2), program(3), program(4)]}
                                   onSave={savePrograms} onProgramsChanged={()=>{}}/>, node);
        ReactDOM.render(
            <ProgramTableComponent programs={[program(1), program(2), program(3), program(4)]}
                                   onSave={savePrograms} onProgramsChanged={()=>{}}/>, node);

        programTable.state.rows[0].dirty = true;
        programTable.state.rows[1].queueDelete = true;
        programTable.state.rows[2].dirty = true;
        programTable.state.rows[3].queueDelete = true;

        programTable.saveAllPrograms();

        expect(programTable.state.rows.map((row) => {
            return row.id
        })).toEqual([1, 3]);
    });

    it("sets selected row queueDelete and dirty false when deleteProgram called", function () {
        let node = document.createElement('div');
        var programsUpdated;
        let updateProgram = (programs) => {
            programsUpdated = programs;
        };
        let selectProgram = (rowId) => {
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]} onSelectProgram={selectProgram}
                                   onProgramsChanged={updateProgram}/>, node);
        ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]} onSelectProgram={selectProgram}
                                   onProgramsChanged={updateProgram}/>, node);

        programTable.onRowUpdated({
            rowIdx: 0,
            updated: {id: '1', name: 'hello', loop_counter: 123, Ramp1: 5, Level1: 6, Dwell1: 7}
        });
        programTable.onRowSelect([{id: '1'}]);

        expect(programTable.state.rows[0].queueDelete).toBe(false);
        expect(programTable.state.rows[0].dirty).toBe(true);

        programTable.deleteProgram();

        expect(programTable.state.rows[0].queueDelete).toBe(true);
        expect(programTable.state.rows[0].dirty).toBe(false);
    });

    it("calls programs changed callback when program added", function () {
        let node = document.createElement('div');
        var programsUpdated = [];
        let updateProgram = (programs) => {
            programsUpdated = programs;
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]}
                                   onProgramsChanged={updateProgram}/>, node);
        ReactDOM.render(
            <ProgramTableComponent
                programs={[program(1)]}
                onProgramsChanged={updateProgram}/>, node);

        programTable.addProgram();

        expect(programsUpdated[1].name).toEqual('New Program');
        expect(programsUpdated[1].loop_counter).toEqual(1);
        expect(programsUpdated[1].steps[0]).toEqual({ramp: 0.1, level: 0, dwell: 0});
    });

    it("sends programming running to the toolbar when it is running", function () {
        let node = document.createElement('div');
        let programTable = ReactDOM.render(<ProgramTableComponent programs={[program(1)]}
                                                                  programRunning={true}/>, node);
        ReactDOM.render(<ProgramTableComponent programs={[program(1)]} programRunning={true}/>, node);

        let programChart = TestUtils.findRenderedComponentWithType(programTable, ProgramToolbar);
        expect(programChart.props.programRunning).toBe(true);
    });

    it("sends selected row queued delete to the toolbar", function () {
        let node = document.createElement('div');
        var programsUpdated;
        let updateProgram = (programs) => {
            programsUpdated = programs;
        };
        let selectProgram = (rowId) => {
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]} onSelectProgram={selectProgram}
                                   onProgramsChanged={updateProgram}/>, node);
        ReactDOM.render(
            <ProgramTableComponent programs={[program(1)]} onSelectProgram={selectProgram}
                                   onProgramsChanged={updateProgram}/>, node);

        programTable.onRowSelect([{id: '1', queueDelete: true}]);

        let programChart = TestUtils.findRenderedComponentWithType(programTable, ProgramToolbar);
        expect(programChart.props.selectedRowQueuedDelete).toBe(true);
    });

    function program(id) {
        let idsq = id * id;
        return {id: id, steps: [{ramp: idsq, level: idsq + 1, dwell: idsq + 2}]};
    }
});