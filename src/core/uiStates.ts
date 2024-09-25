
type UIStates = {
    uiLanguage: string;

    isSubtitleFileOpen: boolean;
    isSubtitleFileDirty: boolean;
    isSubtitleFileLocked: boolean;

    isVideoOpen: boolean;
    videoFile: File | null;
    videoPosition: number;
    videoDuration: number;
    videoVolume: number;
    videoMuted: boolean;

    subtitleFile: File | null;
    from: string;
    to: string;

    subtitle: {
        currentSelected: number[] | null;
    }
}

const uiStates: UIStates = {
    uiLanguage: 'en',

    isSubtitleFileOpen: false,
    isSubtitleFileDirty: false,
    isSubtitleFileLocked: true,

    isVideoOpen: false,
    videoFile: null,
    videoPosition: 0,
    videoDuration: 0,
    videoVolume: 0.5,
    videoMuted: false,

    subtitleFile: null,
    from: 'en',
    to: 'zh',

    subtitle: {
        currentSelected: null,
    }
}

function makeReactive<T extends object>(object: T) {
    type ReactiveObject<T> = {
        [K in keyof T]: T[K] extends object ? ReactiveObject<T[K]> : {
            get: () => T[K];
            set: (value: T[K]) => void;
            subscribe: (callback: () => void) => () => void;
        };
    };

    let newObject: Partial<ReactiveObject<T>> = {};

    Object.entries(object).forEach(([key, value]) => {
        let subscribers: Set<() => void> = new Set();

        if (typeof value === 'object' && value !== null) {
            newObject[key as keyof T] = makeReactive(value) as any;
        } else {
            newObject[key as keyof T] = {
                get: () => value,
                set: (newValue: T[keyof T]) => {
                    value = newValue;
                    subscribers.forEach(subscriber => subscriber());
                },
                subscribe(subscriber: () => void) {
                    subscribers.add(subscriber);
                    return () => {
                        subscribers.delete(subscriber);
                    }
                }
            } as any;
        }
    });

    return newObject as ReactiveObject<T>;
}

const ReactiveUIStates = makeReactive(uiStates);

export { ReactiveUIStates };