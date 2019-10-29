import cdk = require('@aws-cdk/core');
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, FargateTaskDefinition } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';


export class EcsFargate extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = Vpc.fromLookup(this, 'defaultstack/defaultvpc', {
      isDefault: false
    })

    const cluster = new Cluster(this,  'ecsCluster', {
      vpc
    })

    // Create a load-balanced Fargate service and make it public
    // Instantiate Fargate Service with just cluster and image
    const fargateService = new ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskImageOptions: {
        image: ContainerImage.fromRegistry("pahud/amazon-ecs-flask-sample"),
        containerPort: 5000,
      },
      desiredCount: 4
    });

    // Output the DNS where you can access your service
    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });

  }
}
