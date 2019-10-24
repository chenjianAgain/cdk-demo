import cdk = require('@aws-cdk/core');
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, FargateTaskDefinition } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import cloudfront = require('@aws-cdk/aws-cloudfront');

export class Cf extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
            // CloudFront distribution that provides HTTPS
            const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
              
              originConfigs: [
                  {
                      customOriginSource: {
                        domainName: 'www.google.com'
                      },
                      behaviors: [{
                        isDefaultBehavior: true,
                        allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
                      }]
                  }
              ]
          });
          new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
  }
}
