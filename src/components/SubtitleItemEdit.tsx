import { forwardRef, useRef, useImperativeHandle } from "react";
import { SubtitleItem } from "../core/subtitle";
import TimecodeInput from "./TimecodeInput";
import { XIcon } from "lucide-react";
import { IconButton } from "./Elements";

const SubtitleItemEdit = forwardRef(({ item, onItemChange, onMerge, onRemove, onRequestFocus, onSplit, index, selected }: {
    index: number,
    item: SubtitleItem,
    onItemChange: (item: SubtitleItem) => void,
    onMerge: (indexStart: number, indexEnd: number) => void,
    onRemove: (index: number) => void,
    onRequestFocus: (index: 1 | -1) => void,
    onSplit: (index: number, position: number) => void,
    selected: boolean,
}, ref: React.Ref<any>) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const timecodeInputStartRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focusTextarea: (offset: number) => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(offset, offset);
        },
        focusTimecodeInputStart: () => {
            timecodeInputStartRef.current?.focus();
            timecodeInputStartRef.current?.select();
        }
    }));

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Backspace') {
            const textarea = textareaRef.current;
            if (textarea) {
                const { selectionStart, selectionEnd } = textarea;
                if (selectionStart === selectionEnd && selectionStart === 0) {
                    e.preventDefault();
                    onMerge(index - 1, index);
                }
            }
        }
        if (e.key === 'Enter') {
            const textarea = textareaRef.current;
            if (textarea) {
                const { selectionStart, selectionEnd } = textarea;
                if (selectionStart === selectionEnd && selectionStart > 0 && selectionStart < item.text.length) {
                    onSplit(index, selectionStart);
                    e.preventDefault();
                } else if (selectionStart === item.text.length) {
                    onSplit(index, selectionStart);
                    e.preventDefault();
                }
            }
        }
    }

    const className = `border-b flex items-stretch ${selected ? 'bg-amber-100 shadow-glow shadow-amber-500' : ''}`;

    return <>
        <div className={className}>
            <h3 className="flex items-center justify-right flex-shrink-0 w-4ch pr-1ch font-bold text-sm text-neutral-600 select-none bg-neutral-300">{index}</h3>
            <TimecodeInput value={item.start} onNewValue={(value) => {
                onItemChange({ ...item, start: value })
            }} ref={timecodeInputStartRef} name="timecode-input-start" />
            <textarea className="border-l ml-1 pl-1 w-full text-sm resize-none focus:ring-1 outline-none bg-transparent" rows={1} value={item.text} onChange={(e) => {
                onItemChange({ ...item, text: e.target.value })
            }} onKeyDown={handleKeyDown} ref={textareaRef} name="textarea-text" />
            <div className="flex">
                <IconButton name="Remove" onClick={() => onRemove(index) }><XIcon className="w-4 h-4 stroke-gray-600" /></IconButton>
        </div>
    </div >
    </>
});

export default SubtitleItemEdit;