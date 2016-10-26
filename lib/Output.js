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
    var table = new _cliTable2.default({
        head: ['Duration', 'Dates', 'Task'],
        chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
        colAligns: ['right', 'center', 'left'],
        style: { head: ['green'] }
    });
    var total = 0;
    var head = 'Search: ' + search + ' \n';

    tasks.map(function (task, index) {
        var duration = (0, _moment2.default)(task.task.stop).diff((0, _moment2.default)(task.task.start), 'seconds');
        total += duration;

        var outputDuration = (0, _Utils.humanParseDiff)(duration);
        outputDuration += ' (' + (0, _Utils.getMinutes)(duration) + 'm)'; // add min in parens

        var name = task.name;
        var startTime = (0, _moment2.default)(task.task.start).format('MM/DD/YYYY');
        var stopTime = (0, _moment2.default)(task.task.stop).format('MM/DD/YYYY');
        if (startTime !== stopTime) {
            startTime = (0, _moment2.default)(task.task.start).format('MM/DD') + '|' + (0, _moment2.default)(task.task.stop).format('MM/DD YYYY');
        }
        table.push([outputDuration, startTime, name]);
    });

    console.log(table.toString());

    if (full) {
        var table2 = new _cliTable2.default();
        table2.push(
        // { 'Search': ['\"' + search + '\"'] },
        { 'Total time': [(0, _Utils.humanParseDiff)(total) + ' (' + (0, _Utils.getMinutes)(total) + 'm)'] });

        if (rate) {
            table2.push({ 'Rate': [(0, _Utils.calcRate)(rate, total)] });
        }

        console.log(table2.toString());
    }
};
//# sourceMappingURL=Output.js.map