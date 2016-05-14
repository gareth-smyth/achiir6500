jest.unmock("../../app/program_table/program_table_component");

var React = require("react");
var ReactDOM = require("react-dom");
var TestUtils = require("react-addons-test-utils");
var ReactDataGrid = require('react-data-grid/addons');
var { ProgramToolbar } = require("../../app/program_table/program_toolbar");
var { ProgramTableComponent } = require("../../app/program_table/program_table_component");

describe("Program Table", () => {
    describe("Components", function () {
        it("creates a ProgramToolbar component", function () {
            let programTable = TestUtils.renderIntoDocument(<ProgramTableComponent/>);

            let programChart = TestUtils.findRenderedComponentWithType(programTable, ProgramToolbar);
            expect(programChart).not.toBeNull();
        });

        it("creates a Datagrid component", function () {
            let programTable = TestUtils.renderIntoDocument(<ProgramTableComponent/>);

            let datagrid = TestUtils.findRenderedComponentWithType(programTable, ReactDataGrid);
            expect(datagrid).not.toBeNull();
        });
    });
});