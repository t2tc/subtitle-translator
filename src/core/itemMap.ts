
function createItemId() {
    return Math.random().toString(36).substring(2, 15);
}

const itemMap = new Map<string, WeakRef<HTMLElement>>();
const itemFinalizer = new FinalizationRegistry((id: string) => {
    itemMap.delete(id);
});

function addItem(item: HTMLElement) {
    const id = createItemId();
    itemMap.set(id, new WeakRef(item));
    itemFinalizer.register(item, id);
    return id;
}

function removeItem(id: string) {
    itemMap.delete(id);
}

function getItem(id: string) {
    return itemMap.get(id)?.deref();
}

function queryIdByItem(item: HTMLElement) {
    for (const [id, ref] of itemMap.entries()) {
        if (ref.deref() === item) {
            return id;
        }
    }
    return null;
}

function _DEBUG_printItemMap() {
    console.log(itemMap);
}

const ItemMap = {
    addItem,
    removeItem,
    getItem,
    queryIdByItem,
};

export { ItemMap, _DEBUG_printItemMap };