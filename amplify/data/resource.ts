import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { incrementViewCount } from '../functions/increment-view-count/resource';
import { translatePost } from '../functions/translate-post/resource';

/**
 * Data model for the Articles feed.
 *
 * A `Post` stores language-independent metadata plus a `translations` JSON map
 * keyed by language code: { [lng]: { title, excerpt, body } }. The admin writes
 * only the source-language entry; the `translatePost` mutation fills the rest
 * via Amazon Translate.
 *
 * Authorization:
 *   - Admins (Cognito group)        → full CRUD.
 *   - Guests / signed-in users      → read only.
 *   - `incrementViewCount`          → callable by guests, but it is a narrow
 *                                     custom mutation whose Lambda can ONLY
 *                                     touch `viewCount`. Guests have no write
 *                                     grant on `Post` itself.
 *   - `translatePost`               → Admins only.
 */
const schema = a.schema({
  Post: a
    .model({
      slug: a.string().required(),
      sourceLang: a.string().required(),
      coverImageKey: a.string(),
      publishedAt: a.datetime().required(),
      viewCount: a.integer().default(0),
      // { [lng]: { title, excerpt, body } }
      translations: a.json().required(),
      // language codes that currently have a translation (source + machine)
      translatedLangs: a.string().array(),
    })
    .authorization((allow) => [
      allow.group('Admins').to(['create', 'read', 'update', 'delete']),
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
    ]),

  // Secure, guest-callable view-count increment. The handler hard-codes the
  // update to `viewCount` — the only argument is `postId` — so a guest cannot
  // mutate any other field.
  incrementViewCount: a
    .mutation()
    .arguments({ postId: a.id().required() })
    .returns(a.integer())
    .authorization((allow) => [allow.guest(), allow.authenticated()])
    .handler(a.handler.function(incrementViewCount)),

  // Admin-only: translate a post's source content into every supported language.
  translatePost: a
    .mutation()
    .arguments({ postId: a.id().required() })
    .returns(a.json())
    .authorization((allow) => [allow.group('Admins')])
    .handler(a.handler.function(translatePost)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // Public site defaults to guest (identity pool) access; the admin client
    // opts in to `userPool` per call.
    defaultAuthorizationMode: 'identityPool',
  },
});
