jest.unmock("../../app/program_table/program_table_row_renderer");

var React = require("react");
var ReactDOM = require("react-dom");
var TestUtils = require("react-addons-test-utils");
var {ProgramTableRowRenderer} = require("../../app/program_table/program_table_row_renderer");

describe("Program Table", () => {
    it("creates a row renderer with no class if not queued delete or dirty", function () {
        let rowRenderer = TestUtils.renderIntoDocument(<ProgramTableRowRenderer row={{}} cellMetaData={{}}
                                                                                columns={[]}/>);

        let rowDiv = TestUtils.scryRenderedDOMComponentsWithTag(rowRenderer, 'div')[0];
        expect(rowDiv.getAttribute("class")).toEqual(null);
    });

    it("creates a row renderer with deleting class when queueDelete row", function () {
        let rowRenderer = TestUtils.renderIntoDocument(<ProgramTableRowRenderer row={{queueDelete:true}}
                                                                                cellMetaData={{}}
                                                                                columns={[]}/>);

        let rowDiv = TestUtils.scryRenderedDOMComponentsWithTag(rowRenderer, 'div')[0];
        expect(rowDiv.getAttribute("class")).toEqual('deleting');
    });

    it("creates a row renderer with dirty class when dirty row", function () {
        let rowRenderer = TestUtils.renderIntoDocument(<ProgramTableRowRenderer row={{dirty:true}} cellMetaData={{}}
                                                                                columns={[]}/>);

        let rowDiv = TestUtils.scryRenderedDOMComponentsWithTag(rowRenderer, 'div')[0];
        expect(rowDiv.getAttribute("class")).toEqual('dirty');
    });

    it("has a set scroll left method", function(){
        // This is a weird test as it is just testing that a function exists without testing its implementation
        // but the implementation always needs to defer to the reactdatagrid implementation
        let rowRenderer = TestUtils.renderIntoDocument(<ProgramTableRowRenderer row={{}} cellMetaData={{}}
                                                                                columns={[]}/>);

        expect(rowRenderer.setScrollLeft).toEqual(jasmine.any(Function));
        rowRenderer.setScrollLeft(); // For simple coverage fix
    });
});