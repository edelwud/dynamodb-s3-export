import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { LayerVersion, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { ExportFunction } from "./services/export-function";

export interface DynamoDBS3ExportStackProps extends StackProps {
  vpc?: Vpc;
}

export class DynamoDBS3ExportStack extends Stack {
  lambdaCommonProps: Partial<NodejsFunctionProps> = {
    vpc: this.props?.vpc,
    tracing: Tracing.ACTIVE,
    timeout: Duration.seconds(30),
    environment: {
      NODE_OPTIONS: "--enable-source-maps",
      LOG_LEVEL: "DEBUG",
      POWERTOOLS_METRICS_NAMESPACE: "DDBToS3Export",
    },
    layers: [
      LayerVersion.fromLayerVersionArn(
        this,
        "powertools-layer",
        `arn:aws:lambda:${
          Stack.of(this).region
        }:094274105915:layer:AWSLambdaPowertoolsTypeScript:9`
      ),
    ],
  };

  dataTable = new Table(this, "DataTable", {
    partitionKey: {
      name: "name",
      type: AttributeType.STRING,
    },
    pointInTimeRecovery: true,
  });

  destinationBucket = new Bucket(this, "Destination", {
    enforceSSL: true,
  });

  exportLambda = new ExportFunction(
    this,
    "ExportFunction",
    this.lambdaCommonProps
  );

  constructor(
    scope: Construct,
    id: string,
    private props?: DynamoDBS3ExportStackProps
  ) {
    super(scope, id, props);

    new Rule(this, "ExportInitiator", {
      schedule: Schedule.cron({
        minute: "0",
        hour: "2",
      }),
      targets: [new LambdaFunction(this.exportLambda)],
    });

    this.dataTable.grantReadData(this.exportLambda);
    this.destinationBucket.grantPut(this.exportLambda, "*.csv");

    this.exportLambda.addEnvironment(
      "DATA_TABLE_NAME",
      this.dataTable.tableName
    );
    this.exportLambda.addEnvironment(
      "DESTINATION_BUCKET_NAME",
      this.destinationBucket.bucketName
    );
    this.exportLambda.addEnvironment(
      "POWERTOOLS_SERVICE_NAME",
      "ExportProcess"
    );
  }
}
