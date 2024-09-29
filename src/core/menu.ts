
namespace ShortcutKeys {
    export const Control = Symbol("Control");
    export const Shift = Symbol("Shift");
    export const Alt = Symbol("Alt");
    export const Meta = Symbol("Meta");
    export const Enter = Symbol("Enter");
}

export type ModifierKey = typeof ShortcutKeys.Control | typeof ShortcutKeys.Shift | typeof ShortcutKeys.Alt | typeof ShortcutKeys.Meta | typeof ShortcutKeys.Enter;

// TODO: add menu keyboard navigation

type MenuItemButton = {
    type: "button";
    label: string;
    shortcutKeys?: (ModifierKey | string)[];
    darwinShortcutKeys?: (ModifierKey | string)[];
    onClick: () => void;
    disabled?: boolean;
}

type MenuItemSeparator = {
    type: "separator";
}

type MenuItemSubmenu = {
    type: "submenu";
    label: string;
    menu: MenuItem[];
    disabled?: boolean;
}

type MenuItem = MenuItemButton | MenuItemSeparator | MenuItemSubmenu;

type Menu = {
    label: string;
    items: MenuItem[];
    disabled?: boolean;
}

export { ShortcutKeys, type MenuItem, type MenuItemButton, type MenuItemSeparator, type MenuItemSubmenu, type Menu };
