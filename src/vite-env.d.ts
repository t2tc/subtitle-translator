/// <reference types="vite/client" />

type StringWithDash = `${string}-${string}`;

declare namespace JSX {
    interface IntrinsicElements {
        [key: StringWithDash]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            class?: string;
        };
    }
}
