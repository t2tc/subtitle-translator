
class Timecode {
    hours: number
    minutes: number
    seconds: number
    milliseconds: number

    constructor(seconds: number)
    constructor(timecode: string)
    constructor(timecode: string | number) {
        if (typeof timecode === "string") {
            const [hours, minutes, seconds, milliseconds] = timecode.split(/[:,]/).map((v) => {
                if (Number.isNaN(Number(v))) {
                    throw new Error('Invalid timecode');
                }
                return Number(v);
            });
            this.hours = hours ?? 0;
            this.minutes = minutes ?? 0;
            this.seconds = seconds ?? 0;
            this.milliseconds = milliseconds ?? 0;
        } else if (typeof timecode === "number") {
            this.hours = Math.floor(timecode / 3600);
            this.minutes = Math.floor((timecode % 3600) / 60);
            this.seconds = Math.floor(timecode % 60);
            this.milliseconds = Math.floor((timecode % 1) * 1000);
        } else {
            throw new Error('Invalid timecode');
        }
        if (this.hours < 0 || this.minutes < 0 || this.seconds < 0 || this.milliseconds < 0) {
            throw new Error('Invalid timecode');
        }
        if (this.milliseconds >= 1000 || this.seconds >= 60 || this.minutes >= 60) {
            throw new Error('Invalid timecode');
        }
    }

    toSeconds() {
        return this.hours * 3600 + this.minutes * 60 + this.seconds + this.milliseconds / 1000;
    }

    toTime() {
        return {
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            milliseconds: this.milliseconds
        };
    }

    toString() {
        const hours = this.hours.toString().padStart(2, '0');
        const minutes = this.minutes.toString().padStart(2, '0');
        const seconds = this.seconds.toString().padStart(2, '0');
        const milliseconds = this.milliseconds.toString().padStart(3, '0');
        return `${hours}:${minutes}:${seconds},${milliseconds}`;
    }
};

function duration(timecode1: Timecode, timecode2: Timecode) {
    return timecode2.toSeconds() - timecode1.toSeconds();
}

export { Timecode, duration };
