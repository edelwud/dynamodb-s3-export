import { Stage, StageProps } from "aws-cdk-lib";
import { NagSuppressions } from "cdk-nag";
import { Construct } from "constructs";
import { DynamoDBS3ExportStack } from "./dynamodb-s3-export.stack";

export class ExporterApplicationStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const ddbS3ExportStack = new DynamoDBS3ExportStack(
      this,
      "dynamodb-s3-export"
    );

    NagSuppressions.addStackSuppressions(ddbS3ExportStack, [
      {
        id: "AwsSolutions-IAM4",
        reason: "Allow to use default AWSBasicExecutionRole for lambda",
        appliesTo: [
          "Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        ],
      },
      {
        id: "AwsSolutions-IAM5",
        reason: "Allow to write to the bucket via wildcard",
        appliesTo: [
          "Action::s3:DeleteObject*",
          "Action::s3:Abort*",
          "Resource::<Destination920A3C57.Arn>/*",
        ],
      },
    ]);
  }
}
