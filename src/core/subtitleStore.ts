import { SubtitleItem } from "./subtitle";

const SubtitleStore = (() => {
    let content: SubtitleItem[] = [];
    let triggers: (() => void)[] = [];
    let dirty = false;
    let locked = true;

    function setContent(items: SubtitleItem[]) {
        content = items;
        triggers.forEach(trigger => trigger());
    }

    function getSnapshot() {
        if(dirty) {
            content = content.map((v) => v);    // make new array for react.
            dirty = false;
        }
        return content;
    }

    function defineEditBehavior<T extends (...args: any[]) => any>(cb: T) {
        return function wrappedFunction() {
            const val = cb(...arguments);
            dirty = true;
            triggers.forEach(trigger => trigger());
            return val;
        } as T;
    }

    const push = defineEditBehavior((item: SubtitleItem) => {
        content.push(item);
        return () => {
            content.pop();
        }
    });

    const insert = defineEditBehavior((item: SubtitleItem, index: number) => {
        content.splice(index, 0, item);
        return () => {
            content.splice(index, 1);
        }
    });
    
    const remove = defineEditBehavior((index: number) => {
        const item = content.splice(index, 1)[0];
        return () => {
            content.splice(index, 0, item);
        }
    });

    const update = defineEditBehavior((item: SubtitleItem, index: number) => {
        const oldItem = content[index];
        content[index] = item;
        return () => {
            content[index] = oldItem;
        }
    });

    const clear = defineEditBehavior(() => {
        const oldContent = content;
        content = [];
        return () => {
            content = oldContent;
        }
    });

    const merge = defineEditBehavior((indexStart: number, indexEnd: number) => {
        if(indexStart < 0 || indexEnd >= content.length) {
            return;
        }
        const mergedText = content.slice(indexStart, indexEnd + 1).map(item => item.text).join("");
        const merged = {    
            start: content[indexStart].start,
            end: content[indexEnd].end,
            text: mergedText
        };
        content.splice(indexStart, indexEnd - indexStart + 1, merged);
    });

    const split = defineEditBehavior((index: number, position: number) => {
        if(index < 0 || index >= content.length) {
            return;
        }
        const split = [{
            start: content[index].start,
            end: content[index].end,
            text: content[index].text.slice(0, position)
        }, {
            start: content[index].start,
            end: content[index].end,
            text: content[index].text.slice(position)
        }];
        content.splice(index, 1, ...split);
    });

    function lockTime() {
        locked = true;
    }

    function unlockTime() {
        locked = false;
    }

    function subscribe(trigger: () => void) {
        triggers.push(trigger);
        return () => {
            triggers = triggers.filter(t => t !== trigger);
        };
    }

    return {
        content,
        setContent,
        getSnapshot,
        insert,
        remove,
        update,
        clear,
        subscribe,
        push,
        merge,
        split,
        lockTime,
        unlockTime,
        get isLocked() {
            return locked;
        }
    }
})();

const SubtitleEditHistory = (() => {
    let history: Command[] = [];
    let maxHistoryLength = 100;
    let currentIndex = 0;

    function push(item: Command) {
        history.push(item);
        currentIndex = history.length - 1;
        if(history.length > maxHistoryLength) {
            history.shift();
            currentIndex--;
        }
    }

    function undo() {
        if(currentIndex > 0) {
            currentIndex--;
            const command = history[currentIndex];
            command.undo();
            return command;
        }
        return null;
    }   

    function redo() {
        if(currentIndex < history.length - 1) {
            currentIndex++;
            const command = history[currentIndex];
            command.execute();
            return command;
        }
        return null;
    }   

    return {
        push,
        undo,
        redo
    }
})();

type Command = {
    execute: () => void;
    undo: () => void;
    description: () => string;
}

export { SubtitleStore, SubtitleEditHistory };
