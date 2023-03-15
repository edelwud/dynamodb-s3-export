import { PDKPipeline } from "@aws-prototyping-sdk/pipeline";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class PipelineStack extends Stack {
  readonly pipeline: PDKPipeline;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.pipeline = new PDKPipeline(this, "ApplicationPipeline", {
      primarySynthDirectory: "cdk.out",
      repositoryName:
        this.node.tryGetContext("repositoryName") || "ddb-s3-export",
      defaultBranchName: "main",
      publishAssetsInParallel: false,
      crossAccountKeys: true,
      synth: {},
      sonarCodeScannerConfig: this.node.tryGetContext("sonarqubeScannerConfig"),
    });
  }
}
