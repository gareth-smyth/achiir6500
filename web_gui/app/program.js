var React = require('react');
var ProgramTableComponent = require('./program_table/program_table_component.js');
var ProgramChart = require('./program_chart.js');
var ProgramService = require('./program_service.js');

module.exports = React.createClass({
    getInitialState: function () {
        return {programs: [], selectedProgram: 0 };
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

    selectProgram: function(programId){
        this.state.selectedProgram = programId;
        this.setState(this.state);
    },

    render: function () {
        return <div>
            <ProgramChart
                programs={this.state.programs}
                selectedProgram={this.state.selectedProgram}
            />
            <ProgramTableComponent
                programs={this.state.programs}
                onProgramsChanged={this.updatePrograms}
                onReset={this.resetPrograms}
                onSave={this.savePrograms}
                onRun={this.runProgram}
                onSelectProgram={this.selectProgram}
            />
        </div>;
    }
});