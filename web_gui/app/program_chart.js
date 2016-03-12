var React = require('react');

module.exports = React.createClass({
      render: function () {

        return (<div className={"chartdiv"}>
            {JSON.stringify(this.props.programs)}
        </div>);
    }
});