import { defineFunction } from '@aws-amplify/backend';

export const translatePost = defineFunction({
  name: 'translate-post',
  entry: './handler.ts',
  // Room for ~10 target languages × (title + excerpt + body) sequentially.
  timeoutSeconds: 120,
  memoryMB: 512,
  // Data resolver that also reads/writes the Post table — assign to the data
  // stack to avoid the data<->function circular dependency.
  resourceGroupName: 'data',
});
