import OpenAI from "openai";

const llmProvider = new OpenAI({
    baseURL: 'https://xiaoai.plus/v1',
    apiKey: 'sk-rJqtLCadgR2BTthcC7Ed8d61B7A54eA58732E30241157424',
    dangerouslyAllowBrowser: true
});

const dictionary = {};

const model = 'gpt-4o-mini';

function getPrompt(text: string, from: string, to: string) {
    return `
You are a helpful assistant that translates text. You will be given a sentence in ${from} and you need to translate it to ${to}.
Ensure that the translation is accurate, clear, and contextually appropriate. Pay special attention to the proper nouns listed below and use their fixed translations. Maintain the original tone and style of the text.
Proper nouns and their fixed translations:
<proper-nouns>
 ${Object.entries(dictionary).map(([key, value]) => `${key} -> ${value}`).join('\n')}
</proper-nouns>
<text>
${text}
</text>
`;
}

export async function translate(text: string, from: string, to: string): Promise<string | null> {
    try {
        const response = await llmProvider.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: getPrompt(text, from, to) }],
        });
        return response.choices[0]?.message.content ?? null;
    } catch (error) {
        console.error(error);
        return null;
    }
}