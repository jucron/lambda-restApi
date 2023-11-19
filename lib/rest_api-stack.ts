import {aws_apigateway, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Factory} from "./factory";

export class RestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //dynamodb Table setting up
    const table = Factory.buildTable(this,"blogPostTable");
    //Setting up methods to resource https://.../blogposts
    const api = new aws_apigateway.RestApi(this,"blogPostApi");
    const blogPostPath = api.root.addResource("blogposts");

    //POST lambda function setup
    let lambdaName = "createBlobPostHandler";
    let entryHandler = "lib/lambdas/blog-post-handler.ts";
    const createBlogPostLambda = Factory.buildNodeJsFunction(this, lambdaName,entryHandler,table.tableName);
    table.grantWriteData(createBlogPostLambda); //add table permissions
    blogPostPath.addMethod("POST", Factory.buildIntegration(createBlogPostLambda)); //add method

    //GET lambda function setup
    lambdaName = "getBlobPostHandler";
    entryHandler = "lib/lambdas/blog-get-handler.ts";
    const getBlogPostLambda = Factory.buildNodeJsFunction(this, lambdaName,entryHandler,table.tableName);
    table.grantReadData(getBlogPostLambda); //add table permissions
    const lambdaOptions = {requestParameters: {"method.request.querystring.order": false,},};
    blogPostPath.addMethod("GET",Factory.buildIntegration(getBlogPostLambda),lambdaOptions); //add method
  };
}
