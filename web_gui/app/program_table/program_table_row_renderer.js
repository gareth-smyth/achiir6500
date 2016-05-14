var React = require('react');
var ReactDataGrid = require('react-data-grid/addons');

export class ProgramTableRowRenderer extends React.Component {
    setScrollLeft(scrollBy) {
        this.refs.row.setScrollLeft(scrollBy);
    }

    getClass() {
        if (this.props.row.queueDelete) {
            return "deleting";
        }
        if (this.props.row.dirty) {
            return "dirty";
        }
    }
    
    render() {
        return <div className={this.getClass()}><ReactDataGrid.Row ref="row" {...this.props}/></div>
    }
}