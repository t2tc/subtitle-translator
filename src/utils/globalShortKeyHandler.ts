
function isSystemDarwin() {
    return navigator.userAgent.includes('Macintosh');
}

const predefinedShortKeys = {
    "command.save": {
        key: "s",
        meta: true,
        ctrl: true,
    },
    "command.open": {
        key: "o",
        meta: true,
        ctrl: true,
    },
    "command.selectAll": {
        key: "a",
        meta: true,
        ctrl: true,
    },
}

function registerGlobalShortKeyHandler() {
    window.addEventListener('keydown', (event) => {
        
    });
}

export { registerGlobalShortKeyHandler, isSystemDarwin };
