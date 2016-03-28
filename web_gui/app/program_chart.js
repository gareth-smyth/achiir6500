var React = require('react');
var Sparklines = require('react-sparklines').Sparklines;
var SparklinesLine = require('react-sparklines').SparklinesLine;

module.exports = React.createClass({
    config: {
        secondsPerTick: 1
    },

    // Conversions between programs and chart data
    generateChartDataForProgram: function (program) {
        var data = [];

        var stepStartingTemp = 0;
        program.steps.forEach((currentStep, index) => {
            var tempDifference = currentStep.level - stepStartingTemp;

            var timeToLevel = (tempDifference / currentStep.ramp);

            for (var rampSecondsPassed = 0; rampSecondsPassed < timeToLevel; rampSecondsPassed += this.config.secondsPerTick) {
                var temperature = stepStartingTemp + (rampSecondsPassed * (tempDifference / timeToLevel));
                data.push(temperature);
            }

            for (var dwellSecondsPassed = 0; dwellSecondsPassed < currentStep.dwell; dwellSecondsPassed += this.config.secondsPerTick) {
                data.push(currentStep.level);
            }

            stepStartingTemp = currentStep.level;
        });

        return data;
    },

    generateChartDataForRun: function (programRun) {
        var data = [];

        var lastTimestamp = new Date(0).getTime();
        programRun.data_points.forEach((data_point)=> {
            var timestamp = Date.parse(data_point.timestamp);
            if(timestamp>(lastTimestamp+(this.config.secondsPerTick*1000))){
                data.push(data_point.value);
                lastTimestamp = timestamp;
            }
        });

        return data;
    },

    // Component methods
    getInitialState: function () {
        return {
            chartData: []
        };  
    },

    componentWillReceiveProps: function (nextProps) {
        var selectedIndex = nextProps.programs.findIndex(function (program) {
            return nextProps.selectedProgram === program.id;
        });
        selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
        this.state.chartData = this.generateChartDataForProgram(nextProps.programs[selectedIndex]);
        this.state.runData = this.generateChartDataForRun(nextProps.programRun);
        this.setState(this.state);
    },

    render: function () {
        return (<div className={"chartdiv"}>
            <Sparklines data={this.state.chartData} containerWidth={"100%"} containerHeight={"50%"}
                        width={300} height={100} margin={5} preserveAspectRatio={"none"}>
                <SparklinesLine />
            </Sparklines>

            <Sparklines data={this.state.runData} containerWidth={"100%"} containerHeight={"50%"}
                        width={300} height={100} margin={5} preserveAspectRatio={"none"} min={0} max={300} limit={this.state.chartData.length}>
                <SparklinesLine />
            </Sparklines>
        </div>);
    }
});