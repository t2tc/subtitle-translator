import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { MultiSelectManager } from "../core/multiSelectable";

function MouseSelectionProvider(
    { onSelectionChange, onSelectionDetermined, onShallNotSelect, root = document.body }: {
    onSelectionChange: (ids: string[]) => void,
    onSelectionDetermined: () => void,
    onShallNotSelect: () => boolean,
    root?: HTMLElement
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [endPos, setEndPos] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const startInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (onShallNotSelect() === true) {
                return;
            }
            if (e.target instanceof HTMLElement && e.target.closest('[data-multi-select-prohibited]') !== null) {
                return;
            }
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                startInputRef.current = e.target;
            } else {
                setIsVisible(true);
            }
            setIsDragging(true);
            setStartPos({ x: e.clientX + root.scrollLeft - root.getBoundingClientRect().left, y: e.clientY + root.scrollTop - root.getBoundingClientRect().top });
            setEndPos({ x: e.clientX + root.scrollLeft - root.getBoundingClientRect().left, y: e.clientY + root.scrollTop - root.getBoundingClientRect().top });
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && e.buttons !== 0) {
                if (startInputRef.current && !startInputRef.current.isSameNode(e.target as Node)) {
                    // If the user is dragging the cursor to another element, then we should blur the input element and treat this as a multi-select.
                    startInputRef.current.blur();
                    setIsVisible(true);
                }

                if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                    setIsVisible(true);
                }

                setEndPos({ x: e.clientX + root.scrollLeft - root.getBoundingClientRect().left, y: e.clientY + root.scrollTop - root.getBoundingClientRect().top });
                const ids = MultiSelectManager.checkIntersection(new DOMRectReadOnly(startPos.x, startPos.y, endPos.x - startPos.x, endPos.y - startPos.y));
                onSelectionChange(ids);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setIsVisible(false);
            }
            onSelectionDetermined();
            startInputRef.current = null;
            setStartPos({ x: 0, y: 0 });
            setEndPos({ x: 0, y: 0 });
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', () => setIsDragging(false));
        window.addEventListener('blur', () => setIsDragging(false));

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', () => setIsDragging(false));
            window.removeEventListener('blur', () => setIsDragging(false));
        };
    }, [isDragging, startPos, endPos]);

    const style = {
        left: Math.min(startPos.x, endPos.x),
        top: Math.min(startPos.y, endPos.y),
        width: Math.abs(endPos.x - startPos.x),
        height: Math.abs(endPos.y - startPos.y),
        opacity: isVisible ? 1 : 0
    };

    return <>{createPortal(
        <mouse-selection-area
            class="absolute pointer-events-none bg-blue-500/20 border border-blue-500/50 transition-opacity duration-100 select-none"
            ref={ref}
            style={style}
        />,
        root
    )}</>
}

export default MouseSelectionProvider;
