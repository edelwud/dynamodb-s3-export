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
    "stream-transform",
    "@aws-prototyping-sdk/pdk-nag",
    "cdk-nag",
    "cdk-pipelines-github",
  ],

  prettier: true,
  gitignore: [".idea"],

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_18_X,
  },
});

project.synth();
