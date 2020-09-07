const path = require('path');
const taskerSandbox = require('../src/sandbox.tasker').default;

const allMachines = require('./fixtures/laundryMachines.json');
/* all local variables accessible from Tasker are strings */

/* eslint-disable camelcase */
const taskerLocalVariables = {
    cardnumber: '1234',
    allmachinesjson: JSON.stringify(allMachines),
    availability_wait_time_mins: 5,
    address: '123 Fake Street'
};
/* eslint-enable camelcase */

const currentScriptFilename = path.basename(__filename);
const scriptFilenameToTest = currentScriptFilename.replace('sandbox.', '');
taskerSandbox(scriptFilenameToTest, taskerLocalVariables);
