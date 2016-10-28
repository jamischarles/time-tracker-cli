import moment from 'moment'
import Table from 'cli-table'

import {getMinutes, humanParseDiff, recognizeModifierTiming, calcRate} from './Utils'

export const sumarize = function(search, tasks, rate, full) {

    if (tasks.length === 0 ) {
        return console.log('No Timers are running.')
    }



    let table = new Table({
        // head: ['Task', 'Duration', 'Dates'],
        head: ['<Done>', 'Start', 'Stop', 'Duration'],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
        colAligns: ['left', 'right', 'center'],
        style: { head: ['green'] }
    });
    let total = 0
    let head= `Search: ${search} \n`

    // separate table for running timers
    let tableRunning = new Table({
        // head: ['Task', 'Duration', 'Dates'],
        head: ['<Running>', 'Duration'],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
        colAligns: ['left', 'right', 'center'],
        style: { head: ['green'] }
    })

    tasks.map((task, index)=>{
        let duration = moment(task.task.stop).diff(moment(task.task.start), 'seconds')
        total += duration

        let outputDuration = humanParseDiff(duration)
        outputDuration = ` ${getMinutes(duration)}m (${outputDuration})` // add min in parens

        let name = task.name

        // FIXME: Kill this
        let startTime = moment(task.task.start).format('MM/DD/YYYY')
        let stopTime = moment(task.task.stop).format('MM/DD/YYYY')
        if (startTime !== stopTime){
            startTime = moment(task.task.start).format('MM/DD') + '|' + moment(task.task.stop).format('MM/DD YYYY')
        }

        // table.push([name, outputDuration, startTime])
        // if running timer use other table
        if (!task.task.stop) {
            // only min output
            outputDuration = `${getMinutes(duration)}m`

            tableRunning.push([name, outputDuration])
        } else {
            // format nicer if task has ended
            startTime = moment(task.task.start).format('h:mm:ss a')
            stopTime = moment(task.task.stop).format('h:mm:ss a')

            table.push([name, startTime, stopTime, outputDuration])
        }
    })

    if (tableRunning.length > 0) {
        console.log(tableRunning.toString());
    }

    if (table.length > 0) {
        console.log(table.toString());
    }


    if (full){
        let table2 = new Table()
        table2.push(
            // { 'Search': ['\"' + search + '\"'] },
            { 'Total time': [`${getMinutes(total)}m (${humanParseDiff(total)})`] },
            // { 'Total minutes': [getMinutes(total)] + 'm' }
        )

        if (rate){
            table2.push({ 'Rate': [calcRate(rate, total)] })
        }

        console.log(table2.toString());
    }
}
