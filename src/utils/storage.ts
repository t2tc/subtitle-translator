
function convertStringToBlob(str: string): Blob {
    return new Blob([str], { type: 'text/plain' });
}

function retriveStringFromIndexedDB(key: string): string {
    return localStorage.getItem(key) || '';
}

function storageFileToIndexedDB(file: Blob) {
    
}


