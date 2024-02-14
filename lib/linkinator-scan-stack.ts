import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as events from 'aws-cdk-lib/aws-events';
// import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class LinkinatorScanStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFn = new lambda.Function(this, 'Singleton', {
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(300),
    });

    // const cronJobRule = new events.Rule(this, 'Rule', {
    //   schedule: events.Schedule.expression('cron(0 0 1 * *'),
    // });

    // cronJobRule.addTarget(new targets.LambdaFunction(lambdaFn));
  }
}
