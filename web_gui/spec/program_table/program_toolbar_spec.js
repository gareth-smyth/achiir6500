jest.unmock("../../app/program_table/program_toolbar");

var React = require("react");
var ReactDOM = require("react-dom");
var TestUtils = require("react-addons-test-utils");
var ProgramToolbar = require("../../app/program_table/program_toolbar");

describe("Program Toolbar", () => {
    const ROW_SELECTED = true, PROGRAM_RUNNING = true, HAS_CHANGES = true, SELECTED_PENDING_DELETE = true;
    const NO_ROW_SELECTED = false, NO_PROGRAM_RUNNING = false, NO_CHANGES = false, SELECTED_NOT_PENDING_DELETE = false;
    const ENABLED = true, DISABLED = false;

    describe("Run program button", function () {
        it("contains the correct help text when enabled", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(ENABLED, "Run Program", "Send the selected program to the reflow station.");
        });

        it("is disabled and contains the correct help text during run", function () {
            this.loadComponent(ROW_SELECTED, PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Run Program", "Cannot perform any actions while a program is running.");
        });

        it("is disabled and contains the correct help text when no row is selected", function () {
            this.loadComponent(NO_ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Run Program", "No program selected to run.");
        });

        it("is disabled and contains the correct help text when changes have been made", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, HAS_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Run Program", "Cannot run any programs until all changes are saved.");
        });

        it("is disabled and contains the correct help text when row is being deleted", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Run Program", "Cannot run program being deleted.");
        });
    });

    describe("Delete program button", function () {
        it("contains the correct help text when enabled", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(ENABLED, "Delete Program", "Delete the program.  Will only delete locally - use Save Changes to push to the server.");
        });

        it("is disabled and contains the correct help text during run", function () {
            this.loadComponent(ROW_SELECTED, PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Delete Program", "Cannot perform any actions while a program is running.");
        });

        it("is disabled and contains the correct help text when no row is selected", function () {
            this.loadComponent(NO_ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Delete Program", "No program selected to delete.");
        });

        it("is disabled and contains the correct help text row is already queued for deletion", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Delete Program", "Selected program already queued for deletion.  Use Save Changes to finish deleting.");
        });
    });

    describe("Add program button", function () {
        it("contains the correct help text when enabled and row selected", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(ENABLED, "Add Program", "Add a new program.");
        });

        it("contains the correct help text when enabled and no row selected", function () {
            this.loadComponent(NO_ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(ENABLED, "Add Program", "Add a new program.");
        });

        it("is disabled and contains the correct help text during run", function () {
            this.loadComponent(ROW_SELECTED, PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Add Program", "Cannot perform any actions while a program is running.");
        });
    });

    describe("Save changes button", function () {
        it("contains the correct help text when enabled and row selected", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, HAS_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(ENABLED, "Save All Changes", "Save all the changes and deletions to the server.");
        });

        it("contains the correct help text when enabled an no row selected", function () {
            this.loadComponent(NO_ROW_SELECTED, NO_PROGRAM_RUNNING, HAS_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(ENABLED, "Save All Changes", "Save all the changes and deletions to the server.");
        });
        
        it("is disabled and contains the correct help text during run", function () {
            this.loadComponent(ROW_SELECTED, PROGRAM_RUNNING, HAS_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Save All Changes", "Cannot perform any actions while a program is running.");
        });

        it("is disabled and contains the correct help text when no changes to save", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Save All Changes", "No changes to save.");
        });
    });

    describe("Reset changes button", function () {
        it("contains the correct help text when enabled and row selected", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, HAS_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(ENABLED, "Reset All Changes", "Reset all changes made that have not been saved.");
        });

        it("contains the correct help text when enabled an no row selected", function () {
            this.loadComponent(NO_ROW_SELECTED, NO_PROGRAM_RUNNING, HAS_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(ENABLED, "Reset All Changes", "Reset all changes made that have not been saved.");
        });

        it("is disabled and contains the correct help text during run", function () {
            this.loadComponent(ROW_SELECTED, PROGRAM_RUNNING, HAS_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Reset All Changes", "Cannot perform any actions while a program is running.");
        });

        it("is disabled and contains the correct help text when no changes to reset", function () {
            this.loadComponent(ROW_SELECTED, NO_PROGRAM_RUNNING, NO_CHANGES, SELECTED_NOT_PENDING_DELETE);
            expect(this.buttonsList).toContainButtonWithHelpText(DISABLED, "Reset All Changes", "No changes to reset.");
        });
    });

    beforeEach(function () {
        jasmine.addMatchers({
            toContainButtonWithHelpText: function () {
                return {
                    compare: function (buttonsList, enabled, value, title) {
                        var nonMatchingButtons = [];
                        var foundButton = buttonsList.find(button => {
                            if (button.value === value && button.title === title && button.disabled==!enabled) return true;
                            var buttonEnabled = button.disabled ? "(disabled)" : "(enabled)";
                            nonMatchingButtons.push(`{Value:${button.value};title:${button.title};${buttonEnabled}}`);
                        });

                        var result = {};
                        if (foundButton == undefined) {
                            var expectedEnabled = enabled ? "(enabled)" : "(disabled)";
                            result = {
                                pass: false,
                                message: `Expected\n\t\t{Value:${value};title:${title};${expectedEnabled}}\nbut found buttons\n\t\t${nonMatchingButtons.join("\n\t\t")}.`
                            };
                        } else {
                            result = {pass: true}
                        }
                        return result;
                    }
                }
            }
        });
        this.loadComponent = function(hasSelectedRow, programRunning, hasChanges, pendingDelete) {
            var toolbarComponent = TestUtils.renderIntoDocument(
                <ProgramToolbar hasSelectedRow={hasSelectedRow} programRunning={programRunning} hasChanges={hasChanges} 
                                selectedRowQueuedDelete={pendingDelete}/>
            );
            this.buttonsList = TestUtils.scryRenderedDOMComponentsWithClass(toolbarComponent, "btn");
        };
    });
});