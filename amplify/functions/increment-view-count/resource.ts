import { defineFunction } from '@aws-amplify/backend';

export const incrementViewCount = defineFunction({
  name: 'increment-view-count',
  entry: './handler.ts',
  timeoutSeconds: 10,
  // This Lambda is a data resolver AND reads the Post table (IAM in backend.ts),
  // so it must live in the data stack to avoid a CloudFormation circular
  // dependency between the data and function nested stacks.
  resourceGroupName: 'data',
});
