
// TODO: Implement multi-selectable

import { ItemMap } from "./itemMap";

const multiSelectableAttribute = 'data-multi-selectable';
const mouseSelectionAreaElement = 'mouse-selection-area';

type MultiSelectableProperties = {
    rect: DOMRect;
    callback: () => void;
}

const multiSelectableMap = new Map<string, MultiSelectableProperties>();

function isRectIntersecting(rect1: DOMRect, rect2: DOMRect) {
    return !(rect2.left > rect1.right || 
             rect2.right < rect1.left || 
             rect2.top > rect1.bottom ||
             rect2.bottom < rect1.top);
}

const MultiSelectManager = (() => {
    return {
        addElement: (element: HTMLElement, callback: () => void) => {
            const id = ItemMap.addItem(element);
            element.setAttribute(multiSelectableAttribute, id);
            multiSelectableMap.set(id, { rect: element.getBoundingClientRect(), callback });

            return () => {
                ItemMap.removeItem(id);
                element.removeAttribute(multiSelectableAttribute);
                multiSelectableMap.delete(id);
            }
        },
        removeElement: (element: HTMLElement) => {
            const id = element.getAttribute(multiSelectableAttribute);
            element.removeAttribute(multiSelectableAttribute);
            multiSelectableMap.delete(id!);
        },
        checkIntersection: (rect: DOMRect) => {
            let ids: string[] = [];
            multiSelectableMap.forEach((properties, id) => {
                if (isRectIntersecting(properties.rect, rect)) {
                    ids.push(id);
                }
            });
            return ids;
        }
    }
})();

function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'multi-select-debug-canvas');
    canvas.setAttribute('style', 'position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; pointer-events: none;');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    document.body.appendChild(canvas);
    return canvas;
}

update();

function update() {
    multiSelectableMap.forEach(function updateElementRect(properties, id) {
        // const element = document.querySelector(`[data-multi-selectable="${id}"]`);
        const element = ItemMap.getItem(id);
        const rect = element!.getBoundingClientRect();
        multiSelectableMap.set(id, { rect: new DOMRect(rect.x + window.scrollX, rect.y + window.scrollY, rect.width, rect.height), callback: properties.callback });
    });

    requestAnimationFrame(update);
/*        ctx.clearRect(0, 0, canvas.width, canvas.height);
        multiSelectableMap.forEach(function drawElementRect(properties, _) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.strokeRect(properties.rect.left, properties.rect.top, properties.rect.width, properties.rect.height);
        });*/
}

export { MultiSelectManager };
