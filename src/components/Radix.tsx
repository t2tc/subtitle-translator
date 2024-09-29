import { Tabs as RadixTabs, TabsList as RadixTabsList, TabsTrigger as RadixTabsTrigger, TabsContent as RadixTabsContent } from "@radix-ui/react-tabs"
import { Root as RadixMenuBarRoot, Trigger as RadixMenuBarTrigger, Content as RadixMenuBarContent, Portal as RadixMenuBarPortal, Menu as RadixMenu, 
    Item as RadixMenuItem, Separator as RadixMenuSeparator, Sub as RadixMenuSub, SubTrigger as RadixMenuSubTrigger, SubContent as RadixMenuSubContent } from "@radix-ui/react-menubar";
import { createStyledComponent } from "../utils/reactStyle";

const border1px = "border-solid border-gray-300 dark:border-gray-800 border-1px";

const roundedFirstLast = `first:rounded-l-md last:rounded-r-md`;

const TabsListClassName = `rounded-md bg-neutral-200 shadow-inner p-0.5 `;
const TabsTriggerClassName = `px-4 py-1 text-sm font-medium text-neutral-500 data-[state=active]:bg-white
data-[state=active]:border-solid data-[state=active]:border-1px data-[state=active]:border-gray-300 data-[state=active]:text-black border-transparent border-1px transition-all duration-100
 data-[state=active]:shadow-sm hover:border-solid hover:border-1px hover:border-gray-400 ${roundedFirstLast}`;
const TabsContentClassName = `m-1 `;

const TabsList = createStyledComponent(RadixTabsList, TabsListClassName);
const TabsTrigger = createStyledComponent(RadixTabsTrigger, TabsTriggerClassName);
const TabsContent = createStyledComponent(RadixTabsContent, TabsContentClassName);

const MenuBarRootClassName = `bg-neutral-200 p-0.5 shadow-md select-none `;
const MenuBarTriggerClassName = `cursor-default px-2 py-1 text-xs  text-neutral-800 border-transparent border-1px transition-all duration-100 hover:border-solid hover:border-1px hover:border-gray-400 hover:bg-neutral-100 outline-none focus-visible:outline-none data-[state=open]:bg-neutral-100 active:bg-neutral-100`;
const MenuBarContentClassName = `bg-neutral-200 min-w-55 shadow-md border-solid border-1px border-gray-300 `;
const MenuBarMenuClassName = ``;
const MenuBarItemClassName = `px-4 py-1 text-xs text-neutral-800 border-transparent border-1px transition-all duration-100 hover:border-solid hover:border-1px hover:border-gray-400 hover:bg-neutral-100 outline-none focus-visible:outline-none`;
const MenuBarPortalClassName = ``;
const MenuBarSeparatorClassName = `h-[1px] w-full bg-neutral-300`;
const MenuBarSubClassName = ``;
const MenuBarSubTriggerClassName = `menu-subtrigger flex items-center justify-between px-4 py-1 text-xs text-neutral-800 border-transparent border-1px transition-all duration-100 hover:border-solid hover:border-1px hover:border-gray-400 hover:bg-neutral-100 outline-none focus-visible:outline-none`;
const MenuBarSubContentClassName = ` bg-neutral-200 w-48 shadow-md border-solid border-1px border-gray-300`;

const MenuBarRoot = createStyledComponent(RadixMenuBarRoot, MenuBarRootClassName);
const MenuBarTrigger = createStyledComponent(RadixMenuBarTrigger, MenuBarTriggerClassName);
const MenuBarContent = createStyledComponent(RadixMenuBarContent, MenuBarContentClassName);
const MenuBarMenu = createStyledComponent(RadixMenu, MenuBarMenuClassName);
const MenuBarItem = createStyledComponent(RadixMenuItem, MenuBarItemClassName);
const MenuBarPortal = createStyledComponent(RadixMenuBarPortal, MenuBarPortalClassName);
const MenuBarSeparator = createStyledComponent(RadixMenuSeparator, MenuBarSeparatorClassName);
const MenuBarSub = createStyledComponent(RadixMenuSub, MenuBarSubClassName);
const MenuBarSubTrigger = createStyledComponent(RadixMenuSubTrigger, MenuBarSubTriggerClassName);
const MenuBarSubContent = createStyledComponent(RadixMenuSubContent, MenuBarSubContentClassName);

export {
    RadixTabs as Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    MenuBarRoot,
    MenuBarTrigger,
    MenuBarContent,
    MenuBarMenu,
    MenuBarItem,
    MenuBarPortal,
    MenuBarSeparator,
    MenuBarSub,
    MenuBarSubTrigger,
    MenuBarSubContent,
}