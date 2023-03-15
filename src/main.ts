import { PDKNag } from "@aws-prototyping-sdk/pdk-nag";
import { ExporterApplicationStage } from "./exporter-application.stage";
import { PipelineStack } from "./pipeline.stack";

const app = PDKNag.app();

const pipelineStack = new PipelineStack(app, "PipelineStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const prodDynamoDBS3Export = new ExporterApplicationStage(app, "prod", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

pipelineStack.pipeline.addStage(prodDynamoDBS3Export);
pipelineStack.pipeline.buildPipeline();

app.synth();
