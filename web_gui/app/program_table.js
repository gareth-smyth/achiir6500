var React = require('react');
var ReactDataGrid = require('react-data-grid/addons');
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
        return {rows: [], selectedRow: null, dirtyRows: []};
    },

    updateState: function (currentState, rows = null, selectedRow = null, dirtyRows = null) {
        var newRows = rows ? rows : currentState.rows;
        var newSelectedRow = selectedRow ? selectedRow : currentState.selectedRow;
        var newDirtyRows = dirtyRows ? dirtyRows : currentState.dirtyRows;
        this.setState({rows: newRows, selectedRow: newSelectedRow, dirtyRows: newDirtyRows});
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

            this.updateState(this.state, rows, null);
        }.bind(this));
    },

    onRowSelect: function (rows) {
        this.updateState(this.state, null, rows[0]);
    },

    runProgram: function () {
        ProgramService.runProgram(this.state.selectedRow.id);
    },

    saveProgram: function () {
        var selectedRow = this.state.selectedRow;

        var steps = [];
        for (var step_num = 1; step_num < 9; step_num++) {
            steps.push({
                ramp: selectedRow['Ramp' + step_num],
                level: selectedRow['Level' + step_num],
                dwell: selectedRow['Dwell' + step_num]
            });
        }

        var program = {
            id: selectedRow.id,
            name: selectedRow.name,
            loop_counter: selectedRow.loop_counter,
            steps: steps
        };

        ProgramService.saveProgram(program);
        selectedRow.dirty = false;
        this.updateState(this.state);
    },

    handleRowUpdated: function (e) {
        var rows = this.state.rows;
        Object.assign(rows[e.rowIdx], e.updated);
        rows[e.rowIdx].dirty = true;

        this.updateState(this.state, rows, null);
    },

    render: function () {
        var RowRenderer = React.createClass({
            setScrollLeft: function (scrollBy) {
                this.refs.row.setScrollLeft(scrollBy);
            },
            getRowColor: function () {
                return { color:this.props.row.dirty ? 'green' : 'blue'}
            },
            render: function () {
                if(this.props.row.dirty) {
                    return <div style={{color:'red'}}><ReactDataGrid.Row ref="row" {...this.props}/></div>
                }else{
                    return <div><ReactDataGrid.Row ref="row" {...this.props}/></div>
                }
            }
        });

        var step_headings = ["Ramp", "Level", "Dwell"];
        var columns = [
            {
                key: 'name',
                name: 'Program',
                width: 210,
                fixed: true,
                locked: true,
                editable: true
            },
            {
                key: 'loop_counter',
                name: 'Loop',
                width: 60,
                editable: true
            }
        ];
        for (var step_num = 1; step_num < 9; step_num++) {
            step_headings.map(function (step_part) {
                columns.push({key: step_part + step_num, name: step_part, width: 60, editable: true});
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
                enableCellSelect={true}
                onRowSelect={this.onRowSelect}
                onRowUpdated={this.handleRowUpdated}
                rowRenderer={RowRenderer}/>
        </div>);
    }
});