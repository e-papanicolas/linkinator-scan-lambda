import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
// import * as events from 'aws-cdk-lib/aws-events';
// import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';

export class LinkinatorScanStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const linkinatorFn = new NodejsFunction(this, 'LambdaHandler', {
      entry: path.join(__dirname, `/../lambda/index.ts`),
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.seconds(300),
    });

    linkinatorFn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'ses:SendEmail',
          'ses:SendRawEmail',
          'ses:SendTemplatedEmail',
        ],
        resources: ['*'],
      }),
    );
    
    // const cronJobRule = new events.Rule(this, 'Rule', {
    //   schedule: events.Schedule.expression('cron(0 0 1 * *'),
    // });

    // cronJobRule.addTarget(new targets.LambdaFunction(lambdaFn));
    
  }
}
