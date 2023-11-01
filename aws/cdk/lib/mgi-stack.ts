import { SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { AwsIntegration, Cors, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
  StorageType,
} from 'aws-cdk-lib/aws-rds';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 bucket for hosting the static website
    const websiteBucket = new Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
    });

    new BucketDeployment(this, 'WebsiteDeployment', {
      sources: [Source.asset('./static')],
      destinationBucket: websiteBucket,
      destinationKeyPrefix: 'static', // Optional: specify a key prefix for the files in the bucket
    });

    // CloudFront distribution for the website
    const cdn = new Distribution(this, 'CDN', {
      defaultBehavior: {
        origin: new S3Origin(websiteBucket),
      },
    });

    const vpc = new Vpc(this, 'VPC');

    // PostgreSQL RDS instance for /admin path
    const dbInstance = new DatabaseInstance(this, 'DBInstance', {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_15,
      }),
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      allocatedStorage: 20,
      storageType: StorageType.GP2,
      credentials: {
        username: '<DB_USERNAME>',
        password: SecretValue.unsafePlainText('<DB_PASSWORD>'),
      },
      vpc, // Use the default VPC
    });

    // API Gateway for /admin path
    const api = new RestApi(this, 'AdminApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    // AWS Lambda function for /admin path
    const adminLambda = new Function(this, 'AdminLambda', {
      runtime: Runtime.PROVIDED_AL2, // Or the appropriate runtime for your Rust code
      code: Code.fromAsset(
        'resources/target/x86_64-unknown-linux-musl/release/lambda'
      ),
      handler: 'main.handler', // Assuming your Rust handler function is named "handler" in a file named "index"
      environment: {
        PG_HOST: dbInstance.dbInstanceEndpointAddress,
        PG_PORT: dbInstance.dbInstanceEndpointPort.toString(),
        PG_DATABASE: 'mydb', // Replace with your actual database name
        PG_USERNAME: '<DB_USERNAME>',
        PG_PASSWORD: '<DB_PASSWORD>',
      },
    });

    const adminResource = api.root.addResource('admin');
    const integration = new AwsIntegration({
      service: 'lambda',
      path: '2015-03-31/functions/' + adminLambda.functionArn + '/invocations',
    });

    adminResource.addMethod('ANY', integration);
  }
}
