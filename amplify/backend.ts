import { defineBackend } from '@aws-amplify/backend';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { incrementViewCount } from './functions/increment-view-count/resource';
import { translatePost } from './functions/translate-post/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  incrementViewCount,
  translatePost,
});

const postTable = backend.data.resources.tables['Post'];

// --- increment-view-count: atomic ADD on the Post table only ---
// resources.lambda is typed as IFunction (no addEnvironment); it is a concrete
// Function at runtime, so cast to reach addEnvironment.
const incFn = backend.incrementViewCount.resources.lambda as LambdaFunction;
incFn.addEnvironment('POST_TABLE_NAME', postTable.tableName);
incFn.addToRolePolicy(
  new iam.PolicyStatement({
    sid: 'AtomicViewCountUpdate',
    actions: ['dynamodb:UpdateItem'],
    resources: [postTable.tableArn],
  }),
);

// --- translate-post: read source content, call Amazon Translate, write back ---
const trFn = backend.translatePost.resources.lambda as LambdaFunction;
trFn.addEnvironment('POST_TABLE_NAME', postTable.tableName);
trFn.addToRolePolicy(
  new iam.PolicyStatement({
    sid: 'ReadWritePost',
    actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
    resources: [postTable.tableArn],
  }),
);
trFn.addToRolePolicy(
  new iam.PolicyStatement({
    sid: 'AmazonTranslate',
    // Amazon Translate has no resource-level ARNs.
    actions: ['translate:TranslateText'],
    resources: ['*'],
  }),
);

// --- Production hardening (only when Amplify Hosting deploys the prod branch) ---
// AWS_BRANCH is set by `ampx pipeline-deploy`; it is undefined for `ampx sandbox`,
// so sandbox/dev resources stay freely deletable while production is protected.
const branch = process.env.AWS_BRANCH;
const isProduction = branch === 'master' || branch === 'main';

if (isProduction) {
  // DynamoDB Post table: block deletion + continuous backups (35-day restore).
  const postTableCfn = backend.data.resources.cfnResources.amplifyDynamoDbTables['Post'];
  postTableCfn.deletionProtectionEnabled = true;
  postTableCfn.pointInTimeRecoveryEnabled = true;

  // S3 media bucket: keep it (and old object versions) even if the stack is deleted.
  backend.storage.resources.bucket.applyRemovalPolicy(RemovalPolicy.RETAIN);
  backend.storage.resources.cfnResources.cfnBucket.versioningConfiguration = {
    status: 'Enabled',
  };
}
