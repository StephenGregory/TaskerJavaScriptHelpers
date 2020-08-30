/*global flash, flashLong, setLocal, setGlobal, exit */

function areWeOnAndroid() {
    return typeof window !== 'undefined';
}
exports.default = {
    /**
    * Get a global variable in Tasker
    * @param {String} variableName - The variable to retrieve (with or without the % prefix)
    * @param {String|Array} defaultValue - The default return value, if the global is not present
    * @return {String|Array}
    */
    getGlobal: function (variableName, defaultValue) {
        if (areWeOnAndroid() && window['global']) {
            const globalVariable = global(variableName);

            return globalVariable ? globalVariable : defaultValue;
        }
        else {
            console.log(`global called to get "${variableName}"`);
            return defaultValue;
        }
    },
    /**
    * Call Tasker's flash action with text
    * @param {String} text - The text to flash
    */
    flashVariable: function (text) {
        if (areWeOnAndroid() && window['flash']) {
            flash(text);
        }
        else {
            console.log('flash called with');
            console.log(text);
        }
    },
    /**
    * Call Tasker's flash action with text, with flash long selected.
    * @param {String} text - The text to flash
    */
    flashLong: function (text) {
        if (areWeOnAndroid() && window['flashLong']) {
            flashLong(text);
        }
        else {
            console.log('flashLong called with');
            console.log(text);
        }
    },
    /**
    * Set a local variable in Tasker
    * @param {String} variableName - The local variable to set (with or without the % prefix)
    * @param {String|Array} value - The variable value
    */
    setLocalVariable: function (variableName, value) {
        /*
        In JavaScript(let) actions, local variables (all lower case, e.g. %myvar) are directly accessible in the JavaScript without the % sign (e.g. myvar). If the script changes the value, the new value is transparently used by subsequent actions in the task.

        The values of new (all lower case) variables declared in JavaScript (with the var keyword) are also available to subsequent actions, with the exception of those which are chain-declared e.g. var one = 'aval', two = 'bval';

        In JavaScript embedded in HTML, the functions local and setLocal must be used to access variables local to the scene hosting the WebView.

        */
        if (variableName.toLowerCase() !== variableName) {
            throw new Error(`When setting local variable, ${variableName} needs to be lowercase, or it won't be passed back to Tasker`);
        }
        if (value instanceof String && value === '') {
            console.warn(`Since you are setting ${variableName} to an empty string, the variable will not be set in Tasker`);
        }

        if (areWeOnAndroid() && window['setLocal']) {
            setLocal(variableName, value);
        }
        else {
            console.log(`setLocal called to set ${variableName} to:`);
            console.log(`${value}\n`);
        }
    },
    /**
    * Set a global variable in Tasker
    * @param {String} variableName - The global variable to set (with or without the % prefix)
    * @param {String} value - The variable value
    */
    setGlobalVariable: function (name, value) {
        if (areWeOnAndroid() && value instanceof Array) {
            console.warn('Arrays are not supported due to limitations of the Android JS interface.');
        }
        if (window['setGlobal']) {
            setGlobal(name, value);
        }
        else {
            console.log(`setGlobal called to set ${name} to:`);
            console.log(`${value}\n`);
        }
    },
    /**
    * Tell Tasker to exit this JavaScript script.
    */
    leaveJavaScriptlet: function () {
        if (areWeOnAndroid() && window['exit']) {
            exit();
        }
        else {
            console.log('exiting JavaScriptlet');
        }
    }
};
