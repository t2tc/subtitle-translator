import { createStyledElement } from "../utils/reactStyle";

const entryClassName = `text-sm border-solid border-1px border-neutral-300 rounded-md shadow-sm`;

const PrimaryButton = createStyledElement("button", `${entryClassName} text-black font-medium px-4 py-1
    hover:border-solid hover:border-1px hover:border-neutral-400 hover:bg-neutral-100 transition-all duration-100
    active:bg-neutral-200`);

function IconButton({name, children, onClick, disabled = false, className}: {name: string, children: React.ReactNode, onClick: () => void, disabled?: boolean, className?: string}) {
    return (
        <button className={`${className} p-1 rounded-full hover:bg-neutral-200 hover:border-solid border-1px hover:border-neutral-300 border-transparent active:bg-neutral-300 transition-all duration-100 flex items-center justify-center`} onClick={onClick} disabled={disabled} name={name} aria-label={name}>
            {children}
        </button>
    )
}

function LanguageSelector({ value, selections, onChange }: { value: string, selections: Record<string, string>, onChange: (value: string) => void }) {
    
    return <select className={`${entryClassName} font-medium px-2 py-1 focus:ring-1 focus:ring-neutral-500 focus:outline-none`} value={value} onChange={(e) => {
        onChange(e.target.value);
    }}>
        {Object.entries(selections).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
    </select>
}

export {
    PrimaryButton,
    IconButton,
    LanguageSelector,
}
