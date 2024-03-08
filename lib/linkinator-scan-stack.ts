import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
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
        ],
        resources: ['*'],
      }),
    );

    // Timezone UTC
    const scheduleLambda = new events.Rule(this, "monthlyOnTheFirstDayRule", {
      schedule: events.Schedule.cron({day: '1', hour: '0', minute: '0'}),
    });

    scheduleLambda.addTarget(
      new targets.LambdaFunction(linkinatorFn, {
        event: events.RuleTargetInput.fromObject({}),
      })
    );

    targets.addLambdaPermission(scheduleLambda, linkinatorFn);

    // test version of the function
    // const scheduleLambdaTest = new events.Rule(this, "every5MinutesRule", {
    //   schedule: events.Schedule.cron({minute: '5'}),
    // });

    // scheduleLambdaTest.addTarget(
    //   new targets.LambdaFunction(linkinatorFn, {
    //     event: events.RuleTargetInput.fromObject({}),
    //   })
    // );

    // targets.addLambdaPermission(scheduleLambdaTest, linkinatorFn);
    
  }
}
