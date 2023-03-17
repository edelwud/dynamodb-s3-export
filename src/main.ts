import { CdkGraph } from "@aws-prototyping-sdk/cdk-graph";
import { CdkGraphDiagramPlugin } from "@aws-prototyping-sdk/cdk-graph-plugin-diagram";
import { PDKNag } from "@aws-prototyping-sdk/pdk-nag";
import { ExporterApplicationStage } from "./exporter-application.stage";
import { GithubActionsStack } from "./github-actions.stack";

const env = {
  account: "762714406455",
  region: "us-east-1",
};

void (async () => {
  const app = PDKNag.app();

  const githubStack = new GithubActionsStack(app, "GithubActions", { env });

  const exporterAppProd = new ExporterApplicationStage(app, "prod", { env });
  const exporterAppDev = new ExporterApplicationStage(app, "dev", { env });

  githubStack.pipeline.addStageWithGitHubOptions(exporterAppDev, {
    gitHubEnvironment: { name: "dev" },
  });
  githubStack.pipeline.addStageWithGitHubOptions(exporterAppProd, {
    gitHubEnvironment: { name: "prod" },
  });

  const graph = new CdkGraph(app, {
    plugins: [new CdkGraphDiagramPlugin()],
  });

  app.synth();

  await graph.report();
})();
