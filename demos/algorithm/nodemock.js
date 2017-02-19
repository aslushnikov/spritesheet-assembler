window.require = function(arg) {
    if (arg.startsWith('./'))
        arg = arg.substring(2);
    return window[arg];
}

window.module = {};
