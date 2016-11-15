'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sumarize = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sumarize = exports.sumarize = function sumarize(search, tasks, rate, full) {

    if (tasks.length === 0) {
        return console.log('No Timers are running.');
    }

    var table = new _cliTable2.default({
        // head: ['Task', 'Duration', 'Dates'],
        head: ['<Done>', 'Start', 'Stop', 'Duration'],
        chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
        colAligns: ['left', 'right', 'center'],
        style: { head: ['dim'] }
    });
    var total = 0;
    var head = 'Search: ' + search + ' \n';

    // separate table for running timers
    var tableRunning = new _cliTable2.default({
        // head: ['Task', 'Duration', 'Dates'],
        head: ['<Running>', 'Duration'],
        chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
        colAligns: ['left', 'right', 'center'],
        style: { head: ['green'] }
    });

    tasks.map(function (task, index) {
        var duration = (0, _moment2.default)(task.task.stop).diff((0, _moment2.default)(task.task.start), 'seconds');
        total += duration;

        var outputDuration = (0, _Utils.humanParseDiff)(duration);
        outputDuration = ' ' + (0, _Utils.getMinutes)(duration) + 'm (' + outputDuration + ')'; // add min in parens

        var name = task.name;

        // FIXME: Kill this
        var startTime = (0, _moment2.default)(task.task.start).format('MM/DD/YYYY');
        var stopTime = (0, _moment2.default)(task.task.stop).format('MM/DD/YYYY');
        if (startTime !== stopTime) {
            startTime = (0, _moment2.default)(task.task.start).format('MM/DD') + '|' + (0, _moment2.default)(task.task.stop).format('MM/DD YYYY');
        }

        // table.push([name, outputDuration, startTime])
        // if running timer use other table
        if (!task.task.stop) {
            // only min output
            outputDuration = (0, _Utils.getMinutes)(duration) + 'm';

            tableRunning.push([name, outputDuration]);
        } else {
            // format nicer if task has ended
            startTime = (0, _moment2.default)(task.task.start).format('h:mm:ss a');
            stopTime = (0, _moment2.default)(task.task.stop).format('h:mm:ss a');

            table.push([name, startTime, stopTime, outputDuration]);
        }
    });

    if (tableRunning.length > 0) {
        console.log(tableRunning.toString());
    }

    if (table.length > 0) {
        console.log(table.toString());
    }

    if (full) {
        var table2 = new _cliTable2.default();
        table2.push(
        // { 'Search': ['\"' + search + '\"'] },
        { 'Total time': [(0, _Utils.getMinutes)(total) + 'm (' + (0, _Utils.humanParseDiff)(total) + ')'] });

        if (rate) {
            table2.push({ 'Rate': [(0, _Utils.calcRate)(rate, total)] });
        }

        console.log(table2.toString());
    }
};
//# sourceMappingURL=Output.js.map