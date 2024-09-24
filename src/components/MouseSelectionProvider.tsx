import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

function MouseSelectionProvider({ onSelectionChange, onSelectionDetermined, onShallNotSelect }: { 
    onSelectionChange: (selection: any) => void, 
    onSelectionDetermined: () => void,
    onShallNotSelect: () => boolean
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [endPos, setEndPos] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (onShallNotSelect() === true) {
                return;
            }
            setIsDragging(true);
            setStartPos({ x: e.clientX, y: e.clientY });
            setEndPos({ x: e.clientX, y: e.clientY });
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setEndPos({ x: e.clientX, y: e.clientY });
                onSelectionChange(e.target);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
            }
            onSelectionDetermined();
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
        opacity: isDragging ? 1 : 0
    };

    return <>{createPortal(
        <div 
            className="fixed pointer-events-none bg-blue-500/20 border border-blue-500/50 transition-opacity duration-100" 
            ref={ref}
            style={style}
        >
        </div>,
        document.body
    )}</>
}

export default MouseSelectionProvider;
