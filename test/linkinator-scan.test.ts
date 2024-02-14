import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as LinkinatorScan from '../lib/linkinator-scan-stack';

test('Lambda Created', () => {
  const app = new cdk.App();
  const stack = new LinkinatorScan.LinkinatorScanStack(app, 'MyTestStack');

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    VisibilityTimeout: 300
  });
});
