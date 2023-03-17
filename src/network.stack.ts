import { Stack } from "aws-cdk-lib";
import { GatewayVpcEndpointAwsService, Vpc } from "aws-cdk-lib/aws-ec2";

export class NetworkStack extends Stack {
  vpc = new Vpc(this, "VPC", {
    natGateways: 0,
    maxAzs: 3,
    gatewayEndpoints: {
      S3: {
        service: GatewayVpcEndpointAwsService.S3,
      },
      DDB: {
        service: GatewayVpcEndpointAwsService.DYNAMODB,
      },
    },
  });
}
