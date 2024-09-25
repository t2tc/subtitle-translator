import { forwardRef, useState, useEffect, useRef, useImperativeHandle } from "react";
import { Timecode } from "../core/timecode";

type TimecodeInputRef = {
    select: () => void,
}

const TimecodeInput = forwardRef(
    function TimecodeInput({ value, onNewValue, disabled = false, name = "timecode" }: { value: Timecode, onNewValue: (value: Timecode) => void, disabled?: boolean, name?: string }, ref: React.Ref<TimecodeInputRef>) {
        const [timecode, setTimecode] = useState(value);
        const [timecodeString, setTimecodeString] = useState(value.toString());
        const [lastValidTimecode, setLastValidTimecode] = useState(value);

        const [isEditing, setIsEditing] = useState(false);

        const inputRef = useRef<HTMLInputElement>(null);

        const hoursRef = useRef<HTMLSpanElement>(null);
        const minutesRef = useRef<HTMLSpanElement>(null);
        const secondsRef = useRef<HTMLSpanElement>(null);
        const millisecondsRef = useRef<HTMLSpanElement>(null);

        useImperativeHandle(ref, () => ({
            select: () => {
                setIsEditing(true);
                queueMicrotask(() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                        inputRef.current.select();
                    }
                });
            }
        }));

        useEffect(() => {
            setTimecodeString(timecode.toString());
        }, [timecode]);

        useEffect(() => {
            setLastValidTimecode(timecode);
        }, [timecode]);

        function handleBlur() {
            try {
                const newTimecode = new Timecode(timecodeString);
                onNewValue(newTimecode);
                setTimecode(newTimecode);
                setLastValidTimecode(newTimecode);
            } catch (error) {
                console.error('Invalid timecode input:', timecodeString);
                setTimecodeString(lastValidTimecode.toString());
                setTimecode(lastValidTimecode);
            } finally {
                setIsEditing(false);
            }
        }

        function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
            setTimecodeString(e.target.value);
        }

        const isHoursDown = useRef(false);

        function handleHoursDown(e: React.PointerEvent<HTMLSpanElement>) {
            isHoursDown.current = true;
            hoursRef.current?.setPointerCapture(e.pointerId);
        }

        function handleHoursMove(e: React.PointerEvent<HTMLSpanElement>) {
            if (!isHoursDown.current) return;
            const movementY = e.movementY;
            const newHours = timecode.hours + movementY;
            if (newHours < 0) { return; }
            const newTimecode = new Timecode([newHours, value.minutes, value.seconds, value.milliseconds]);
            setTimecode(newTimecode);
            e.stopPropagation();
        }

        function handleHoursUp(e: React.PointerEvent<HTMLSpanElement>) {
            if (!isHoursDown.current) return;
            isHoursDown.current = false;
            onNewValue(timecode);
            hoursRef.current?.releasePointerCapture(e.pointerId);
        }

        const isMinutesDown = useRef(false);

        function handleMinutesDown(e: React.PointerEvent<HTMLSpanElement>) {
            isMinutesDown.current = true;
            minutesRef.current?.setPointerCapture(e.pointerId);
        }

        function handleMinutesMove(e: React.PointerEvent<HTMLSpanElement>) {
            if (!isMinutesDown.current) return;
            const movementY = e.movementY;
            const newMinutes = timecode.minutes + movementY;
            if (newMinutes < 0 || newMinutes >= 60) { return; }
            const newTimecode = new Timecode([value.hours, newMinutes, value.seconds, value.milliseconds]);
            setTimecode(newTimecode);
            e.stopPropagation();
        }

        function handleMinutesUp(e: React.PointerEvent<HTMLSpanElement>) {
            if (!isMinutesDown.current) return;
            isMinutesDown.current = false;
            onNewValue(timecode);
            minutesRef.current?.releasePointerCapture(e.pointerId);
        }

        const isSecondsDown = useRef(false);

        function handleSecondsDown(e: React.PointerEvent<HTMLSpanElement>) {
            isSecondsDown.current = true;
            secondsRef.current?.setPointerCapture(e.pointerId);
        }

        function handleSecondsMove(e: React.PointerEvent<HTMLSpanElement>) {
            if (!isSecondsDown.current) return;
            const movementY = e.movementY;
            const newSeconds = timecode.seconds + movementY;
            if (newSeconds < 0 || newSeconds >= 60) { return; }
            const newTimecode = new Timecode([value.hours, value.minutes, newSeconds, value.milliseconds]);
            setTimecode(newTimecode);
            e.stopPropagation();
        }

        function handleSecondsUp(e: React.PointerEvent<HTMLSpanElement>) {
            if (!isSecondsDown.current) return;
            isSecondsDown.current = false;
            onNewValue(timecode);
            secondsRef.current?.releasePointerCapture(e.pointerId);
        }

        const isMillisecondsDown = useRef(false);

        function handleMillisecondsDown(e: React.PointerEvent<HTMLSpanElement>) {
            isMillisecondsDown.current = true;
            millisecondsRef.current?.setPointerCapture(e.pointerId);
        }

        function handleMillisecondsMove(e: React.PointerEvent<HTMLSpanElement>) {
            if (!isMillisecondsDown.current) return;
            const movementY = e.movementY;
            const newMilliseconds = timecode.milliseconds + movementY;
            if (newMilliseconds < 0 || newMilliseconds >= 1000) { return; }
            const newTimecode = new Timecode([value.hours, value.minutes, value.seconds, newMilliseconds]);
            setTimecode(newTimecode);
            e.stopPropagation();
        }

        function handleMillisecondsUp(e: React.PointerEvent<HTMLSpanElement>) {
            if (!isMillisecondsDown.current) return;
            isMillisecondsDown.current = false;
            onNewValue(timecode);
            millisecondsRef.current?.releasePointerCapture(e.pointerId);
        }

        function handleHoursWheel(e: React.WheelEvent<HTMLSpanElement>) {
            const newHours = timecode.hours + (e.deltaY > 0 ? 1 : -1);
            if (newHours < 0) { return; }
            const newTimecode = new Timecode([newHours, value.minutes, value.seconds, value.milliseconds]);
            setTimecode(newTimecode);
            onNewValue(newTimecode);
            e.stopPropagation();
            e.preventDefault();
        }

        function handleMinutesWheel(e: React.WheelEvent<HTMLSpanElement>) {
            const newMinutes = timecode.minutes + (e.deltaY > 0 ? 1 : -1);
            if (newMinutes < 0 || newMinutes >= 60) { return; }
            const newTimecode = new Timecode([value.hours, newMinutes, value.seconds, value.milliseconds]);
            setTimecode(newTimecode);
            onNewValue(newTimecode);
            e.stopPropagation();
        }

        function handleSecondsWheel(e: React.WheelEvent<HTMLSpanElement>) {
            const newSeconds = timecode.seconds + (e.deltaY > 0 ? 1 : -1);
            if (newSeconds < 0 || newSeconds >= 60) { return; }
            const newTimecode = new Timecode([value.hours, value.minutes, newSeconds, value.milliseconds]);
            setTimecode(newTimecode);
            onNewValue(newTimecode);
            e.stopPropagation();
        }

        function handleMillisecondsWheel(e: React.WheelEvent<HTMLSpanElement>) {
            const newMilliseconds = timecode.milliseconds + (e.deltaY > 0 ? 1 : -1);
            if (newMilliseconds < 0 || newMilliseconds >= 1000) { return; }
            const newTimecode = new Timecode([value.hours, value.minutes, value.seconds, newMilliseconds]);
            setTimecode(newTimecode);
            onNewValue(newTimecode);
            e.stopPropagation();
        }

        function handleDoubleClick() {
            setIsEditing(true);
            queueMicrotask(() => {
                if (ref && 'current' in ref && ref.current) {
                    inputRef.current?.select();
                }
            });
        }

        const className = `cursor-ns-resize text-sm font-mono w-13ch flex items-center flex-shrink-0 select-none ${disabled ? 'text-neutral-400' : ''}`;

        const readOnlyContent = <div className={className} onDoubleClick={handleDoubleClick}>
            <span className="hover:bg-blue-200" ref={hoursRef} onPointerDown={handleHoursDown} onPointerUp={handleHoursUp} onPointerMove={handleHoursMove} onWheel={handleHoursWheel} data-multi-select-prohibited>{timecode.hoursString}</span>
            :<span className="hover:bg-blue-200" ref={minutesRef} onPointerDown={handleMinutesDown} onPointerUp={handleMinutesUp} onPointerMove={handleMinutesMove} onWheel={handleMinutesWheel} data-multi-select-prohibited>{timecode.minutesString}</span>
            :<span className="hover:bg-blue-200" ref={secondsRef} onPointerDown={handleSecondsDown} onPointerUp={handleSecondsUp} onPointerMove={handleSecondsMove} onWheel={handleSecondsWheel} data-multi-select-prohibited>{timecode.secondsString}</span>
            ,<span className="hover:bg-blue-200" ref={millisecondsRef} onPointerDown={handleMillisecondsDown} onPointerUp={handleMillisecondsUp} onPointerMove={handleMillisecondsMove} onWheel={handleMillisecondsWheel} data-multi-select-prohibited>{timecode.millisecondsString}</span>
        </div>;

        const inputContent = <input className="text-sm font-mono w-13ch outline-none p-0 focus:ring-1 focus:border-blue-300" type="text" value={timecodeString} onChange={handleChange} onBlur={handleBlur} ref={inputRef} disabled={disabled} name={name} />;

        return isEditing ? inputContent : readOnlyContent;
    });

export { TimecodeInput, type TimecodeInputRef };