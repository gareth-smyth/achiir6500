jest.unmock("../app/program_service");
jest.mock("react-s-alert");

var ProgramService = require('../app/program_service');
var fetchMock = require('fetch-mock');
var Alert = require('react-s-alert').default;

describe('Program Service', function () {
    afterEach(Alert.error.mockClear);

    it("Can be instantiated", function () {
        new ProgramService();
        // Stupid quick fix for coverage of static class
    });

    it('returns the json from the response on a 200', function (done) {
        fetchMock.reMock("http://localhost:9858/programs", {name: "hello"});
        ProgramService.get().then((jsonResponse)=> {
            expect(jsonResponse).toEqual({name: 'hello'});
            done();
        });
    });

    it('returns an empty array and raises error when not a 200', function (done) {
        fetchMock.reMock("http://localhost:9858/programs", {
            body: 'non 200', status: 500, sendAsJson: false
        });
        ProgramService.get().then((jsonResponse)=> {
            expect(jsonResponse).toEqual([]);
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });

    it('returns an empty array and raises error when an error occurs', function (done) {
        fetchMock.reMock("http://localhost:9858/programs", {
            throws: 'error'
        });
        ProgramService.get().then((jsonResponse)=> {
            expect(jsonResponse).toEqual([]);
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });

    it('returns the json from the response on a 200', function (done) {
        fetchMock.reMock("http://localhost:9858/current-run", {name: "hello"});
        ProgramService.getCurrentProgramRun().then((jsonResponse)=> {
            expect(jsonResponse).toEqual({name: 'hello'});
            done();
        });
    });

    it('returns finished true and raises error when not a 200', function (done) {
        fetchMock.reMock("http://localhost:9858/current-run", {
            body: 'non 200', status: 500, sendAsJson: false
        });
        ProgramService.getCurrentProgramRun().then((jsonResponse)=> {
            expect(jsonResponse).toEqual({finished: true});
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });

    it('returns finished true and raises error when an error occurs', function (done) {
        fetchMock.reMock("http://localhost:9858/current-run", {
            throws: 'error'
        });
        ProgramService.getCurrentProgramRun().then((jsonResponse)=> {
            expect(jsonResponse).toEqual({finished: true});
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });

    it('returns true from the response on a 200', function (done) {
        fetchMock.reMock("http://localhost:9858/start-program/1", {name: "hello"});
        ProgramService.runProgram(1).then((jsonResponse)=> {
            expect(jsonResponse).toEqual(true);
            done();
        });
    });

    it('returns false and raises error when not a 200', function (done) {
        fetchMock.reMock("http://localhost:9858/start-program/1", {
            body: 'non 200', status: 500, sendAsJson: false
        });
        ProgramService.runProgram(1).then((jsonResponse)=> {
            expect(jsonResponse).toEqual(false);
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });

    it('returns false and raises error when an error occurs', function (done) {
        fetchMock.reMock("http://localhost:9858/start-program/1", {
            throws: 'error'
        });
        ProgramService.runProgram(1).then((jsonResponse)=> {
            expect(jsonResponse).toEqual(false);
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });

    it('raises no error on 200', function (done) {
        fetchMock.reMock("http://localhost:9858/programs", 'POST', {name: "hello"});
        ProgramService.savePrograms([]).then((jsonResponse)=> {
            expect(Alert.error.mock.calls.length).toBe(0);
            done();
        });
    });

    it('raises error when not a 200', function (done) {
        fetchMock.reMock("http://localhost:9858/programs", 'POST', {
            body: 'non 200', status: 500, sendAsJson: false
        });
        ProgramService.savePrograms([]).then((jsonResponse)=> {
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });

    it('raises error when an error occurs', function (done) {
        fetchMock.reMock("http://localhost:9858/programs", 'POST', {
            throws: 'error'
        });
        ProgramService.savePrograms([]).then((jsonResponse)=> {
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });

    it('raises no error on 200', function (done) {
        fetchMock.reMock("http://localhost:9858/delete-programs", 'POST', {name: "hello"});
        ProgramService.deletePrograms([]).then((jsonResponse)=> {
            expect(Alert.error.mock.calls.length).toBe(0);
            done();
        });
    });

    it('raises error when not a 200', function (done) {
        fetchMock.reMock("http://localhost:9858/delete-programs", 'POST', {
            body: 'non 200', status: 500, sendAsJson: false
        });
        ProgramService.deletePrograms([]).then((jsonResponse)=> {
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });

    it('raises error when an error occurs', function (done) {
        fetchMock.reMock("http://localhost:9858/delete-programs", 'POST', {
            throws: 'error'
        });
        ProgramService.deletePrograms([]).then((jsonResponse)=> {
            expect(Alert.error.mock.calls.length).toBe(1);
            done();
        });
    });
});