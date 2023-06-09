import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DynamoDBS3ExportStack } from "../src/dynamodb-s3-export.stack";

test("Snapshot", () => {
  const app = new App();
  const stack = new DynamoDBS3ExportStack(app, "test");

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
