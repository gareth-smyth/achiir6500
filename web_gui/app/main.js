var React = require('react');
var ReactDOM = require('react-dom');
var ProgramTable = require('./program_table.js');
require('./styles.css');

ReactDOM.render(
    <div>
        <div className="header">
            Achi Ir 6500 Control Station 0.2
        </div>
        <div className="contain">
            <div className="content">
                <ProgramTable/>
            </div>
        </div>
        <div className="footer">
            See <a href="https://github.com/gareth-smyth/achiir6500">AchiIr6500</a>
        </div>
    </div>,
    document.getElementById('control-station')
);