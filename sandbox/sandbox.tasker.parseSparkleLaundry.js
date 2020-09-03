const path = require('path');
const taskerSandbox = require('../src/sandbox.tasker').default;

const allMachines = require('./fixtures/laundryMachines.json');
/* all local variables accessible from Tasker are strings */
const taskerLocalVariables = {
    cardnumber: '1234',
    allmachinesjson: JSON.stringify(allMachines),
    address: '123 Fake Street'
};

const currentScriptFilename = path.basename(__filename);
const scriptFilenameToTest = currentScriptFilename.replace('sandbox.', '');
taskerSandbox(scriptFilenameToTest, taskerLocalVariables);
