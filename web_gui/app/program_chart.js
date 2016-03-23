var React = require('react');
var LineChart = require("react-chartjs").Line;

module.exports = React.createClass({
    // Conversions between programs and chart data
    setChartData: function(dataSet, program){
        var data = [];

        var stepStartingTemp = 0;
        program.steps.forEach(function(currentStep, index){
            var tempDifference = currentStep.level - stepStartingTemp;

            var timeToLevel = (tempDifference / currentStep.ramp);

            for(var rampSecondsPassed = 0; rampSecondsPassed<timeToLevel; rampSecondsPassed+=20){
                var temperature = stepStartingTemp + (rampSecondsPassed * (tempDifference / timeToLevel));
                data.push(temperature);
            }

            for(var dwellSecondsPassed = 0; dwellSecondsPassed<currentStep.dwell; dwellSecondsPassed+=20){
                data.push(currentStep.level);
            }

            stepStartingTemp = currentStep.level;
        });

        dataSet.data = data;
    },

    // Component methods
    getInitialState: function () {
        return {
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: "Program",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: []
                    }
                ]
            }
        };
    },

    componentWillReceiveProps: function (nextProps) {
        var currentChartData = this.state.chartData;
        var selectedIndex = nextProps.programs.findIndex(function(program){
           return nextProps.selectedProgram === program.id;
        });
        selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
        this.setChartData(
            currentChartData.datasets[0],
            nextProps.programs[selectedIndex]);
        currentChartData.labels = [];
        this.updateState(this.state, currentChartData);
    },

    updateState: function (currentState, chartData) {
        this.setState(
            {
                chartData: chartData
            });
    },

    render: function () {
        var chartOptions = {responsive: true, maintainAspectRatio: false};

        return (<div className={"chartdiv"}>
            <LineChart data={this.state.chartData} options={chartOptions}/>
        </div>);
    }
});