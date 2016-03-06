var fetch = require("node-fetch");

module.exports = class ProgramService {
    static get() {
        return fetch("http://localhost:9858/programs").then(function (response) {
            if (response.status == 200) {
                return response.json();
            } else {
                console.log("Error getting programs: Status:" + status + " Body:" + response.body);
                return [];
            }
        });
    }

    static runProgram(programId) {
        return fetch('http://localhost:9858/start-program/' + programId, {method: 'POST'}).then(function (response) {
            if (response.status == 200) {
                console.log("Ran program:" + programId);
            } else {
                console.log("Error running program: Status:" + status + " Body:" + response.body);
            }
        });
    }

    static savePrograms(programs) {
        return fetch('http://localhost:9858/programs', {
                method: 'POST',
                body: JSON.stringify(programs),
                headers: {
                    'content-type': 'application/json; charset=utf-8'
                }
            }
        ).then(function (response) {
            if (response.status == 200) {
                console.log("Saved programs:" + JSON.stringify(programs));
            } else {
                console.log("Error saving programs: Status:" + status + " Body:" + response.body);
            }
        });
    }

    static deletePrograms(programs) {
        return fetch('http://localhost:9858/delete-programs', {
                method: 'POST',
                body: JSON.stringify(programs),
                headers: {
                    'content-type': 'application/json; charset=utf-8'
                }
            }
        ).then(function (response) {
            if (response.status == 200) {
                console.log("Deleted programs:" + JSON.stringify(programs));
            } else {
                console.log("Error deleting programs: Status:" + status + " Body:" + response.body);
            }
        });
    }
};
