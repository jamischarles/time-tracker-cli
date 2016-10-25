'use strict';

require('babel-polyfill');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _Task = require('./Task');

var _Task2 = _interopRequireDefault(_Task);

var _Output = require('./Output');

var _Utils = require('./Utils');

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify();

/*
 *
 *
 TODO:
- What if it's just a foreground process?
- you pause or stop it
- then it prints the whole table for you...

 */
//

module.exports = function createTimer(p) {

    _commander2.default.version(_package2.default.version).description('Tiny time tracker for projects').option('-s, --start <task> <description>', 'Start the timer task.')
    // .option('-f, --finish <task> <description>', 'Stops the timer task.')
    // FIXME: Maybe add optional params?
    .option('-f, --finish ', 'Stops the timer task.').option('-c, --clear ', 'Delete all timers.')

    // FIXME: Doesn't seem to actually work...
    .option('-d, --description <description>', 'Adds a description for the task only in start/stop methods.')

    // .option('-a, --add <task> <timeString>', 'Adds time to a task. Example: "1h2m3s"')
    // .option('--remove <task> <timeString>', 'Subtract time from a task. Example: "1h2m3s"')

    // .option('-l, --log <task>', 'Logs the timer task.')
    // .option('-r, --report <task> <rate>', 'Report time of the tasks, searched by key, you can report all using all as key. Also you can pass a rate to calc an amount ex: 20h, calc the hours and mulpitly by 20')
    .option('-r, --report ', 'Report time of the tasks, searched by key, you can report all using all as key. Also you can pass a rate to calc an amount ex: 20h, calc the hours and mulpitly by 20')
    // .option('-e, --export', 'Prints the json of all tasks.')

    .parse(p.argv);

    var description = void 0;
    if (_commander2.default.start) {
        description = _commander2.default.description || _commander2.default.args[0];
        _Manager2.default.start(_commander2.default.start, description);

        (0, _Output.sumarize)('all', _Manager2.default.search('all'), _commander2.default.args[0], true);
        // setTimeout(function(){
        //     sumarize(program.report, timer.search(program.start), program.args[0], true)
        // },50);

        // show the timer...
    } else if (_commander2.default.finish) {
        // if no param passed in (for now we aren't passing any, then just remove the currently running task
        // description = program.description || program.args[0]
        //
        // default to all if no param is passed.
        var taskName = _commander2.default.args[0] || 'all';

        // console.log('program', program)

        // give us the last one...
        // stop the last task  that matches...
        var arr = _Manager2.default.search(taskName);
        var result = arr[arr.length - 1];

        _Manager2.default.stop(result.name);

        (0, _Output.sumarize)('all', _Manager2.default.search('all'), _commander2.default.args[0], true);
        console.log('Stopped:', result.name);
    } else if (_commander2.default.clear) {
        _Manager2.default.clearStore();
        // show all of them now...
        (0, _Output.sumarize)('all', _Manager2.default.search('all'), _commander2.default.args[0], true);

        console.log('Store deleted');

        // } else if (program.add){
        //     timer.modifyTask('add', program.add, program.args[0])
        //     sumarize(program.add, timer.search(program.add))
        // } else if (program.remove){
        //     timer.modifyTask('subtract', program.remove, program.args[0])
        //     sumarize(program.remove, timer.search(program.remove))
    } else if (_commander2.default.log) {
        setInterval(function () {
            process.stdout.clearLine();
            process.stdout.write('\r Task: ' + _commander2.default.log + ' ' + (0, _Utils.humanParseDiff)(_Manager2.default.getTime(_commander2.default.log)));
        }, 100);
    } else if (_commander2.default.report) {
        // sumarize(program.report, timer.search(program.report), program.args[0], true)
        (0, _Output.sumarize)('all', _Manager2.default.search('all'), _commander2.default.args[0], true);
    } else if (_commander2.default.export) {
        console.log(JSON.stringify(_Manager2.default.getTasksJson(), null, 4));
    } else {
        (0, _Output.sumarize)('all', _Manager2.default.search('all'), _commander2.default.args[0], true);
    }
};
//# sourceMappingURL=index.js.map