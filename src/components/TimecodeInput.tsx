import { forwardRef, useState, useEffect } from "react";
import { Timecode } from "../core/timecode";

const TimecodeInput = forwardRef(({ value, onNewValue, disabled = false }: { value: Timecode, onNewValue: (value: Timecode) => void, disabled?: boolean }, ref: React.Ref<HTMLInputElement>) => {
    const [timecode, setTimecode] = useState(value.toString());
    const [lastValidTimecode, setLastValidTimecode] = useState(value.toString());

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
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTimecode(e.target.value);
    }

    return <input className="border p-2 rounded" type="text" value={timecode} onChange={handleChange} onBlur={handleBlur} ref={ref} disabled={disabled} />;
});

export default TimecodeInput;
