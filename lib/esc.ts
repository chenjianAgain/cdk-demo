import cdk = require('@aws-cdk/core');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import { Vpc, InstanceType } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, TaskDefinition, Compatibility, FargateTaskDefinition } from '@aws-cdk/aws-ecs';


export class Ecs extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = Vpc.fromLookup(this, 'defaultstack/defaultvpc', {
      isDefault: false
    })

    // Cluster (has both ec2 and fargate)
    const cluster = new Cluster(this,  'Cluster', {
      vpc
    })

    cluster.addCapacity('AsgSpot1', {
      maxCapacity: 10,
      minCapacity: 1,
      desiredCapacity: 1,
      instanceType: new InstanceType('t3.large'),
      spotPrice: '0.33',
      spotInstanceDraining: true
    });

    cluster.addCapacity('AsgSpot2', {
      maxCapacity: 1,
      minCapacity: 1,
      desiredCapacity: 1,
      instanceType: new InstanceType('t2.2xlarge'),
      spotPrice: '0.83',
      spotInstanceDraining: true
    });

    cluster.addCapacity('AsgOd', {
      maxCapacity: 3,
      minCapacity: 1,
      desiredCapacity: 1,
      instanceType: new InstanceType('t2.large'),
    })

    // ec2 TaskDefinition
    const ec2taskDefinition = new TaskDefinition(this, 'ec2Task', {
      compatibility: Compatibility.EC2,
      memoryMiB: '512',
      cpu: '256'
    })

    ec2taskDefinition
      .addContainer('flask', {
        image: ContainerImage.fromRegistry('pahud/amazon-ecs-flask-sample'),
        memoryLimitMiB: 512,
        environment: {
          PLATFORM: 'Amazon ECS---Move Move Move'
        },
      })
      .addPortMappings({
        containerPort: 5000
      });

    // ec2 Service
    const svc = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'ec2Service', {
      cluster,
      taskDefinition: ec2taskDefinition,
      desiredCount: 6
    })

    // 1. fargate cluster
    // const fargateCluster = new Cluster(this,  'fargateCluster', {
    //   vpc
    // })

    // 2. fargate taskDefinition
    const taskDefinition = new FargateTaskDefinition(this, 'Task', {
      memoryLimitMiB: 512,
      cpu: 256
    })

    const web = taskDefinition.addContainer('web', {
      image: ContainerImage.fromRegistry('nginx'),
    })

    web.addPortMappings({
      containerPort: 80
    })

    // 3. FargateService
    new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'fargateService', {
      cluster,
      taskDefinition,
      desiredCount: 1
    })
  }
}
