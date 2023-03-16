import { PassThrough } from "stream";
import {
  AttributeValue,
  DynamoDBClient,
  paginateScan,
} from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { transform } from "stream-transform";

const ddbClient = new DynamoDBClient({});
const s3Client = new S3Client({});

export const handler = async () => {
  const ddbItemsPaginator = paginateScan(
    {
      client: ddbClient,
    },
    {
      TableName: process.env.DATA_TABLE_NAME,
    }
  );

  const csvTransform = transform((record: Record<string, AttributeValue>) => {
    return Object.keys(record)
      .map((field) => JSON.stringify(record[field]))
      .join(",");
  });

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.DESTINATION_BUCKET_NAME,
      Key: new Date().toISOString().split("T")[0] + ".csv",
      Body: csvTransform.pipe(new PassThrough()),
    },
    leavePartsOnError: false,
  });

  for await (const page of ddbItemsPaginator) {
    page.Items?.forEach((item) => csvTransform.write(item));
  }

  return upload.done();
};
