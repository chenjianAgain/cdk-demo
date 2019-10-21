import cdk = require('@aws-cdk/core');
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, FargateTaskDefinition } from '@aws-cdk/aws-ecs';
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');


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

    const taskDefinition = new FargateTaskDefinition(this, 'Task', {
      memoryLimitMiB: 512,
      cpu: 256
    })

    taskDefinition
      .addContainer('web', {
        image: ContainerImage.fromRegistry('nginx'),
      }).addPortMappings({
        containerPort: 80
      })

    const svc = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Svc', {
      cluster,
      taskDefinition
    })
  }
}
