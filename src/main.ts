import { PDKNag } from "@aws-prototyping-sdk/pdk-nag";
import { ExporterApplicationStage } from "./exporter-application.stage";
import { GithubActionsStack } from "./github-actions.stack";

const app = PDKNag.app();

const env = {
  account: "762714406455",
  region: "us-east-1",
};

const githubStack = new GithubActionsStack(app, "GithubActions", { env });

const exporterAppProd = new ExporterApplicationStage(app, "prod", { env });

const exporterAppDev = new ExporterApplicationStage(app, "dev", { env });

githubStack.pipeline.addStageWithGitHubOptions(exporterAppProd, {});
githubStack.pipeline.addStage(exporterAppDev);

app.synth();
