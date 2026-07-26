import type { Schema } from '../../data/resource';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.POST_TABLE_NAME as string;

/**
 * Atomically increment a post's view count.
 *
 * Security: the field (`viewCount`) is hard-coded here and the Lambda's IAM
 * role is scoped to `dynamodb:UpdateItem` on the Post table only. The single
 * argument is `postId`, so a guest caller cannot influence any other field.
 * `ADD` is a single atomic DynamoDB op, so concurrent readers never lose counts.
 */
export const handler: Schema['incrementViewCount']['functionHandler'] = async (
  event,
) => {
  const { postId } = event.arguments;

  const res = await ddb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { id: postId },
      UpdateExpression: 'ADD viewCount :one',
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeValues: { ':one': 1 },
      ReturnValues: 'UPDATED_NEW',
    }),
  );

  return (res.Attributes?.viewCount as number) ?? 0;
};
