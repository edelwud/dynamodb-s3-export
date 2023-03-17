const { awscdk } = require("projen");
const { NodePackageManager } = require("projen/lib/javascript");

const project = new awscdk.AwsCdkTypeScriptApp({
  name: "dynamodb-s3-export",
  description:
    "Export data from DynamoDB table to S3 bucket everyday at 2:00 AM UTC time",

  defaultReleaseBranch: "main",
  cdkVersion: "2.69.0",
  deps: [
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/client-s3",
    "@aws-sdk/lib-storage",
    "@aws-lambda-powertools/commons",
    "@aws-lambda-powertools/logger",
    "@aws-lambda-powertools/tracer",
    "@aws-lambda-powertools/metrics",
    "@aws-prototyping-sdk/aws-arch",
    "@aws-prototyping-sdk/cdk-graph",
    "@aws-prototyping-sdk/cdk-graph-plugin-diagram",
    "@aws-prototyping-sdk/pdk-nag",
    "@middy/core",
    "csv-stringify",
    "cdk-nag",
    "cdk-pipelines-github",
    "fs-extra",
  ],
  devDeps: ["@types/aws-lambda"],

  packageManager: NodePackageManager.NPM,

  prettier: true,
  gitignore: [".idea"],

  workflowBootstrapSteps: [
    {
      name: "Setup Node.js",
      uses: "actions/setup-node@v3",
      with: {
        "node-version": "18",
        cache: "npm",
      },
    },
  ],

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_18_X,
    bundlingOptions: {
      sourcemap: true,
      externals: ["@aws-sdk/*", "@aws-lambda-powertools/*"],
    },
  },
});

project.synth();
