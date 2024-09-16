import { useRef, useSyncExternalStore, useState, memo } from 'react';  
import { parseSubRipFormat, serializeSubRipFormat } from './core/srt';
import { Timecode } from './core/timecode';
import { SubtitleStore } from './subtitleStore';
import * as Tabs from '@radix-ui/react-tabs';
import SubtitleItemEdit from './components/SubtitleItemEdit';

function LanguageSelector({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  return <select className="border p-2 rounded" value={value} onChange={(e) => {
    onChange(e.target.value);
  }}>
    <option value="japanese">Japanese</option>
    <option value="chinese">Chinese</option>
  </select>
}

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
const TranslateTab = memo(() => {
  const subtitleStore = SubtitleStore;
  const subtitleItems = useSyncExternalStore(subtitleStore.subscribe, subtitleStore.getSnapshot);

  const [from, setFrom] = useState('japanese');
  const [to, setTo] = useState('chinese');

  const refs = useRef<Map<number, any>>(new Map());

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
    refs.current.get(index)?.focusTextarea();
  }

  function focusOnTimecodeInputStart(index: number) {
    if (index < 0 || index >= subtitleItems.length) {
      return;
    }
    refs.current.get(index)?.focusTimecodeInputStart();
  }

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
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={triggerSubtitleFileInput}>Open Subtitle</button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={saveSubtitleFile}>Save Subtitle</button>
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => {
        subtitleStore.push({
          start: new Timecode('00:00:00,000'),
          end: new Timecode('00:00:00,000'),
          text: ''
        });
      }}>Add Subtitle</button>
      <div className="flex items-center space-x-2">
        <span>From: </span>
        <LanguageSelector value={from} onChange={setFrom} />
        <span>To: </span>
        <LanguageSelector value={to} onChange={setTo} />
      </div>

      {subtitleItems && subtitleItems.map((item, index) => <SubtitleItemEdit key={index} item={item} onItemChange={(item) => {
        subtitleStore.update(item, index);
      }} onMerge={(indexStart, indexEnd) => {
        subtitleStore.merge(indexStart, indexEnd);
        focusOnItem(indexStart);
      }} onRemove={(index) => {
        subtitleStore.remove(index);
      }} index={index} onRequestFocus={(offset) => {
        focusOnItem(index + offset);
      }} ref={(node) => {
        const map = getMap();
        if (node) {
          map.set(index, node);
        } else {
          map.delete(index);
        }
      }} onSplit={(index, position) => {
        subtitleStore.split(index, position);
        focusOnTimecodeInputStart(index);
      }} />)}
    </>
  );
});

function ResyncTab() {
  return <div>Resync</div>
}

function SettingsTab() {
  return <div>Settings</div>
}

function App() {
  const [dictionary, setDictionary] = useState<{ from: string, to: string }[]>([]);

  return (
    <Tabs.Root defaultValue="translate">
      <Tabs.List>
        <Tabs.Trigger value="translate">Translate</Tabs.Trigger>
        <Tabs.Trigger value="resync">Resync</Tabs.Trigger>
        <Tabs.Trigger value="dictionary">Dictionary</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="translate">
        <TranslateTab />
      </Tabs.Content>

      <Tabs.Content value="resync">
        <ResyncTab />
      </Tabs.Content>

      <Tabs.Content value="dictionary">
        <DictionaryEditor value={dictionary} onChange={setDictionary} />
      </Tabs.Content>

      <Tabs.Content value="settings">
        <SettingsTab />
      </Tabs.Content>
    </Tabs.Root>
  )
}


export default App