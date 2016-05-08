var fetch = require("node-fetch");
var Alert = require('react-s-alert').default;

module.exports = class ProgramService {
    static get() {
        return fetch("http://localhost:9858/programs").then(function (response) {
            if (response.status == 200) {
                return response.json();
            } else {
                Alert.error("Could not get the list of programs from the server.  See the log for details.");
                console.log("Error getting programs: Status:" + response.status + " Body:" + response.body.text());
                return [];
            }
        }).catch(function (error) {
            Alert.error("Could not get the list of programs from the server.  See the log for details.");
            console.log("Error getting programs: Error:");
            console.log(error);
            return [];
        });
    }

    static getCurrentProgramRun() {
        return fetch("http://localhost:9858/current-run").then(function (response) {
            if (response.status == 200) {
                return response.json();
            } else {
                Alert.error("Error returned from server during run.  See the log for details.");
                console.log("Error getting program run: Status:" + status + " Body:" + response.body.text());
                return {finished: true};
            }
        }).catch(function (error) {
            Alert.error("Error returned from server during run.  See the log for details.");
            console.log("Error getting program run: Error:");
            console.log(error);
            return {finished: true};
        });
    }

    static runProgram(programId) {
        return fetch('http://localhost:9858/start-program/' + programId, {method: 'POST'}).then(function (response) {
            if (response.status == 200) {
                return true;
            } else {
                Alert.error("Error returned from server when running program.  See the log for details.");
                console.log("Error running program: Status:" + status + " Body:" + response.body.text());
                return false;
            }
        }).catch(function (error) {
            Alert.error("Error returned from server when running program.  See the log for details.");
            console.log("Error running program: Error:");
            console.log(error);
            return false;
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
                Alert.error("Error returned from server when saving programs.  See the log for details.");
                console.log("Error saving programs: Status:" + status + " Body:" + response.body.text());
            }
        }).catch(function (error) {
            Alert.error("Error returned from server when saving programs.  See the log for details.");
            console.log("Error saving programs: Error:");
            console.log(error);
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
                Alert.error("Error returned from server when deleting programs.  See the log for details.");
                console.log("Error deleting programs: Status:" + status + " Body:" + response.body.text());
            }
        }).catch(function (error) {
            Alert.error("Error returned from server when deleting programs.  See the log for details.");
            console.log("Error deleting programs: Error:");
            console.log(error);
        });
    }
};
