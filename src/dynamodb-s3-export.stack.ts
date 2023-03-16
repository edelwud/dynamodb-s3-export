import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { ExportFunction } from "./services/export-function";

export class DynamoDBS3ExportStack extends Stack {
  dataTable = new Table(this, "DataTable", {
    partitionKey: {
      name: "name",
      type: AttributeType.STRING,
    },
    pointInTimeRecovery: true,
  });

  destinationBucket = new Bucket(this, "Destination", {
    enforceSSL: true,
    accessControl: BucketAccessControl.LOG_DELIVERY_WRITE,
    serverAccessLogsPrefix: "access-logs",
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
  });

  exportLambda = new ExportFunction(this, "ExportFunction", {
    environment: {
      DATA_TABLE_NAME: this.dataTable.tableName,
      DESTINATION_BUCKET_NAME: this.destinationBucket.bucketName,
    },
  });

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Rule(this, "ExportInitiator", {
      schedule: Schedule.cron({
        minute: "0",
        hour: "2",
      }),
      targets: [new LambdaFunction(this.exportLambda)],
    });

    this.dataTable.grantReadData(this.exportLambda);
    this.destinationBucket.grantWrite(this.exportLambda);
  }
}
