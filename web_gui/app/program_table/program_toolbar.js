var React = require('react');

module.exports = React.createClass({
    render: function () {
        var programRunningMessage = 'Cannot perform any actions while a program is running.';

        var cantRunToolTip = this.props.programRunning ? programRunningMessage : (this.props.hasChanges ? "Cannot run any porgrams until all changes are saved." : this.props.selectedRowQueuedDelete ? 'Cannot run program being deleted.' : 'No program selected to run.');
        var runToolTip = "Send the selected program to the reflow station.";
        var runDisabled = !this.props.hasSelectedRow || this.props.selectedRowQueuedDelete || this.props.hasChanges || this.props.programRunning;

        var cantDeleteToolTip = this.props.programRunning ? programRunningMessage : (this.props.hasSelectedRow ? 'Selected program already queued for deletion.  Use Save Changes to finish deleting.' : 'No program selected to delete.');
        var deleteToolTip = "Delete the program.  Will only delete locally - use Save Changes to push to the server.";
        var deleteDisabled = !this.props.hasSelectedRow || this.props.selectedRowQueuedDelete || this.props.programRunning;

        var cantSaveToolTip = this.props.programRunning ? programRunningMessage : 'No changes to save.';
        var saveToolTip = "Save all the changes and deletions to the server.";
        var saveDisabled = !this.props.hasChanges || this.props.programRunning;

        var cantResetToolTip =  this.props.programRunning ? programRunningMessage : 'No changes to reset.';
        var resetToolTip = "Reset all changes made that have not been saved.";
        var resetDisabled = !this.props.hasChanges || this.props.programRunning;

        var cantAddProgramToolTip = programRunningMessage;
        var addProgramToolTip = "Add a new program.";
        var addProgramDisabled = this.props.programRunning;

        return <div>
            <input className={"btn"}  type="button" value="Run Program"
                   disabled={runDisabled} title={runDisabled ? cantRunToolTip : runToolTip}
                   onClick={this.props.onRun} />
            - -
            <input className={"btn"} type="button" value="Delete Program"
                   disabled={deleteDisabled} title={deleteDisabled ? cantDeleteToolTip : deleteToolTip}
                   onClick={this.props.onDeleteSelected}/>

            <input className={"btn"} type="button" value="Add Program"
                   disabled={addProgramDisabled} title={addProgramDisabled ? cantAddProgramToolTip : addProgramToolTip}
                   onClick={this.props.onAddProgram}/>
            - -
            <input className={"btn"} type="button" value="Save Changes"
                   disabled={saveDisabled} title={saveDisabled ? cantSaveToolTip : saveToolTip}
                   onClick={this.props.onSaveAll}/>

            <input className={"btn"} type="button" value="Reset Changes"
                   disabled={resetDisabled} title={resetDisabled ? cantResetToolTip : resetToolTip}
                   onClick={this.props.onReset}/>
        </div>
    }
});