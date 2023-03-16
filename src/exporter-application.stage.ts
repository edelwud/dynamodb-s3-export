import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DynamoDBS3ExportStack } from "./dynamodb-s3-export.stack";

export class ExporterApplicationStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new DynamoDBS3ExportStack(this, "dynamodb-s3-export");
  }
}
