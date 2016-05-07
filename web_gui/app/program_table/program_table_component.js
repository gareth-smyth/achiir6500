var React = require('react');
var ReactDataGrid = require('react-data-grid/addons');
var ProgramToolbar = require('./program_toolbar.js');
var uuid = require('uuid-js');

module.exports = React.createClass({
    // Handling rows
    mergeRowChanges: function (mergeIntoRows, fromRows) {
        return fromRows.map(function (updatedRow) {
            var existingRow = mergeIntoRows.find(existingRow => existingRow.id == updatedRow.id);
            if (existingRow && this.rowsMatch(existingRow, updatedRow)) {
                updatedRow.dirty = existingRow.dirty;
                updatedRow.queueDelete = existingRow.queueDelete;
            }
            return updatedRow;
        }.bind(this)).filter(function (originalRow) {
            return fromRows.find(updatedRow => originalRow.id == updatedRow.id);
        });
    },

    rowsMatch: function (rowA, rowB) {
        var aProps = Object.getOwnPropertyNames(rowA);

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            if (propName != "dirty" && propName != "queueDelete" && propName != "isSelected") {
                if ("" + rowA[propName] !== "" + rowB[propName]) {
                    return false;
                }
            }
        }

        return true;
    },

    getRowsFromPrograms: function (programs) {
        return programs.map(function (program) {
            return this.programToRow(program);
        }.bind(this));
    },

    programToRow: function (program) {
        var program_row = {
            id: program.id,
            name: program.name,
            loop_counter: program.loop_counter,
            dirty: false,
            queueDelete: false
        };

        program.steps.forEach(function (step, index) {
            var step_num = index + 1;
            program_row['Ramp' + step_num] = step.ramp;
            program_row['Level' + step_num] = step.level;
            program_row['Dwell' + step_num] = step.dwell;
        });

        return program_row;
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

    // Handling state
    updateState: function (currentState, rows = null, selectedRow = null, callback = null, programRunning = null) {
        var newRows = rows ? rows : currentState.rows;
        var newSelectedRow = selectedRow ? selectedRow : currentState.selectedRow;
        var hasChanges = newRows.find((row)=> row.dirty == true || row.queueDelete == true) ? true : false;
        var programRunning = programRunning!=null ? programRunning : currentState.programRunning;

        this.setState({
                rows: newRows,
                selectedRow: newSelectedRow,
                hasChanges: hasChanges,
                programRunning: programRunning
            },
            callback);
    },

    // React
    getInitialState: function () {
        return {rows: [], selectedRow: null, hasChanges: false, programRunning: false};
    },

    componentWillReceiveProps: function (nextProps) {
        var mergedRows = this.mergeRowChanges(this.state.rows, this.getRowsFromPrograms(nextProps.programs));
        this.updateState(this.state, mergedRows, null, null, nextProps.programRunning);
    },

    // React data grid
    getRowAt: function (index) {
        return this.state.rows[index];
    },

    getSize: function () {
        return this.state.rows.length;
    },

    onRowSelect: function (rows) {
        this.updateState(this.state, null, rows[0], function () {
            this.props.onSelectProgram(rows[0].id);
        });
    },

    onRowUpdated: function (e) {
        var rows = this.state.rows;
        Object.assign(rows[e.rowIdx], e.updated);
        rows[e.rowIdx].dirty = true;

        this.updatePrograms();
    },

    // Other!!!
    runProgram: function () {
        var selectedRow = this.state.selectedRow;
        this.props.onRun(selectedRow.id);
    },

    fullyDeleteRow: function (row) {
        var selectedIndex = this.state.rows.indexOf(row);
        if (selectedIndex != -1) {
            this.state.rows.splice(selectedIndex, 1);
        }
    },

    saveAllPrograms: function () {
        var dirtyRows = this.state.rows.filter(row => row.dirty);
        var dirtyPrograms = dirtyRows.map(row => this.rowToProgram(row));
        var deletingRows = this.state.rows.filter(row => row.queueDelete);
        var deletingPrograms = deletingRows.map(row => this.rowToProgram(row));

        this.props.onSave(dirtyPrograms, deletingPrograms);

        dirtyRows.forEach(row => {
            row.dirty = false;
        });
        deletingRows.forEach(row => {
            this.fullyDeleteRow(row)
        });

        this.updateState(this.state);
    },

    deleteProgram: function () {
        var selectedRow = this.getRow(this.state.selectedRow.id);
        selectedRow.dirty = false;
        selectedRow.queueDelete = true;
        this.updateState(this.state);
    },
    
    getRow: function(rowId){
        return this.state.rows.find(function(row){
            return row.id==rowId;
        });
    },

    updatePrograms: function () {
        var rows = this.state.rows;
        this.props.onProgramsChanged(rows.map(function (row) {
            return this.rowToProgram(row);
        }.bind(this)));
    },

    addProgram: function () {
        var steps = [{ramp: 0.1, level: 0, dwell: 0}];
        for (var step_num = 2; step_num < 9; step_num++) {
            steps.push({
                ramp: 0,
                level: 0,
                dwell: 0
            });
        }

        var newProgram = {
            id: uuid.create(1).toString(),
            name: "New Program",
            loop_counter: 1,
            steps: steps
        };

        var newRow = this.programToRow(newProgram);
        newRow.dirty = true;
        this.state.rows.push(newRow);

        this.updatePrograms();
    },

    render: function () {
        var RowRenderer = React.createClass({
            setScrollLeft: function (scrollBy) {
                this.refs.row.setScrollLeft(scrollBy);
            },
            getClass: function () {
                if (this.props.row.queueDelete) {
                    return "deleting";
                }
                if (this.props.row.dirty) {
                    return "dirty";
                }
            },
            render: function () {
                return <div className={this.getClass()}><ReactDataGrid.Row ref="row" {...this.props}/></div>
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
                editable: !this.state.programRunning
            },
            {
                key: 'loop_counter',
                name: 'Loop',
                width: 60,
                editable: !this.state.programRunning
            }
        ];
        for (var step_num = 1; step_num < 9; step_num++) {
            step_headings.map(function (step_part) {
                columns.push({key: step_part + step_num, name: step_part, width: 60, editable: !this.state.programRunning});
            }.bind(this));
        }

        return (<div className={"tablediv"}>
            <ProgramToolbar
                onRun={this.runProgram}
                onSaveAll={this.saveAllPrograms}
                onReset={this.props.onReset}
                onAddProgram={this.addProgram}
                onDeleteSelected={this.deleteProgram}
                hasChanges={this.state.hasChanges}
                hasSelectedRow={this.state.selectedRow ? true : false}
                selectedRowQueuedDelete={(this.state.selectedRow && this.state.selectedRow.queueDelete) ? true : false}
                programRunning={this.state.programRunning}
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
                onRowUpdated={this.onRowUpdated}
                rowRenderer={RowRenderer}
            />
        </div>);
    }
});