var React = require('react');
var ReactDataGrid = require('react-data-grid');
var ProgramService = require('./program_service');

var ProgramTableToolbar = React.createClass({
    render: function () {
        return <div>
            <input type="button" onClick={this.props.onRun} value="Run Program"/>
            <input type="button" onClick={this.props.onSave} value="Save Selected"/>
        </div>
    }
});

module.exports = React.createClass({
    getInitialState: function () {
        return {rows: []};
    },

    getRowAt: function (index) {
        return this.state.rows[index];
    },

    getSize: function () {
        return this.state.rows.length;
    },

    componentDidMount: function () {
        ProgramService.get().then(function (programs) {
            var rows = programs.map(function (program) {
                var program_row = {
                    id: program.id,
                    name: program.name,
                    loop_counter: program.loop_counter
                };

                program.steps.forEach(function (step, index) {
                    var step_num = index + 1;
                    program_row['Ramp' + step_num] = step.ramp;
                    program_row['Level' + step_num] = step.level;
                    program_row['Dwell' + step_num] = step.dwell;
                });

                return program_row;
            });

            this.setState({rows: rows, selected_row: null});
        }.bind(this));
    },

    onRowSelect: function (rows) {
        this.setState({rows: this.state.rows, selected_row: rows[0]});
    },

    runProgram: function () {
        ProgramService.runProgram(this.state.selected_row.id);
    },

    saveProgram: function () {
        var selected_row = this.state.selected_row;

        var steps = [];
        for (var step_num = 1; step_num < 9; step_num++) {
            steps.push({
                ramp: selected_row['Ramp' + step_num],
                level: selected_row['Level' + step_num],
                dwell: selected_row['Dwell' + step_num]
            });
        }

        var program = {
            id: selected_row.id,
            name: selected_row.name,
            loop_counter: selected_row.loop_counter,
            steps: steps
        };

        ProgramService.saveProgram(program);
    },

    render: function () {
        var step_headings = ["Ramp", "Level", "Dwell"];
        var columns = [
            {
                key: 'name',
                name: 'Program',
                width: 210,
                fixed: true,
                locked: true
            },
            {
                key: 'loop_counter',
                name: 'Loop',
                width: 60
            }
        ];
        for (var step_num = 1; step_num < 9; step_num++) {
            step_headings.map(function (step_part) {
                columns.push({key: step_part + step_num, name: step_part, width: 60});
            });
        }

        return (<div>
            <ProgramTableToolbar
                onRun={this.runProgram}
                onSave={this.saveProgram}
            />
            <ReactDataGrid
                columns={columns}
                rowKey="id"
                rowGetter={this.getRowAt}
                rowsCount={this.getSize()}
                minHeight={200}
                maxHeight={200}
                enableRowSelect='single'
                onRowSelect={this.onRowSelect}/>
        </div>);
    }
});