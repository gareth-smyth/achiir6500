var React = require('react');
var ReactDOM = require('react-dom');
var Program = require('./program.js');
var Alert = require('react-s-alert').default;
require('./styles.css');

ReactDOM.render(
    <div>
        <div className="header">
            Achi Ir 6500 Control Station 0.4
        </div>
        <div className="contain">
            <div className="content">
                <Program/>
            </div>
        </div>
        <div className="footer">
            See <a href="https://github.com/gareth-smyth/achiir6500">AchiIr6500</a>
        </div>
        <Alert stack={true} position={"top"} effect={"stackslide"} timeout={"none"}/>
    </div>,
    document.getElementById('control-station')
);