import 'babel-polyfill'

import program from 'commander'
import updateNotifier from 'update-notifier'

import Task from './Task'
import {sumarize} from './Output'
import {humanParseDiff} from './Utils'

import timer from './Manager'
import pkg from '../package.json'

updateNotifier({pkg}).notify()


/*
 *
 *
 TODO:
- What if it's just a foreground process?
- you pause or stop it
- then it prints the whole table for you...

 */
//

module.exports = function createTimer (p) {

    program
        .version(pkg.version)
        .description('Tiny time tracker for projects')

        .option('-s, --start <task> <description>', 'Start the timer task.')
        // .option('-f, --finish <task> <description>', 'Stops the timer task.')
        // FIXME: Maybe add optional params?
        .option('-f, --finish ', 'Stops the timer task.')

        .option('-c, --clear ', 'Delete all timers.')

        // FIXME: Doesn't seem to actually work...
        .option('-d, --description <description>', 'Adds a description for the task only in start/stop methods.')

        // .option('-a, --add <task> <timeString>', 'Adds time to a task. Example: "1h2m3s"')
        // .option('--remove <task> <timeString>', 'Subtract time from a task. Example: "1h2m3s"')

        // .option('-l, --log <task>', 'Logs the timer task.')
        // .option('-r, --report <task> <rate>', 'Report time of the tasks, searched by key, you can report all using all as key. Also you can pass a rate to calc an amount ex: 20h, calc the hours and mulpitly by 20')
        .option('-r, --report ', 'Report time of the tasks, searched by key, you can report all using all as key. Also you can pass a rate to calc an amount ex: 20h, calc the hours and mulpitly by 20')
        // .option('-e, --export', 'Prints the json of all tasks.')

        .parse(p.argv)

    let description
    if (program.start){
        description = program.description || program.args[0]
        timer.start(program.start, description)

        sumarize('all', timer.search('all'), program.args[0], true)
        // setTimeout(function(){
        //     sumarize(program.report, timer.search(program.start), program.args[0], true)
        // },50);

        // show the timer...

    } else if (program.finish){
        // if no param passed in (for now we aren't passing any, then just remove the currently running task
        // description = program.description || program.args[0]
        //
        // default to all if no param is passed.
        var taskName = program.args[0] || 'all';

        // console.log('program', program)

        // give us the last one...
        // stop the last task  that matches...
        var arr = timer.search(taskName)
        var result = arr[arr.length -1]

        timer.stop(result.name)

        console.log('Stopped:', result.name)
        sumarize('all', timer.search('all'), program.args[0], true)
    } else if (program.clear){
        timer.clearStore();
        // show all of them now...
        console.log('Store deleted');
        sumarize('all', timer.search('all'), program.args[0], true)


    // } else if (program.add){
    //     timer.modifyTask('add', program.add, program.args[0])
    //     sumarize(program.add, timer.search(program.add))
    // } else if (program.remove){
    //     timer.modifyTask('subtract', program.remove, program.args[0])
    //     sumarize(program.remove, timer.search(program.remove))
    } else if (program.log){
        setInterval(function() {
            process.stdout.clearLine()
            process.stdout.write(`\r Task: ${program.log} ${humanParseDiff(timer.getTime(program.log))}`)
        }, 100)
    } else if (program.report){
        // sumarize(program.report, timer.search(program.report), program.args[0], true)
        sumarize('all', timer.search('all'), program.args[0], true)
    } else if (program.export){
        console.log(JSON.stringify(timer.getTasksJson(), null, 4))
    } else {
        if (program.args.length !== 0) {
            // console.log('\x1b[36m', 'sometext' ,'\x1b[0m');
            console.log('\x1b[31m'); // red
            console.error('Error: You must use a flag if you pass params.')
            console.log('\x1b[0m'); // end red

            program.outputHelp();

            return

        }

        sumarize('all', timer.search('all'), program.args[0], true)
    }

}
