import { defineBackend } from '@aws-amplify/backend';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { incrementViewCount } from './functions/increment-view-count/resource';
import { translatePost } from './functions/translate-post/resource';
import { logEnquiry } from './functions/log-enquiry/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  incrementViewCount,
  translatePost,
  logEnquiry,
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

// --- log-enquiry: append customer form submissions to a single Excel in S3 ---
const logFn = backend.logEnquiry.resources.lambda as LambdaFunction;
logFn.addEnvironment('BUCKET_NAME', backend.storage.resources.bucket.bucketName);
logFn.addToRolePolicy(
  new iam.PolicyStatement({
    sid: 'EnquiryLogS3',
    actions: ['s3:GetObject', 's3:PutObject'],
    // Scoped to the private enquiries prefix only (customer PII).
    resources: [backend.storage.resources.bucket.arnForObjects('enquiries/*')],
  }),
);

// --- Production hardening (only when Amplify Hosting deploys the prod branch) ---
// AWS_BRANCH is set by `ampx pipeline-deploy`; it is undefined for `ampx sandbox`,
// so sandbox/dev resources stay freely deletable while production is protected.
const branch = process.env.AWS_BRANCH;
const isProduction = branch === 'master' || branch === 'main';

if (isProduction) {
  // DynamoDB tables: block deletion + continuous backups (35-day restore).
  const { amplifyDynamoDbTables } = backend.data.resources.cfnResources;
  for (const tableName of ['Post', 'Document', 'Court']) {
    const tableCfn = amplifyDynamoDbTables[tableName];
    tableCfn.deletionProtectionEnabled = true;
    tableCfn.pointInTimeRecoveryEnabled = true;
  }

  // S3 media bucket: keep it (and old object versions) even if the stack is deleted.
  backend.storage.resources.bucket.applyRemovalPolicy(RemovalPolicy.RETAIN);
  backend.storage.resources.cfnResources.cfnBucket.versioningConfiguration = {
    status: 'Enabled',
  };
}
