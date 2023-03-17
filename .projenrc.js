const { awscdk } = require("projen");

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
    "@middy/core",
    "csv-stringify",
    "@aws-prototyping-sdk/pdk-nag",
    "cdk-nag",
    "cdk-pipelines-github",
  ],

  prettier: true,
  gitignore: [".idea"],

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_18_X,
    bundlingOptions: {
      sourcemap: true,
      externals: ["@aws-sdk/*", "@aws-lambda-powertools/*"],
    },
  },
});

project.synth();
