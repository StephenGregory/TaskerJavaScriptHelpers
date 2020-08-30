const vm = require('vm');
const fs = require('fs');
const path = require('path');

function convertVariablesToWhatTaskerWouldSend(taskerLocalVariables) {
    const convertedTaskerLocalVariables = {};
    Object.getOwnPropertyNames(taskerLocalVariables).forEach((propertyName) => {
        const propertyValue = taskerLocalVariables[propertyName];
        if (propertyValue instanceof Array) {
            convertedTaskerLocalVariables[propertyName] = propertyValue;
        }
        else if (propertyValue instanceof Function) {
            console.info(`Converting function ${propertyName} to String before passing it to JavaScript helper`);
            convertedTaskerLocalVariables[propertyName] = propertyValue.toString();
        }
        else if (propertyValue instanceof Object) {
            console.info(`Converting Object ${propertyName} to String before passing it to JavaScript helper`);
            convertedTaskerLocalVariables[propertyName] = JSON.stringify(propertyValue);
        }
        else {
            convertedTaskerLocalVariables[propertyName] = propertyValue;
        }
    });
    return convertedTaskerLocalVariables;
}

/**
* Run a JavaScript helper with a set of local Tasker variables
* @param {String} fileNameUnderTest - The filename of the helper to test
* @param {Object} taskerLocalVariables - key-value pairs of local variable values
*/
function runScript(fileNameUnderTest, taskerLocalVariables) {
    const fileUnderTest = path.join(__dirname, fileNameUnderTest);
    const doesFileUnderTestExist = fs.existsSync(fileUnderTest);

    if (!doesFileUnderTestExist) {
        console.error(`File you are testing does not exist: ${fileUnderTest}`);
        return;
    }

    const file = fs.readFileSync(fileUnderTest);

    const convertedTaskerLocalVariables = convertVariablesToWhatTaskerWouldSend(taskerLocalVariables);

    const context = {
        ...convertedTaskerLocalVariables,
        require: require
    };
    vm.createContext(context);
    const script = new vm.Script(file, { filename: fileUnderTest });
    script.runInContext(context);
}

exports.default = runScript;
