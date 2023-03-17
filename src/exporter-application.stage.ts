import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DynamoDBS3ExportStack } from "./dynamodb-s3-export.stack";
import { NetworkStack } from "./network.stack";

export class ExporterApplicationStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const { vpc } = new NetworkStack(this, "network");
    new DynamoDBS3ExportStack(this, "dynamodb-s3-export", { vpc });
  }
}
