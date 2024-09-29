
import { MenuBarContent, MenuBarRoot, MenuBarTrigger, MenuBarMenu, MenuBarItem, MenuBarPortal, MenuBarSeparator, MenuBarSub, MenuBarSubTrigger, MenuBarSubContent } from "./Radix";
import { Menu, MenuItem, ShortcutKeys, type MenuItemButton } from "../core/menu";
import { isSystemDarwin } from "../utils/globalShortKeyHandler";

const MenuData: Menu[] = [{
    label: "File",
    items: [
        {
            type: "button",
            label: "&New",
            shortcutKeys: [ShortcutKeys.Control, "N"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "N"],
            onClick: () => {
                console.log("New");
            }
        }, {
            type: "button",
            label: "Open &SRT File...",
            shortcutKeys: [ShortcutKeys.Control, "O"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "O"],
            onClick: () => {
                console.log("Open SRT File...");
            }
        }, {
            type: "button",
            label: "&Import Text File...",
            shortcutKeys: [ShortcutKeys.Control, "I"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "I"],
            onClick: () => {
                console.log("Import Text File...");
            }
        }, {
            type: "button",
            label: "Open Reference &Video...",
            onClick: () => {
                console.log("Open Reference Video...");
            }
        },
        {
            type: "separator",
        }, {
            type: "button",
            label: "&Save",
            shortcutKeys: [ShortcutKeys.Control, "S"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "S"],
            onClick: () => {
                console.log("Save");
            }
        }, {
            type: "button",
            label: "Save &As...",
            shortcutKeys: [ShortcutKeys.Control, "Shift", "S"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "Shift", "S"],
            onClick: () => {
                console.log("Save As...");
            }
        }
    ],
}, {
    label: "Edit",
    items: [
        {
            type: "button",
            label: "Undo",
            shortcutKeys: [ShortcutKeys.Control, "Z"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "Z"],
            onClick: () => {
                console.log("Undo");
            }
        },
        {
            type: "button",
            label: "Redo",
            shortcutKeys: [ShortcutKeys.Control, "Y"],
            darwinShortcutKeys: [ShortcutKeys.Meta, ShortcutKeys.Shift, "Z"],
            onClick: () => {
                console.log("Redo");
            }
        },
        {
            type: "button",
            label: "Show History Record...",
            shortcutKeys: [ShortcutKeys.Control, "H"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "H"],
            onClick: () => {
                console.log("Show History");
            }
        },
        {
            type: "separator",
        },
        {
            type: "button",
            label: "Cut",
            shortcutKeys: [ShortcutKeys.Control, "X"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "X"],
            onClick: () => {
                console.log("Undo");
            }
        }, {
            type: "button",
            label: "Copy",
            shortcutKeys: [ShortcutKeys.Control, "C"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "C"],
            onClick: () => {
                console.log("Copy");
            }
        }, {
            type: "button",
            label: "Paste",
            shortcutKeys: [ShortcutKeys.Control, "V"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "V"],
            onClick: () => {
                console.log("Paste");
            }
        }, {
            type: "separator",
        }, {
            type: "button",
            label: "Select All",
            shortcutKeys: [ShortcutKeys.Control, "A"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "A"],
            onClick: () => {
                console.log("Select All");
            }
        }, {
            type: "button",
            label: "Delete",
            shortcutKeys: [ShortcutKeys.Control, "Delete"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "Delete"],
            onClick: () => {
                console.log("Delete");
            }
        }, {
            type: "separator",
        }, {
            type: "button",
            label: "Merge",
            shortcutKeys: [ShortcutKeys.Control, "M"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "M"],
            onClick: () => {
                console.log("Merge");
            }
        }, {
            type: "button",
            label: "Split at Cursor",
            onClick: () => {
                console.log("Split");
            }
        }, {
            type: "separator",
        }, {
            type: "button",
            label: "Insert New Line Before",
            shortcutKeys: [ShortcutKeys.Shift, ShortcutKeys.Enter],
            darwinShortcutKeys: [ShortcutKeys.Meta, ShortcutKeys.Shift, "Enter"],
            onClick: () => {
                console.log("Insert New Line Before");
            }
        },
        {
            type: "button",
            label: "Insert New Line After",
            shortcutKeys: [ShortcutKeys.Enter],
            darwinShortcutKeys: [ShortcutKeys.Enter],
            onClick: () => {
                console.log("Insert New Line");
            }
        },
        {
            type: "separator"
        }, {
            type: "button",
            label: "Preferences...",
            shortcutKeys: [ShortcutKeys.Control, ","],
            darwinShortcutKeys: [ShortcutKeys.Meta, ","],
            onClick: () => {
                console.log("Preferences");
            }
        }
    ],
}, {
    label: "View",
    items: [
        {
            type: "button",
            label: "Show/Hide History",
            shortcutKeys: [ShortcutKeys.Control, "H"],
            darwinShortcutKeys: [ShortcutKeys.Meta, "H"],
            onClick: () => {
                console.log("Show/Hide History");
            }
        }
    ]
}, {
    label: "Help",
    items: [
        {
            type: "button",
            label: "About",
            onClick: () => {
                console.log("About");
            }
        }, {
            type: "separator",
        }, {
            type: "submenu",
            label: "Documentation",
            menu: [
                {
                    type: "button",
                    label: "User Guide",
                    onClick: () => {
                        console.log("User Guide");
                    }
                }
            ]
        }
    ]
}];

// This function parse a Windows-style string with '&' for keyboard navigation.
function parseMenuLabel(label: string): {
    innerHtml: string,
    accelerator: string | null
} {
    let innerHtml = label;
    const match = label.match(/&(.)/);
    if (match) {
        innerHtml = label.replace(match[0], `<span style="text-decoration: underline;">${match[1]}</span>`);
    }
    return {
        innerHtml,
        accelerator: match?.[1] ?? null
    };
}

function MenuBarItemContent({ item }: { item: MenuItemButton }) {
    const ModifierKeyMap = {
        [ShortcutKeys.Control]: "Ctrl",
        [ShortcutKeys.Meta]: "⌘",
        [ShortcutKeys.Shift]: "Shift",
        [ShortcutKeys.Alt]: "Alt",
        [ShortcutKeys.Enter]: "Enter",
    }

    function getShortcutKeys(item: MenuItemButton) {
        if (isSystemDarwin()) {
            return item.darwinShortcutKeys;
        }
        return item.shortcutKeys;
    }

    const shortcutKeys = getShortcutKeys(item);
    const shortcutKeysString = shortcutKeys?.map(key => ModifierKeyMap[key as keyof typeof ModifierKeyMap] ?? key).join("+");

    return (
        <div className="flex justify-between items-center select-none">
            <span dangerouslySetInnerHTML={{ __html: parseMenuLabel(item.label).innerHtml }} />
            {shortcutKeysString && <span className="text-xs text-neutral-500">{shortcutKeysString}</span>}
        </div>
    );
}

function buildMenuItems(items: MenuItem[]) {
    return items.map((item, index) => {
        switch (item.type) {
            case "button":
                return <MenuBarItem key={index}>
                    <MenuBarItemContent item={item}/>
                </MenuBarItem>
            case "separator":
                return <MenuBarSeparator key={index} />;
            case "submenu":
                return (
                    <MenuBarSub key={index}>
                        <MenuBarSubTrigger disabled={item.disabled}>{item.label}</MenuBarSubTrigger>
                        <MenuBarPortal>
                            <MenuBarSubContent>
                                {buildMenuItems(item.menu)}
                            </MenuBarSubContent>
                        </MenuBarPortal>
                    </MenuBarSub>
                );
        }
    });
}

function buildMenu(menuData: Menu[]) {
    return menuData.map((menu, index) => (
        <MenuBarMenu key={index}>
            <MenuBarTrigger disabled={menu.disabled}>{menu.label}</MenuBarTrigger>
            <MenuBarPortal>
                <MenuBarContent>
                    {buildMenuItems(menu.items)}
                </MenuBarContent>
            </MenuBarPortal>
        </MenuBarMenu>
    ));
}

function MainMenu() {
    return (
        <MenuBarRoot>
            {buildMenu(MenuData)}
        </MenuBarRoot>
    );
}

export {
    MainMenu,
}
