import { DynamoDBClient, paginateScan } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { stringify } from "csv-stringify";

const s3Client = new S3Client({});
const ddbItemsPaginator = paginateScan(
  {
    client: new DynamoDBClient({}),
  },
  {
    TableName: process.env.DATA_TABLE_NAME,
  }
);

export const handler = async () => {
  const stringifier = stringify();
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.DESTINATION_BUCKET_NAME,
      Key: new Date().toISOString().split("T")[0] + ".csv",
      Body: stringifier,
    },
    leavePartsOnError: false,
  });

  for await (const page of ddbItemsPaginator) {
    page.Items?.forEach((item) =>
      stringifier.write(
        Object.keys(item).map((field) => JSON.stringify(item[field]))
      )
    );
  }

  stringifier.end();

  return upload.done();
};
