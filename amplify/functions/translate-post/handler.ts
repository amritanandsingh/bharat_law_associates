import type { Schema } from '../../data/resource';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  TranslateClient,
  TranslateTextCommand,
} from '@aws-sdk/client-translate';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const translate = new TranslateClient({});
const TABLE = process.env.POST_TABLE_NAME as string;

// Site language code -> Amazon Translate code. Only languages Amazon Translate
// actually supports are listed; the other 12 site languages fall back at read
// time (see src/lib/postText.js and src/i18n/languages.js).
const TRANSLATE_CODE: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  bn: 'bn',
  gu: 'gu',
  kn: 'kn',
  ml: 'ml',
  mr: 'mr',
  pa: 'pa',
  ta: 'ta',
  te: 'te',
  ur: 'ur',
};
const SUPPORTED = Object.keys(TRANSLATE_CODE);

// Amazon Translate's real-time TranslateText caps at 10,000 bytes. Bodies are
// plain text with paragraphs separated by blank lines, so translate paragraph
// by paragraph and rejoin to stay well under the limit.
async function translateText(
  text: string,
  source: string,
  target: string,
): Promise<string> {
  if (!text) return '';
  const out = await translate.send(
    new TranslateTextCommand({
      SourceLanguageCode: source,
      TargetLanguageCode: target,
      Text: text,
    }),
  );
  return out.TranslatedText ?? '';
}

async function translateLong(
  text: string,
  source: string,
  target: string,
): Promise<string> {
  if (!text) return '';
  const paragraphs = text.split(/\n{2,}/);
  const translated: string[] = [];
  for (const p of paragraphs) {
    translated.push(await translateText(p, source, target));
  }
  return translated.join('\n\n');
}

/**
 * Admin-only: translate a post's source-language content into every supported
 * language and write the result back to the `translations` map.
 */
export const handler: Schema['translatePost']['functionHandler'] = async (
  event,
) => {
  const { postId } = event.arguments;

  const got = await ddb.send(
    new GetCommand({ TableName: TABLE, Key: { id: postId } }),
  );
  const post = got.Item;
  if (!post) throw new Error(`Post ${postId} not found`);

  const src: string = post.sourceLang;
  // `translations` may come back from DynamoDB as a native map or a JSON string
  // depending on how AppSync stored the AWSJSON field — normalize either way.
  const rawTranslations = post.translations;
  const translations: Record<string, any> =
    typeof rawTranslations === 'string'
      ? JSON.parse(rawTranslations || '{}') || {}
      : { ...(rawTranslations ?? {}) };
  const source = translations[src];
  if (!source?.title) throw new Error('Post is missing source-language content');

  const srcCode = TRANSLATE_CODE[src] ?? 'en';
  const done: string[] = [src];

  for (const target of SUPPORTED) {
    if (target === src) continue;
    const tgtCode = TRANSLATE_CODE[target];
    translations[target] = {
      title: await translateText(source.title ?? '', srcCode, tgtCode),
      excerpt: await translateText(source.excerpt ?? '', srcCode, tgtCode),
      body: await translateLong(source.body ?? '', srcCode, tgtCode),
    };
    done.push(target);
  }

  await ddb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { id: postId },
      UpdateExpression: 'SET translations = :t, translatedLangs = :l',
      ExpressionAttributeValues: { ':t': translations, ':l': done },
    }),
  );

  return { translatedLangs: done };
};
