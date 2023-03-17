import { Stack, StackProps } from "aws-cdk-lib";
import { ShellStep } from "aws-cdk-lib/pipelines";
import { NagSuppressions } from "cdk-nag";
import {
  AwsCredentials,
  GitHubActionRole,
  GitHubWorkflow,
} from "cdk-pipelines-github";
import { Construct } from "constructs";

export class GithubActionsStack extends Stack {
  role = new GitHubActionRole(this, "GithubActionsRole", {
    repos: ["edelwud/dynamodb-s3-export"],
  });

  pipeline = new GitHubWorkflow(this, "Pipeline", {
    preBuildSteps: [
      {
        name: "Setup Node.js",
        uses: "actions/setup-node@v3",
        with: {
          "node-version": 18,
          cache: "yarn",
        },
      },
    ],
    synth: new ShellStep("Build", {
      commands: ["yarn", "npx projen build"],
    }),
    awsCreds: AwsCredentials.fromOpenIdConnect({
      gitHubActionRoleArn: `arn:aws:iam::${this.account}:role/GitHubActionRole`,
      roleSessionName: "github-actions-runner",
    }),
  });

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.pipeline.node.addDependency(this.role);

    NagSuppressions.addStackSuppressions(this, [
      {
        id: "AwsSolutions-IAM5",
        reason: "Allow creating all resources for deploy role",
        appliesTo: ["Resource::*"],
      },
    ]);
  }
}
