import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import { SubtitleItem } from "../core/subtitle";
import { TimecodeInput, type TimecodeInputRef } from "./TimecodeInput";
import { XIcon } from "lucide-react";
import { IconButton } from "./Elements";
import { MultiSelectManager } from "../core/multiSelectable";

type SubtitleItemEditRef = {
    focusTextarea: (offset: number) => void,
    focusTimecodeInput: () => void,
}

const SubtitleItemEdit = forwardRef(({
    index,
    item,
    onItemChange,
    onRequestMerge,
    onRequestRemove,
    onRequestFocusOtherItems,
    onRequestSplit,
    onRequestSelect,
    selected
}: {
    index: number,
    item: SubtitleItem,
    selected: boolean,
    onItemChange: (item: SubtitleItem) => void,
    onRequestMerge: (indexStart: number, indexEnd: number) => void,
    onRequestRemove: (index: number) => void,
    onRequestFocusOtherItems: (index: 1 | -1) => void,
    onRequestSplit: (index: number, position: number) => void,
    onRequestSelect: (multi: boolean) => void,
}, ref: React.Ref<SubtitleItemEditRef>) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const timecodeInputStartRef = useRef<TimecodeInputRef>(null);
    const rootRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => ({
        focusTextarea: (offset: number) => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(offset, offset);
        },
        focusTimecodeInput: () => {
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
                    onRequestMerge(index - 1, index);
                }
            }
        }
        if (e.key === 'Enter') {
            const textarea = textareaRef.current;
            if (textarea) {
                const { selectionStart, selectionEnd } = textarea;
                if (selectionStart === selectionEnd && selectionStart > 0 && selectionStart < item.text.length) {
                    onRequestSplit(index, selectionStart);
                    onRequestFocusOtherItems(1);
                    e.preventDefault();
                } else if (selectionStart === item.text.length) {
                    onRequestSplit(index, selectionStart);
                    e.preventDefault();
                }
            }
        }
    }

    useEffect(() => {
        const handle = MultiSelectManager.addElement(rootRef.current as HTMLElement, () => {
            console.log('MultiSelectManager.addElement');
        });
        return () => {
            handle();
        }
    }, []);

    const className = `border-b flex items-stretch ${selected ? 'bg-amber-100 shadow-glow shadow-amber-500' : ''}`;

    return (
        <subtitle-edit class={className} data-index={index} data-multi-selectable onPointerDown={(e) => {
            onRequestSelect(e.shiftKey);
        }} ref={rootRef}>
            <h3 className="flex items-center justify-right flex-shrink-0 w-4ch pr-1ch font-bold text-sm text-neutral-600 select-none bg-neutral-300">{index}</h3>
            <TimecodeInput value={item.start} onNewValue={(value) => {
                onItemChange({ ...item, start: value })
            }} ref={timecodeInputStartRef} name="timecode-input-start" />
            <textarea className="border-l ml-1 pl-1 w-full text-sm resize-none focus:ring-1 outline-none bg-transparent" rows={1} value={item.text} onChange={(e) => {
                onItemChange({ ...item, text: e.target.value })
            }} onKeyDown={handleKeyDown} ref={textareaRef} name="textarea-text" />
            <div className="flex">
                <IconButton name="Remove" onClick={() => onRequestRemove(index)}><XIcon className="w-4 h-4 stroke-gray-600" /></IconButton>
            </div>
        </subtitle-edit>
    );
});

export { SubtitleItemEdit, type SubtitleItemEditRef };