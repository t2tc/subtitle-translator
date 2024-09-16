import { SubtitleItem } from "./subtitle";
import { Timecode } from "./timecode";

function parseSubRipFormat(srt: string): SubtitleItem[] {
    // TODO(tl): handle illegal srt files
    return srt.split('\n\n').map((subtitle) => {
        const [id, timecode, ...textlines] = subtitle.split('\n');
        if(id.trim() === '') {
            return null;
        }
        const [start, end] = timecode.split('-->').map((v) => v.trim());
        return {
            start: new Timecode(start),
            end: new Timecode(end),
            text: textlines.join('\n').trim() || '' // to remove the trailing \n
        };
    }).filter((v) => v !== null) as SubtitleItem[];
}

function serializeSubRipFormat(subtitles: SubtitleItem[]) {
    const divider = '-->';
    return subtitles.map((subtitle, index) => {
        return `${index + 1}\n${subtitle.start.toString()} ${divider} ${subtitle.end.toString()}\n${subtitle.text}\n\n`;
    }).join('');
}

export {
    parseSubRipFormat,
    serializeSubRipFormat
}