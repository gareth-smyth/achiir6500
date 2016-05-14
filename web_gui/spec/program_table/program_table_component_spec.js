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
            let programTable = ReactDOM.render(<ProgramTableComponent programs={[{id:'existing', steps:[]}]}/>, node);
            ReactDOM.render(<ProgramTableComponent
                programs={[{id:'existing', steps:[]}, {id:'new', steps:[]}]}/>, node);

            expect(programTable.getRow('existing')).not.toBe(undefined);
            expect(programTable.getRow('new')).not.toBe(undefined);
            expect(programTable.getRow('new').dirty).toBe(false);
            expect(programTable.getRow('new').queueDelete).toBe(false);
        });

        it("updates step values for matching programs", function () {
            let node = document.createElement('div');
            let programTable = ReactDOM.render(<ProgramTableComponent
                programs={[{id:'existing', steps:[{ramp:4, level:4, dwell:6}]}]}/>, node);
            ReactDOM.render(<ProgramTableComponent
                programs={[{id:'existing', steps:[{ramp:1, level:2, dwell:3}]}]}/>, node);

            expect(programTable.getRow('existing').Ramp1).toEqual(1);
            expect(programTable.getRow('existing').Level1).toEqual(2);
            expect(programTable.getRow('existing').Dwell1).toEqual(3);
        });

        it("updates dirty, selected, and deleting flags for changes to existing programs", function () {
            let node = document.createElement('div');
            let programTable = ReactDOM.render(<ProgramTableComponent
                programs={[{id:'existing', steps:[{ramp:4, level:5, dwell:6}]}]}/>, node);
            ReactDOM.render(<ProgramTableComponent
                programs={[{id:'existing', steps:[{ramp:4, level:5, dwell:6}]}]}/>, node);

            programTable.getRow('existing').dirty = 1;
            programTable.getRow('existing').isSelected = 2;
            programTable.getRow('existing').queueDelete = 3;

            ReactDOM.render(<ProgramTableComponent
                programs={[{id:'existing', steps:[{ramp:1, level:2, dwell:3}]}]}/>, node);

            expect(programTable.getRow('existing').dirty).toEqual(false);
            expect(programTable.getRow('existing').isSelected).toEqual(false);
            expect(programTable.getRow('existing').queueDelete).toEqual(false);
        });

        /* This is testing current functionality as a test added after the code was written.  I think it is only needed
         because we get into endless update loops when we send changes up the event chain and the parent sees changes
         and sends them back to us.  I.e. we need to ignore changes with no actual updates in the row data. 
         */
        it("does not update dirty, selected, and deleting flags for NO changes to existing programs", function () {
            let node = document.createElement('div');
            let programTable = ReactDOM.render(<ProgramTableComponent
                programs={[{id:'existing', steps:[{ramp:1, level:2, dwell:3}]}]}/>, node);
            ReactDOM.render(<ProgramTableComponent
                programs={[{id:'existing', steps:[{ramp:1, level:2, dwell:3}]}]}/>, node);

            programTable.getRow('existing').dirty = 1;
            programTable.getRow('existing').isSelected = 2;
            programTable.getRow('existing').queueDelete = 3;

            ReactDOM.render(<ProgramTableComponent
                programs={[{id:'existing', steps:[{ramp:1, level:2, dwell:3}]}]}/>, node);

            expect(programTable.getRow('existing').dirty).toEqual(1);
            expect(programTable.getRow('existing').isSelected).toEqual(2);
            expect(programTable.getRow('existing').queueDelete).toEqual(3);
        });
    });

    it("calls the row selected callback when a row is selected", function () {
        let node = document.createElement('div');
        var rowSelected;
        let selectProgram = (rowId) => {
            rowSelected = rowId;
        };
        let programTable = ReactDOM.render(
            <ProgramTableComponent programs={[{id:'existing', steps:[{ramp:1, level:2, dwell:3}]}]}
                                   onSelectProgram={selectProgram}/>, node);
        ReactDOM.render(
            <ProgramTableComponent
                programs={[{id:'existing', steps:[{ramp:1, level:2, dwell:3}]}]}
                onSelectProgram={selectProgram}/>, node);

        programTable.onRowSelect([{id: 1234}]);

        expect(rowSelected).toEqual(1234);
    });
});