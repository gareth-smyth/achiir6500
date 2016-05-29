jest.unmock("../app/program_table/program_table_component");
jest.unmock("../app/program_table/program_toolbar");
jest.unmock("../app/program_table/program_table_row_renderer");
jest.unmock("../app/program");
jest.unmock("react-data-grid/addons");
jest.unmock("promise");
jest.unmock("uuid-js");

var React = require("react");
var ReactDOM = require("react-dom");
var TestUtils = require("react-addons-test-utils");
var {Program} = require("../app/program");
var ProgramService = require("../app/program_service");
var Promise = require("promise");

describe("Program Toolbar", () => {
    describe("Scenarios", function () {
        it("Save all changes is enabled when row is selected for deletion", function () { 
            this.loadComponent();
            TestUtils.Simulate.click(this.addProgramButton);
            TestUtils.Simulate.click(this.saveAllChangesButton);

            var checkBox = TestUtils.findRenderedDOMComponentWithClass(this.programComponent, "react-grid-checkbox-label");
            TestUtils.Simulate.click(checkBox);
            TestUtils.Simulate.click(this.deleteProgramButton);
            expect(this.saveAllChangesButton.disabled).toBe(false);
        });
    });

    beforeEach(function () {
        ProgramService.get = jest.genMockFunction().mockImplementation(function(){
            return new Promise(function (resolve, reject) {
                resolve([]);
            });
        });
        
        ProgramService.savePrograms = jest.genMockFunction().mockImplementation(function(){
            return new Promise(function (resolve, reject) {
                resolve();
            });
        });
        
        ProgramService.deletePrograms = jest.genMockFunction().mockImplementation(function(){
            return new Promise(function (resolve, reject) {
                resolve();
            });
        });
        
        this.loadComponent = function() {
            this.programComponent = TestUtils.renderIntoDocument(
                <Program/>
            );
            this.programNode = ReactDOM.findDOMNode(this.programComponent);
            this.buttonsList = TestUtils.scryRenderedDOMComponentsWithClass(this.programComponent, "btn");
            this.addProgramButton = this.buttonsList.find(function(button){
                return button.value==="Add Program";
            });
            this.deleteProgramButton = this.buttonsList.find(function(button){
                return button.value==="Delete Program";
            });
            this.saveAllChangesButton = this.buttonsList.find(function(button){
                return button.value==="Save All Changes";
            });
        };
    });
});
