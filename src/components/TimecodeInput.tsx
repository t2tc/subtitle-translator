import { forwardRef, useState, useEffect, useRef } from "react";
import { Timecode } from "../core/timecode";

const TimecodeInput = forwardRef(({ value, onNewValue, disabled = false, name = "timecode" }: { value: Timecode, onNewValue: (value: Timecode) => void, disabled?: boolean, name?: string }, ref: React.Ref<any>) => {
    const [timecode, setTimecode] = useState(value.toString());
    const [lastValidTimecode, setLastValidTimecode] = useState(value.toString());

    const [isEditing, setIsEditing] = useState(false);

    const hoursRef = useRef<HTMLSpanElement>(null);
    const minutesRef = useRef<HTMLSpanElement>(null);
    const secondsRef = useRef<HTMLSpanElement>(null);
    const millisecondsRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setTimecode(value.toString());
    }, [value]);

    function handleBlur() {
        try {
            const newTimecode = new Timecode(timecode);
            onNewValue(newTimecode);
            setLastValidTimecode(timecode);
        } catch (error) {
            console.error('Invalid timecode:', timecode);
            setTimecode(lastValidTimecode);
        }
        setIsEditing(false);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTimecode(e.target.value);
    }

    const isHoursDown = useRef(false);

    function handleHoursDown(e: React.PointerEvent<HTMLSpanElement>) {
        console.log('handleHoursDown');
        isHoursDown.current = true;
        hoursRef.current?.setPointerCapture(e.pointerId);
    }

    function handleHoursMove(e: React.PointerEvent<HTMLSpanElement>) {
        if (!isHoursDown.current) return;
        const movementY = e.movementY;
        console.log('handleHoursMove', movementY);
        const hours = parseInt(timecode.split(':')[0] || '0');
        const newHours = hours + movementY;
        const newTimecode = new Timecode([newHours, value.minutes, value.seconds, value.milliseconds]);
        setTimecode(newTimecode.toString());
    }

    function handleHoursUp(e: React.PointerEvent<HTMLSpanElement>) {
        isHoursDown.current = false;
        console.log('handleHoursUp');
        console.log(timecode);
        hoursRef.current?.releasePointerCapture(e.pointerId);
    }

    const readOnlyContent = <div className="cursor-ns-resize text-sm font-mono w-13ch flex items-center flex-shrink-0 select-none" onDoubleClick={() => setIsEditing(true)}>
        <span className="hover:bg-blue-200" ref={hoursRef} onPointerDown={handleHoursDown} onPointerUp={handleHoursUp} onPointerMove={handleHoursMove}>{timecode.split(':')[0]}</span>
        :<span className="hover:bg-blue-200" ref={minutesRef}>{timecode.split(':')[1]}</span>
        :<span className="hover:bg-blue-200" ref={secondsRef}>{timecode.split(':')[2]}</span>
        ,<span className="hover:bg-blue-200" ref={millisecondsRef}>{timecode.split(':')[3]}</span>
    </div>;
    const inputContent = <input className="text-sm font-mono w-13ch outline-none p-0 focus:ring-1 focus:border-blue-300" type="text" value={timecode} onChange={handleChange} onBlur={handleBlur} ref={ref} disabled={disabled} name={name} />;

    return isEditing ? inputContent : readOnlyContent;
});

export default TimecodeInput;
