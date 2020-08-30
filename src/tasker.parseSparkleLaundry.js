const formatDistanceToNowStrict = require('date-fns/formatDistanceToNowStrict');
const differenceInMinutes = require('date-fns/differenceInMinutes');

const Tasker = require('./lib/Tasker').default;

function getMachines(machines, estimatedTimeToComplete, cardNumber) {
    const now = new Date();
    return machines
        .filter(machine => machine.last_used_by === cardNumber)
        .map(machine => {
            const lastUsedDate = new Date(machine.last_used_at);
            const diffMinutes = differenceInMinutes(now, lastUsedDate);
            let estimatedMinutesRemaining = (estimatedTimeToComplete - diffMinutes);

            if (estimatedMinutesRemaining < 0) {
                estimatedMinutesRemaining = 0;
            }

            if (estimatedMinutesRemaining === 0 && machine.display_status.toLowerCase() === 'busy') {
                /* if it is still busy while no estimated time remaining, add some extra minutes */
                estimatedMinutesRemaining += 5;
            }
            else if (machine.display_status.toLowerCase() === 'available') {
                estimatedMinutesRemaining = 0;
            }

            return {
                number: machine.Number,
                usedAt: machine.last_used_at,
                status: machine.display_status,
                isOnline: machine.is_online,
                usedMinutesAgo: differenceInMinutes(now, lastUsedDate),
                minutesRemaining: estimatedMinutesRemaining,
                usedMinutesAgoFormat: formatDistanceToNowStrict(lastUsedDate, { unit: 'minute' })
            };
        })
        .sort((a, b) => b.usedMinutesAgo - a.usedMinutesAgo);
}

function formatInProgressMachine(machine) {
    return `${machine.number} has ${machine.minutesRemaining} minutes left (started ${machine.usedMinutesAgoFormat} ago) [${machine.status}]`;
}

function formatDoneMachines(machine) {
    return `${machine.number}`;
}

function getDoneMachines(machines) {
    return machines.filter(machine => machine.minutesRemaining === 0);
}

function getInProgressMachines(machines) {
    return machines.filter(machine => machine.minutesRemaining !== 0);
}

function formatMachines(machines, formatFunction, joiner) {
    return machines.map(machine => formatFunction(machine)).join(joiner);
}

function parseData(allMachines, streetAddress, cardNumber) {
    const matchingBuildings = allMachines.display_locations.filter(location => location.location_address.includes(streetAddress));
    if (matchingBuildings.length !== 1) {
        return Tasker.leaveJavaScriptlet();
    }

    const ourBuilding = matchingBuildings[0];

    const dryerAvailability = `Dryers: ${ourBuilding.availableDryers}/${ourBuilding.allDryers.length}`;
    const washerAvailability = `Washers: ${ourBuilding.availableWashers}/${ourBuilding.allWashers.length}`;

    const estimatedMinutes = {
        dryer: 45,
        washer: 35
    };

    const washersUsedByMe = getMachines(ourBuilding.allWashers, estimatedMinutes.washer, cardNumber);
    const dryersUsedByMe = getMachines(ourBuilding.allDryers, estimatedMinutes.dryer, cardNumber);

    Tasker.setLocalVariable('dryer_availability', dryerAvailability);
    Tasker.setLocalVariable('washer_availability', washerAvailability);

    Tasker.setLocalVariable('done_machines', formatMachines(getDoneMachines(washersUsedByMe.concat(dryersUsedByMe)), formatDoneMachines, ', '));
    Tasker.setLocalVariable('in_progress_machines', formatMachines(getInProgressMachines(washersUsedByMe.concat(dryersUsedByMe)), formatInProgressMachine, ', '));

    if (washersUsedByMe.length) {
        Tasker.setLocalVariable('washer_time_remaining_min', washersUsedByMe[0].minutesRemaining);
        Tasker.setLocalVariable('washer_time_remaining_max', washersUsedByMe[washersUsedByMe.length - 1].minutesRemaining);
    }
    if (dryersUsedByMe.length) {
        Tasker.setLocalVariable('dryer_time_remaining_min', dryersUsedByMe[0].minutesRemaining);
        Tasker.setLocalVariable('dryer_time_remaining_max', dryersUsedByMe[dryersUsedByMe.length - 1].minutesRemaining);
    }
    return Tasker.leaveJavaScriptlet();
}
/* eslint-disable no-undef */
/* alias injected local variables */
const allMachines = JSON.parse(allmachinesjson);
const streetAddress = address;
const cardNumber = parseInt(cardnumber);
/* eslint-enable no-undef */

parseData(allMachines, streetAddress, cardNumber);
