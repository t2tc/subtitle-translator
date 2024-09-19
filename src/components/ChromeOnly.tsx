import { useEffect, useState } from "react";
import { PrimaryButton } from "./Elements";

function ChromeOnly() {
    const isWindows = navigator.userAgent.includes('Windows');
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const body = document.body;
        body.style.display = 'flex';
        body.style.justifyContent = 'center';
        body.style.alignItems = 'center';
        body.style.height = '100vh';

        const browserLanguage = navigator.language.split('-')[0];
        setLanguage(browserLanguage);
    }, []);

    const messages: Record<string, {
        unsupported: string;
        useLatest: string;
        downloadChrome: string;
        reopenEdge: string;
    }> = {
        en: {
            unsupported: "This software is only supported in Chrome / Chromium based browsers since it uses some features which are not yet implemented in other browsers.",
            useLatest: "Please use latest Chrome / latest Edge instead.",
            downloadChrome: "Download Chrome",
            reopenEdge: "Re-open in Edge"
        },
        es: {
            unsupported: "Este software solo es compatible con navegadores basados en Chrome / Chromium, ya que utiliza algunas funciones que aún no se han implementado en otros navegadores.",
            useLatest: "Por favor, use la última versión de Chrome / Edge.",
            downloadChrome: "Descargar Chrome",
            reopenEdge: "Reabrir en Edge"
        },
        fr: {
            unsupported: "Ce logiciel est uniquement pris en charge dans les navigateurs basés sur Chrome / Chromium car il utilise certaines fonctionnalités qui ne sont pas encore implémentées dans d'autres navigateurs.",
            useLatest: "Veuillez utiliser la dernière version de Chrome / Edge.",
            downloadChrome: "Télécharger Chrome",
            reopenEdge: "Rouvrir dans Edge"
        },
        de: {
            unsupported: "Diese Software wird nur in Chrome / Chromium-basierten Browsern unterstützt, da sie einige Funktionen verwendet, die in anderen Browsern noch nicht implementiert sind.",
            useLatest: "Bitte verwenden Sie die neueste Version von Chrome / Edge.",
            downloadChrome: "Chrome herunterladen",
            reopenEdge: "In Edge erneut öffnen"
        },
        it: {
            unsupported: "Questo software è supportato solo nei browser basati su Chrome / Chromium poiché utilizza alcune funzionalità che non sono ancora implementate in altri browser.",
            useLatest: "Si prega di utilizzare l'ultima versione di Chrome / Edge.",
            downloadChrome: "Scarica Chrome",
            reopenEdge: "Riapri in Edge"
        }, 
        zh: {
            unsupported: "此软件仅在基于 Chrome / Chromium 的浏览器中受支持，因为它使用了尚未在其他浏览器中实现的某些功能。",
            useLatest: "请使用最新的 Chrome / Edge。",
            downloadChrome: "下载 Chrome",
            reopenEdge: "在 Edge 中重新打开"
        }, 
        jp: {
            unsupported: "このソフトウェアは、まだ他のブラウザーでは実装されていない機能を使用しているため、Chrome / Chromium ベースのブラウザーでのみサポートされています。",
            useLatest: "最新の Chrome / Edge を使用してください。",
            downloadChrome: "Chrome をダウンロード",
            reopenEdge: "Edge で再開"
        },
        kr: {
            unsupported: "이 소프트웨어는 아직 다른 브라우저에서 구현되지 않은 기능을 사용하기 때문에 Chrome / Chromium 기반 브라우저에서만 지원됩니다.",
            useLatest: "최신 Chrome / Edge를 사용하세요.",
            downloadChrome: "Chrome 다운로드",
            reopenEdge: "Edge에서 다시 열기"
        }
    };

    const { unsupported, useLatest, downloadChrome, reopenEdge } = messages[language] || messages.en;

    return <div className="bg-neutral-100 p-4 rounded-md w-full max-w-sm">
        <p>{unsupported}</p>
        {isWindows && <><p>{useLatest}</p>
            <div className="flex gap-2 justify-center items-stretch flex-col pt-4">
                <PrimaryButton onClick={() => {
                    window.open('https://www.google.com/chrome/', '_blank');
                }}>{downloadChrome}</PrimaryButton>
                <PrimaryButton onClick={() => {
                    window.open(`microsoft-edge:${window.location.href}`, '_blank');
                }}>{reopenEdge}</PrimaryButton>
            </div>
        </>}
    </div>
}

export default ChromeOnly;
