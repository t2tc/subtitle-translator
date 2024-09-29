import { SubtitleStore } from "./subtitleStore";
import { parseSubRipFormat, serializeSubRipFormat } from "./srt";
import { Timecode } from "./timecode";
import { ReactiveUIStates } from "./uiStates";
import { SubtitleItem } from "./subtitle";

async function openSrtFile() {
    try {
        const [fileHandle] = await (window as any).showOpenFilePicker({
            types: [
                {
                    description: 'Subtitle files',
                    accept: {
                        'text/plain': ['.srt']
                    }
                }
            ],
            multiple: false
        });
        const file = await fileHandle.getFile();
        const text = await file.text();
        const subtitle = parseSubRipFormat(text);
        SubtitleStore.setContent(subtitle);
    } catch (error) {
        console.error('Error selecting file:', error);
    }
}

async function saveSrtFile() {
    const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: 'subtitle.srt',
        types: [
            {
                description: 'Subtitle files',
                accept: {
                    'text/plain': ['.srt']
                }
            }
        ]
    });
    const file = await fileHandle.createWritable();
    await file.write(serializeSubRipFormat(SubtitleStore.getSnapshot()));
    await file.close();
}

function insertNewLineAfter() {
    let selectedIndex = ReactiveUIStates.subtitle.currentSelected.get();
    let index: number;
    if (selectedIndex === null) {
        return;
    }
    if (selectedIndex instanceof Array) {
        index = selectedIndex[selectedIndex.length - 1];
    } else {
        index = selectedIndex;
    }
    const newLine: SubtitleItem = {
        text: '',
        start: new Timecode('00:00:00,000'),
        end: new Timecode('00:00:00,000'),
    }
    SubtitleStore.insert(newLine, index + 1);
}

function insertNewLineBefore() {

}

function newLine() {
    SubtitleStore.push({
        start: new Timecode('00:00:00,000'),
        end: new Timecode('00:00:00,000'),
        text: ''
    });
}

export {
    openSrtFile,
    saveSrtFile,
    insertNewLineAfter,
    insertNewLineBefore,
    newLine
}
