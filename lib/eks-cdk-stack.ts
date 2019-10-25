import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { Role, AccountRootPrincipal} from '@aws-cdk/aws-iam';
import { ImagePullPrincipalType } from '@aws-cdk/aws-codebuild';
import { Cluster, EksOptimizedImage } from '@aws-cdk/aws-eks';
import { InstanceType, Vpc } from '@aws-cdk/aws-ec2';

export class EksCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

  // The code that defines your stack goes here
    const vpc = Vpc.fromLookup(this, 'defaultstack/defaultvpc', {
      isDefault: false
    })

    const clusterAdmin = new Role(this, 'AdminRole', {
      assumedBy: new AccountRootPrincipal()
    });

    const cluster = new Cluster(this, 'Cluster', {
      vpc,
      mastersRole: clusterAdmin,
    });

    cluster.addCapacity('Spot', {
      maxCapacity: 1,
      spotPrice: '0.04',
      instanceType: new InstanceType('t3.large'),
      bootstrapOptions: {
        kubeletExtraArgs: '--node-labels foo=bar'
      },
    })
  }
}
