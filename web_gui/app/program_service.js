var fetch = require("node-fetch");

module.exports = class ProgramService{
    static get() {
        return fetch("http://localhost:9858/programs").then(function (response) {
            if(response.status==200) {
                return response.json();
            }else{
                console.log("Error getting programs: Status:"+status+" Body:"+response.body);
                return [];
            }
        });
    }

    static runProgram(programId){
        return fetch('http://localhost:9858/start-program/'+programId, {method: 'POST'}).then(function (response) {
            if (response.status == 200) {
                console.log("Ran program:" + programId);
            } else {
                console.log("Error running program: Status:" + status + " Body:" + response.body);
            }
        });
    }

    static saveProgram(program){
        return fetch('http://localhost:9858/programs', {method: 'POST', body:JSON.stringify([program])}).then(function (response) {
            if (response.status == 200) {
                console.log("Saved program:" + JSON.stringify(program));
            } else {
                console.log("Error saving program: Status:" + status + " Body:" + response.body);
            }
        });
    }
};
