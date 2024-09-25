import { Tabs as RadixTabs, TabsList as RadixTabsList, TabsTrigger as RadixTabsTrigger, TabsContent as RadixTabsContent } from "@radix-ui/react-tabs"
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

export {
    RadixTabs as Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
}