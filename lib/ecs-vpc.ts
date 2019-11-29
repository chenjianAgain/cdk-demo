import cdk = require('@aws-cdk/core');
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, FargateTaskDefinition } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';


export class EcsVpc extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // const vpc = Vpc.fromLookup(this, 'defaultstack/defaultvpc', {
    //   isDefault: false
    // })
    
    const vpc = new Vpc(this, "HistoryVPC");

    const cluster = new Cluster(this,  'ecsCluster', {
      vpc
    })

    // Create a load-balanced Fargate service and make it public
    // Instantiate Fargate Service with just cluster and image
    const fargateService = new ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskImageOptions: {
        // image: ContainerImage.fromRegistry("pahud/amazon-ecs-flask-sample"),
        // image: ContainerImage
        containerPort: 5000,
        image: ContainerImage.fromAsset('./flask-docker-app')
      },
      desiredCount: 4
    });

    // Output the DNS where you can access your service
    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });

  }
}