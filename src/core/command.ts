
type Command = {
    id: string;
    description: string;
    action: () => void;
    undoable?: boolean;
}

export { type Command };