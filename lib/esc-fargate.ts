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
        image: ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
    });

    // Output the DNS where you can access your service
    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });

    // const taskDefinition = new FargateTaskDefinition(this, 'Task', {
    //   memoryLimitMiB: 512,
    //   cpu: 256
    // })
    // taskDefinition
    //   .addContainer('web', {
    //     image: ContainerImage.fromRegistry('nginx'),
    //   }).addPortMappings({
    //     containerPort: 80
    //   })
    
    // const taskDefinition2 = new FargateTaskDefinition(this, 'Task2', {
    //   memoryLimitMiB: 512,
    //   cpu: 256
    // })
    // taskDefinition2
    //   .addContainer('php', {
    //     image: ContainerImage.fromRegistry('abiosoft/caddy:php'),
    //   })
    //   .addPortMappings({
    //     containerPort: 2015
    //   })

    // const svc = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Svc', {
    //   cluster,
    //   taskDefinition
    // })
    // const svc2 = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Svc2', {
    //   cluster,
    //   taskDefinition: taskDefinition2,
    // })
  }
}
