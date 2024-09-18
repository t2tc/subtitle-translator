import { createStyledElement } from "../utils/reactStyle";

const PrimaryButton = createStyledElement("button", `text-black font-semibold text-sm border-solid border-1px border-neutral-300 rounded-md px-4 py-1 shadow-sm
    hover:border-solid hover:border-1px hover:border-neutral-400 hover:bg-neutral-100 transition-all duration-100
    active:bg-neutral-200`);

function IconButton({name, children, onClick, disabled = false}: {name: string, children: React.ReactNode, onClick: () => void, disabled?: boolean}) {
    return (
        <button className="p-1 rounded-md hover:bg-neutral-200 active:bg-neutral-300 transition-all duration-100" onClick={onClick} disabled={disabled} name={name}>
            {children}
        </button>
    )
}

export {
    PrimaryButton,
    IconButton,
}
