const { awscdk } = require("projen");

const project = new awscdk.AwsCdkTypeScriptApp({
  name: "dynamodb-s3-export",
  description:
    "Export data from DynamoDB table to S3 bucket everyday at 2:00 AM UTC time",

  defaultReleaseBranch: "main",
  cdkVersion: "2.69.0",
  deps: [
    "@aws-prototyping-sdk/pdk-nag",
    "@aws-prototyping-sdk/pipeline",
    "cdk-nag",
  ],

  prettier: true,
  gitignore: [".idea"],
});

project.synth();
