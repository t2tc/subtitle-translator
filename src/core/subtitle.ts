import { Timecode } from "./timecode";

type SubtitleItem = {
    start: Timecode;
    end: Timecode;
    text: string;
}

export { type SubtitleItem };
