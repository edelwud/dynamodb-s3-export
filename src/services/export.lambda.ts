import { injectLambdaContext } from "@aws-lambda-powertools/logger";
import { logMetrics } from "@aws-lambda-powertools/metrics";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer";
import { DynamoDBClient, paginateScan } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import middy from "@middy/core";
import { stringify } from "csv-stringify";
import { logger, metrics, tracer } from "../common/powertools";

const s3Client = new S3Client({});
const ddbItemsPaginator = paginateScan(
  {
    client: new DynamoDBClient({}),
  },
  {
    TableName: process.env.DATA_TABLE_NAME,
  }
);

export const exportDDBTableToS3 = async () => {
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

  try {
    for await (const page of ddbItemsPaginator) {
      page.Items?.forEach((item) =>
        stringifier.write(
          Object.keys(item).map((field) => JSON.stringify(item[field]))
        )
      );
    }
    stringifier.end();
    await upload.done();
  } catch (err) {
    tracer.addErrorAsMetadata(err as Error);
    logger.error("Error reading from table. " + err);
  }
};

export const handler = middy(exportDDBTableToS3)
  .use(logMetrics(metrics))
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(captureLambdaHandler(tracer, { captureResponse: false }));
