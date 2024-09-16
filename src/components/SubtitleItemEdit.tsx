import { forwardRef, useRef, useImperativeHandle } from "react";
import { SubtitleItem } from "../core/subtitle";
import { translate } from "../core/translate";
import TimecodeInput from "./TimecodeInput";

const SubtitleItemEdit = forwardRef(({ item, onItemChange, onMerge, onRemove, onRequestFocus, onSplit, index }: {
    index: number,
    item: SubtitleItem,
    onItemChange: (item: SubtitleItem) => void,
    onMerge: (indexStart: number, indexEnd: number) => void,
    onRemove: (index: number) => void,
    onRequestFocus: (index: 1 | -1) => void,
    onSplit: (index: number, position: number) => void,
}, ref: React.Ref<any>) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const timecodeInputStartRef = useRef<HTMLInputElement>(null);
    const timecodeInputEndRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focusTextarea: (offset: number) => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(offset, offset);
        },
        focusTimecodeInputStart: () => {
            timecodeInputStartRef.current?.focus();
            timecodeInputStartRef.current?.select();
        },
        focusTimecodeInputEnd: () => {
            timecodeInputEndRef.current?.focus();
            timecodeInputEndRef.current?.select();
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
                }
            }
        }
    }

    return <>
        <div className="p-4 border rounded my-2 shadow">
            <div className="flex items-center">
                <h3 className="mr-4">{index}</h3>
                <TimecodeInput value={item.start} onNewValue={(value) => {
                    onItemChange({ ...item, start: value })
                }} ref={timecodeInputStartRef} />
                <TimecodeInput value={item.end} onNewValue={(value) => {
                    onItemChange({ ...item, end: value })
                }} ref={timecodeInputEndRef} />
            </div>
            <div className="mt-2">
                <textarea className="w-full p-2 border rounded" rows={1} value={item.text} onChange={(e) => {
                    onItemChange({ ...item, text: e.target.value })
                }} onKeyDown={handleKeyDown} ref={textareaRef} />
                <div className="flex space-x-2 mt-2">
                    <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => onMerge(index - 1, index)}>Merge with previous</button>
                    <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => onMerge(index, index + 1)}>Merge with below</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onRemove(index)}>Remove</button>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => onRequestFocus(-1)}>Focus</button>
                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => {
                        translate(item.text, 'japanese', 'chinese').then((translatedText) => {
                            onItemChange({ ...item, text: translatedText ?? '' });
                        });
                    }}>Translate</button>
                </div>
            </div>
        </div>
    </>
});

export default SubtitleItemEdit;