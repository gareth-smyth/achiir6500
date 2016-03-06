var React = require('react');
var ReactDataGrid = require('react-data-grid/addons');
var ProgramService = require('./program_service');

var ProgramTableToolbar = React.createClass({
    render: function () {
        return <div>
            <input className={"btn"} type="button" onClick={this.props.onRun} value="Run Program"/>
            <input className={"btn"} type="button" disabled={!this.props.saveSelectedReady}
                   onClick={this.props.onSaveSelected}
                   value="Save Selected"/> - <input className={"btn"} type="button" disabled={!this.props.saveAllReady}
                   onClick={this.props.onSaveAll}
                   value="Save All"/>
            <input className={"btn"} type="button" disabled={!this.props.saveAllReady}
                   onClick={this.props.onReset}
                   value="Reset All"/>
        </div>
    }
});

module.exports = React.createClass({
    getInitialState: function () {
        return {rows: [], selectedRow: null, saveAllReady: false};
    },

    updateState: function (currentState, rows = null, selectedRow = null) {
        var newRows = rows ? rows : currentState.rows;
        var newSelectedRow = selectedRow ? selectedRow : currentState.selectedRow;
        var saveAllReady = newRows.find((row)=> row.dirty == true) ? true : false;
        var saveSelectedReady = newSelectedRow && newSelectedRow.dirty;

        this.setState({rows: newRows, selectedRow: newSelectedRow,
            saveAllReady: saveAllReady, saveSelectedReady: saveSelectedReady});
    },

    getRowAt: function (index) {
        return this.state.rows[index];
    },

    getSize: function () {
        return this.state.rows.length;
    },

    resetPrograms: function () {
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

    componentDidMount: function () {
        this.resetPrograms();
    },

    onRowSelect: function (rows) {
        this.updateState(this.state, null, rows[0]);
    },

    runProgram: function () {
        ProgramService.runProgram(this.state.selectedRow.id);
    },

    rowToProgram: function (row) {
        var steps = [];
        for (var step_num = 1; step_num < 9; step_num++) {
            steps.push({
                ramp: row['Ramp' + step_num],
                level: row['Level' + step_num],
                dwell: row['Dwell' + step_num]
            });
        }

        return {
            id: row.id,
            name: row.name,
            loop_counter: row.loop_counter,
            steps: steps
        };
    },

    saveSelectedProgram: function () {
        var selectedRow = this.state.selectedRow;

        var program = this.rowToProgram(selectedRow);

        ProgramService.savePrograms([program]);

        selectedRow.dirty = false;
        this.updateState(this.state);
    },

    saveAllPrograms: function () {
        var dirtyPrograms = this.state.rows
            .filter(row => row.dirty)
            .map(row => this.rowToProgram(row));

        ProgramService.savePrograms(dirtyPrograms);

        this.state.rows.forEach(row => row.dirty = false);
        this.updateState(this.state);
    },

    handleRowUpdated: function (e) {
        var rows = this.state.rows;
        Object.assign(rows[e.rowIdx], e.updated);
        rows[e.rowIdx].dirty = true;

        this.updateState(this.state, rows);
    },

    render: function () {
        var RowRenderer = React.createClass({
            setScrollLeft: function (scrollBy) {
                this.refs.row.setScrollLeft(scrollBy);
            },
            render: function () {
                if (this.props.row.dirty) {
                    return <div style={{color:'red'}}><ReactDataGrid.Row ref="row" {...this.props}/></div>
                } else {
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
                onSaveAll={this.saveAllPrograms}
                onSaveSelected={this.saveSelectedProgram}
                onReset={this.resetPrograms}
                saveAllReady={this.state.saveAllReady}
                saveSelectedReady={this.state.saveSelectedReady}
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