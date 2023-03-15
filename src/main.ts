import { PDKNag } from "@aws-prototyping-sdk/pdk-nag";
import { ExporterApplicationStage } from "./exporter-application.stage";
import { GithubActionsStack } from "./github-actions.stack";

const app = PDKNag.app();

const githubStack = new GithubActionsStack(app, "GithubActions", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const exporterAppProd = new ExporterApplicationStage(app, "prod", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const exporterAppDev = new ExporterApplicationStage(app, "dev", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

githubStack.pipeline.addStage(exporterAppProd);
githubStack.pipeline.addStage(exporterAppDev);

app.synth();
