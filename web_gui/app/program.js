var React = require('react');
var ProgramTableComponent = require('./program_table/program_table_component.js');
var ProgramChart = require('./program_chart.js');
var ProgramService = require('./program_service.js');

module.exports = React.createClass({
    getInitialState: function () {
        return {programs: [], reset: false};
    },

    componentDidMount: function () {
        this.resetPrograms();
    },

    updatePrograms: function (programs) {
        this.state.programs = programs;
        this.setState(this.state);
    },

    resetPrograms: function () {
        ProgramService.get().then(function (programs) {
            this.updatePrograms(programs);
        }.bind(this));
    },

    savePrograms: function(programsToSave, programsToDelete){
        ProgramService.savePrograms(programsToSave).then(function () {
            ProgramService.deletePrograms(programsToDelete);
        });
    },

    runProgram: function (programId) {
        ProgramService.runProgram(programId);
    },

    render: function () {
        return <div>
            <ProgramChart
                programs={this.state.programs}/>
            <ProgramTableComponent
                programs={this.state.programs}
                onProgramsChanged={this.updatePrograms}
                onReset={this.resetPrograms}
                onSave={this.savePrograms}
                onRun={this.runProgram}/>
        </div>;
    }
});