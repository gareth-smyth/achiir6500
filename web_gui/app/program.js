var React = require('react');
var ProgramService = require('./program_service.js');
var { ProgramTableComponent } = require('./program_table/program_table_component.js');
var ProgramChart = require('./program_chart.js');

export class Program extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            programs: [],
            selectedProgram: 0,
            programRunning: false,
            programRun: {finished: true, data_points: []}
        };
        this.resetPrograms = this.resetPrograms.bind(this);
        this.updatePrograms = this.updatePrograms.bind(this);
        this.selectProgram = this.selectProgram.bind(this);
        this.runProgram = this.runProgram.bind(this);
    }

    componentDidMount() {
        this.resetPrograms();
    }

    updatePrograms(programs){
        this.state.programs = programs;
        this.setState(this.state);
    }

    resetPrograms() {
        ProgramService.get().then(function (programs) {
            this.updatePrograms(programs);
        }.bind(this));
    }

    savePrograms(programsToSave, programsToDelete) {
        ProgramService.savePrograms(programsToSave).then(function () {
            ProgramService.deletePrograms(programsToDelete);
        });
    }

    runProgram(programId) {
        if (ProgramService.runProgram(programId)) {
            this.state.programRunning = true;
            this.setState(this.state, () => {
                (function poll() {
                    var poller = setInterval(function () {
                        ProgramService.getCurrentProgramRun().then(function (programRun) {
                            if (programRun.finished) {
                                clearInterval(poller);
                                this.state.programRunning = false;
                            }
                            this.state.programRun = programRun;
                            this.setState(this.state);
                        }.bind(this));
                    }.bind(this), 5000);
                }.bind(this))();
            })
        }
    }

    selectProgram(programId) {
        this.state.selectedProgram = programId;
        this.setState(this.state);
    }

    render() {
        return <div>
            <ProgramChart
                programs={this.state.programs}
                selectedProgram={this.state.selectedProgram}
                programRun={this.state.programRun}
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
}