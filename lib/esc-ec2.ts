import cdk = require('@aws-cdk/core');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import { Vpc, InstanceType } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, TaskDefinition, Compatibility } from '@aws-cdk/aws-ecs';


export class EcsEc2 extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = Vpc.fromLookup(this, 'defaultstack/defaultvpc', {
      isDefault: false
    })

    // Cluster
    const cluster = new Cluster(this,  'ec2Cluster', {
      vpc
    })

    cluster.addCapacity('AsgSpot1', {
      maxCapacity: 1,
      minCapacity: 1,
      desiredCapacity: 1,
      instanceType: new InstanceType('t3.large'),
      spotPrice: '0.03',
      spotInstanceDraining: true
    });

    cluster.addCapacity('AsgSpot2', {
      maxCapacity: 1,
      minCapacity: 1,
      desiredCapacity: 1,
      instanceType: new InstanceType('t2.xlarge'),
      spotPrice: '0.13',
      spotInstanceDraining: true
    });

    cluster.addCapacity('AsgOd', {
      maxCapacity: 2,
      minCapacity: 1,
      desiredCapacity: 1,
      instanceType: new InstanceType('t2.large'),
    })

    // TaskDefinition
    const taskDefinition = new TaskDefinition(this, 'Task', {
      compatibility: Compatibility.EC2,
      memoryMiB: '512',
      cpu: '256'
    })

    taskDefinition
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

    // Service
    const svc = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'Svc', {
      cluster,
      taskDefinition,
      desiredCount: 5
    })
  }
}
