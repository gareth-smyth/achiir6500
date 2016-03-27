var React = require('react');
var ProgramTableComponent = require('./program_table/program_table_component.js');
var ProgramChart = require('./program_chart.js');
var ProgramService = require('./program_service.js');

module.exports = React.createClass({
    getInitialState: function () {
        return {programs: [], selectedProgram: 0, programRunning: false };
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
        if(ProgramService.runProgram(programId)){
            this.state.programRunning = true;
            this.setState(this.state, function(){
                (function poll(){
                    var poller = setInterval(function(){
                        ProgramService.getCurrentProgramRun().then(function(programRun){
                            if(programRun.finished){
                                clearInterval(poller);
                                this.state.programRunning = false;
                                this.setState(this.state);
                            }
                        }.bind(this));
                    }.bind(this), 5000);
                }.bind(this))();
            }.bind(this))
        }
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
                programRunning={this.state.programRunning}
            />
        </div>;
    }
});