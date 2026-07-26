import { defineFunction } from '@aws-amplify/backend';

export const logEnquiry = defineFunction({
  name: 'log-enquiry',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  // Data resolver (custom mutation handler) — same stack as the other two
  // functions to avoid a data<->function circular dependency.
  resourceGroupName: 'data',
});
