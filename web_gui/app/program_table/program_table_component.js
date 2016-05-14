var React = require('react');
var ReactDataGrid = require('react-data-grid/addons');
var {ProgramToolbar} = require('./program_toolbar');
var {ProgramTableRowRenderer} = require('./program_table_row_renderer');
var uuid = require('uuid-js');

export class ProgramTableComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {rows: [], selectedRow: null, hasChanges: false, programRunning: false};
        
        this.columns = this.buildColumnDefinitions();
        
        this.addProgram = this.addProgram.bind(this);
        this.getRowAt = this.getRowAt.bind(this);
        this.saveAllPrograms = this.saveAllPrograms.bind(this);
        this.onRowSelect = this.onRowSelect.bind(this);
        this.deleteProgram = this.deleteProgram.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        var mergedRows = this._mergeRowChanges(this.state.rows, this._getRowsFromPrograms(nextProps.programs));
        this._updateState(this.state, mergedRows, null, null, nextProps.programRunning);
    }

    // React data grid
    getRowAt(index) {
        return this.state.rows[index];
    }

    getSize() {
        return this.state.rows.length;
    }

    onRowSelect(rows) {
        this._updateState(this.state, null, rows[0], function () {
            this.props.onSelectProgram(rows[0].id);
        });
    }

    onRowUpdated(e) {
        var rows = this.state.rows;
        Object.assign(rows[e.rowIdx], e.updated);
        rows[e.rowIdx].dirty = true;

        this.updatePrograms();
    }

    // Other!!!
    runProgram() {
        var selectedRow = this.state.selectedRow;
        this.props.onRun(selectedRow.id);
    }

    fullyDeleteRow(row) {
        var selectedIndex = this.state.rows.indexOf(row);
        if (selectedIndex != -1) {
            this.state.rows.splice(selectedIndex, 1);
        }
    }

    saveAllPrograms() {
        var dirtyRows = this.state.rows.filter(row => row.dirty);
        var dirtyPrograms = dirtyRows.map(row => this._rowToProgram(row));
        var deletingRows = this.state.rows.filter(row => row.queueDelete);
        var deletingPrograms = deletingRows.map(row => this._rowToProgram(row));

        this.props.onSave(dirtyPrograms, deletingPrograms);

        dirtyRows.forEach(row => {
            row.dirty = false;
        });
        deletingRows.forEach(row => {
            this.fullyDeleteRow(row)
        });

        this._updateState(this.state);
    }

    deleteProgram() {
        var selectedRow = this.getRow(this.state.selectedRow.id);
        selectedRow.dirty = false;
        selectedRow.queueDelete = true;
        this._updateState(this.state);
    }

    getRow(rowId) {
        return this.state.rows.find(function (row) {
            return row.id == rowId;
        });
    }

    updatePrograms() {
        var rows = this.state.rows;
        this.props.onProgramsChanged(rows.map(function (row) {
            return this._rowToProgram(row);
        }.bind(this)));
    }

    addProgram() {
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

        var newRow = this._programToRow(newProgram);
        newRow.dirty = true;
        newRow.selected = false;
        newRow.queueDelete = false;
        this.state.rows.push(newRow);

        this.updatePrograms();
    }

    render() {
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
                columns={this.columns}
                rowKey="id"
                rowGetter={this.getRowAt}
                rowsCount={this.getSize()}
                minHeight={200}
                maxHeight={200}
                enableRowSelect='single'
                enableCellSelect={true}
                onRowSelect={this.onRowSelect}
                onRowUpdated={this.onRowUpdated}
                rowRenderer={ProgramTableRowRenderer}
            />
        </div>);
    }

    // Everything below here is to be considered private
    buildColumnDefinitions() {
        let step_headings = ["Ramp", "Level", "Dwell"];
        let columns = [
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
        for (let step_num = 1; step_num < 9; step_num++) {
            step_headings.map(function (step_part) {
                columns.push({
                    key: step_part + step_num,
                    name: step_part,
                    width: 60,
                    editable: !this.state.programRunning
                });
            }.bind(this));
        }
        return columns;
    }
    
    // Handling state
    _updateState(currentState, rows = null, selectedRow = null, callback = null, programRunning = null) {
        var newRows = rows ? rows : currentState.rows;
        var newSelectedRow = selectedRow ? selectedRow : currentState.selectedRow;
        var hasChanges = newRows.find((row)=> row.dirty == true || row.queueDelete == true) ? true : false;
        var isProgramRunning = programRunning != null ? programRunning : currentState.programRunning;

        this.setState({
                rows: newRows,
                selectedRow: newSelectedRow,
                hasChanges: hasChanges,
                programRunning: isProgramRunning
            },
            callback);
    }
    
    // Handling rows
    _mergeRowChanges(mergeIntoRows, fromRows) {
        return fromRows.map(function (updatedRow) {
            var existingRow = mergeIntoRows.find(existingRow => existingRow.id == updatedRow.id);
            if (existingRow && this._rowsMatch(existingRow, updatedRow)) {
                updatedRow.dirty = existingRow.dirty;
                updatedRow.queueDelete = existingRow.queueDelete;
                updatedRow.isSelected = existingRow.isSelected;
            }
            return updatedRow;
        }.bind(this)).filter(function (originalRow) {
            return fromRows.find(updatedRow => originalRow.id == updatedRow.id);
        });
    }

    _rowsMatch(rowA, rowB) {
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
    }

    _getRowsFromPrograms(programs) {
        return programs.map(function (program) {
            return this._programToRow(program);
        }.bind(this));
    }

    _programToRow(program) {
        var program_row = {
            id: program.id,
            name: program.name,
            loop_counter: program.loop_counter,
            dirty: false,
            isSelected:false,
            queueDelete: false
        };

        program.steps.forEach(function (step, index) {
            var step_num = index + 1;
            program_row['Ramp' + step_num] = step.ramp;
            program_row['Level' + step_num] = step.level;
            program_row['Dwell' + step_num] = step.dwell;
        });

        return program_row;
    }

    _rowToProgram(row) {
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
    }
}