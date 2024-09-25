import { useRef, useSyncExternalStore, useState, memo, useEffect } from 'react';
import { parseSubRipFormat, serializeSubRipFormat } from './core/srt';
import { Timecode } from './core/timecode';
import { SubtitleStore } from './core/subtitleStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Radix';
import { SubtitleItemEdit, SubtitleItemEditRef } from './components/SubtitleItemEdit';
import { IconButton, LanguageSelector, PrimaryButton } from './components/Elements';
import { Languages } from './core/translate';
import { PlusIcon } from 'lucide-react';
import { ReactiveUIStates } from './core/uiStates';
import MouseSelectionProvider from './components/MouseSelectionProvider';


function DictionaryEditorItem({ itemKey, itemValue, onChange, onRemove }: { itemKey: string, itemValue: string, onChange: (key: string, value: string) => void, onRemove: () => void }) {
    return (
        <div className="flex items-center space-x-2">
            <input
                className="border p-2 rounded"
                type="text"
                value={itemKey}
                onChange={(e) => onChange(e.target.value, itemValue)}
            />
            <input
                className="border p-2 rounded"
                type="text"
                value={itemValue}
                onChange={(e) => onChange(itemKey, e.target.value)}
            />
            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={onRemove}>Remove</button>
        </div>
    );
}

function DictionaryEditor({ value, onChange }: { value: { from: string; to: string }[], onChange: (value: { from: string; to: string }[]) => void }) {
    return (
        <div className="p-4 border rounded shadow">
            {value.map((item, index) => (
                <DictionaryEditorItem
                    key={index}
                    itemKey={item.from}
                    itemValue={item.to}
                    onChange={(itemKey, itemValue) => {
                        const newValue = [...value];
                        newValue[index] = { from: itemKey, to: itemValue };
                        onChange(newValue);
                    }}
                    onRemove={() => {
                        const newValue = value.filter((_, i) => i !== index);
                        onChange(newValue);
                    }}
                />
            ))}
            <button
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => {
                    onChange([...value, { from: "", to: "" }]);
                }}
            >
                Add
            </button>
        </div>
    );
}

const BasicInfo = memo(() => {
    const subtitleStore = SubtitleStore;
    const [from, setFrom] = useState('japanese');
    const [to, setTo] = useState('chinese');

    async function triggerSubtitleFileInput() {
      try {
          const [fileHandle] = await (window as any).showOpenFilePicker({
              types: [
                  {
                      description: 'Subtitle files',
                      accept: {
                          'text/plain': ['.srt']
                      }
                  }
              ],
              multiple: false
          });
          const file = await fileHandle.getFile();
          const text = await file.text();
          const subtitle = parseSubRipFormat(text);
          subtitleStore.setContent(subtitle);
      } catch (error) {
          console.error('Error selecting file:', error);
      }
  }

  async function saveSubtitleFile() {
      const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: 'subtitle.srt',
          types: [
              {
                  description: 'Subtitle files',
                  accept: {
                      'text/plain': ['.srt']
                  }
              }
          ]
      });
      const file = await fileHandle.createWritable();
      await file.write(serializeSubRipFormat(subtitleStore.getSnapshot()));
      await file.close();
  }

    return (
        <>
            <PrimaryButton onClick={triggerSubtitleFileInput}>Open Subtitle</PrimaryButton>
            <PrimaryButton onClick={saveSubtitleFile}>Save Subtitle</PrimaryButton>
            <PrimaryButton onClick={() => {
                subtitleStore.push({
                    start: new Timecode('00:00:00,000'),
                    end: new Timecode('00:00:00,000'),
                    text: ''
                });
            }}>Add Subtitle</PrimaryButton>
            <div className="flex items-center space-x-2">
                <span>From: </span>
                <LanguageSelector value={from} selections={Languages} onChange={setFrom} />
                <span>To: </span>
                <LanguageSelector value={to} selections={Languages} onChange={setTo} />
            </div>
        </>
    )
})


const TranslateTab = memo(() => {
    const subtitleStore = SubtitleStore;
    const subtitleItems = useSyncExternalStore(subtitleStore.subscribe, subtitleStore.getSnapshot);
    const selectedIndex = useSyncExternalStore(ReactiveUIStates.subtitle.currentSelected.subscribe, ReactiveUIStates.subtitle.currentSelected.get);

    const refs = useRef<Map<number, SubtitleItemEditRef>>(new Map());

    function getMap() {
        if (!refs.current) {
            refs.current = new Map();
        }
        return refs.current;
    }

    function focusOnItem(index: number) {
        if (index < 0 || index >= subtitleItems.length) {
            return;
        }
        refs.current.get(index)?.focusTextarea(0);
    }

    function focusOnTimecodeInputStart(index: number) {
        if (index < 0 || index >= subtitleItems.length) {
            return;
        }
        refs.current.get(index)?.focusTimecodeInput();
    }

    return (
        <>
            {subtitleItems && subtitleItems.map((item, index) => <SubtitleItemEdit key={index} item={item} onItemChange={(item) => {
                subtitleStore.update(item, index);
            }} onRequestMerge={(indexStart, indexEnd) => {
                subtitleStore.merge(indexStart, indexEnd);
                focusOnItem(indexStart);
            }} onRequestRemove={(index) => {
                subtitleStore.remove(index);
            }} index={index} onRequestFocusOtherItems={(offset) => {
                focusOnItem(index + offset);
            }} ref={(node) => {
                const map = getMap();
                if (node) {
                    map.set(index, node);
                } else {
                    map.delete(index);
                }
            }} onRequestSplit={(index, position) => {
                subtitleStore.split(index, position);
                focusOnTimecodeInputStart(index);
            }} selected={selectedIndex?.includes(index) ?? false} 
            onRequestSelect={(multi) => {
                if (multi) {
                    const currentSelected = ReactiveUIStates.subtitle.currentSelected.get() ?? [];
                    ReactiveUIStates.subtitle.currentSelected.set([...currentSelected, index]);
                } else {
                    ReactiveUIStates.subtitle.currentSelected.set([index]);
                }
            }} />)}
            <div className="flex items-center justify-center pt-1">
                <IconButton className="w-full" name="Add Subtitle" onClick={() => {
                    subtitleStore.push({
                    start: new Timecode('00:00:00,000'),
                    end: new Timecode('00:00:00,000'),
                    text: ''
                });
            }}><PlusIcon className="w-4 h-4 stroke-neutral-600 hover:stroke-neutral-800" /></IconButton>
            </div>
        </>
    );
});

function SyncTab() {
    return <div>Sync</div>
}

function SettingsTab() {
    return <div>Settings</div>
}

function App() {
    const [dictionary, setDictionary] = useState<{ from: string, to: string }[]>([]);
    
    return (
      <>
        <BasicInfo />
        <Tabs defaultValue="translate">
            <TabsList>
                <TabsTrigger value="sync">Sync</TabsTrigger>
                <TabsTrigger value="translate">Translate</TabsTrigger>
                <TabsTrigger value="dictionary">Dictionary</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="sync">
                <SyncTab />
            </TabsContent>

            <TabsContent value="translate">
                <TranslateTab />
            </TabsContent>

            <TabsContent value="dictionary">
                <DictionaryEditor value={dictionary} onChange={setDictionary} />
            </TabsContent>

            <TabsContent value="settings">
                <SettingsTab />
            </TabsContent>
        </Tabs>

        <MouseSelectionProvider onSelectionChange={(ids) => {
            const indexes = ids.map(id => document.querySelector(`[data-multi-selectable="${id}"]`) as HTMLElement).map(element => parseInt(element.dataset.index ?? '-1')).filter(index => index !== -1);
            ReactiveUIStates.subtitle.currentSelected.set(indexes);
        }} onSelectionDetermined={() => {}} onShallNotSelect={() => {
            return false;
        }} />

        </>
    )
}

export default App