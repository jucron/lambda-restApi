import {aws_apigateway, aws_iam, aws_lambda_nodejs, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Factory} from "./factory";
import {APIGatewayClient, GetExportCommand } from "@aws-sdk/client-api-gateway"

export class RestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //dynamodb Table setting up
    const table = Factory.buildTable(this,"blogPostTable");
    //Setting up methods to resource https://.../blogposts
    const api = new aws_apigateway.RestApi(this,"blogPostApi");
    const blogPostPath = api.root.addResource("blogposts"); //add endpoint

    //POST lambda function setup
    let lambdaName = "createBlogPostHandler";
    let entryHandler = "lib/lambdas/blog-post-handler.ts";
    const createBlogPostLambda = Factory.buildNodeJsFunction(this, lambdaName,entryHandler,table.tableName);
    table.grantWriteData(createBlogPostLambda); //add table permissions
    blogPostPath.addMethod("POST", Factory.buildIntegration(createBlogPostLambda)); //add method

    //GET_ALL lambda function setup
    lambdaName = "getAllBlogPostHandler";
    entryHandler = "lib/lambdas/blog-get-all-handler.ts";
    const getAllBlogPostLambda = Factory.buildNodeJsFunction(this, lambdaName,entryHandler,table.tableName);
    table.grantReadData(getAllBlogPostLambda); //add table permissions
    const getAllOptions = {requestParameters: {"method.request.querystring.order": false,},};
    blogPostPath.addMethod("GET",Factory.buildIntegration(getAllBlogPostLambda),getAllOptions); //add method

    //GET lambda function setup
    lambdaName = "getBlogPostHandler";
    entryHandler = "lib/lambdas/blog-get-handler.ts";
    const getBlogPostLambda = Factory.buildNodeJsFunction(this, lambdaName,entryHandler,table.tableName);
    table.grantReadData(getBlogPostLambda); //add table permissions

    const blogPostByIdPath = blogPostPath.addResource("{id}"); //add further endpoint
    blogPostByIdPath.addMethod("GET",Factory.buildIntegration(getBlogPostLambda)); //add method

    //DELETE lambda function setup
    lambdaName = "deleteBlogPostHandler";
    entryHandler = "lib/lambdas/blog-delete-handler.ts";
    const deleteBlogPostLambda = Factory.buildNodeJsFunction(this, lambdaName,entryHandler,table.tableName);
    table.grantWriteData(deleteBlogPostLambda); //add table permissions

    blogPostByIdPath.addMethod("DELETE",Factory.buildIntegration(deleteBlogPostLambda)); //add method

    //Swagger API lambda function setup
    //todo: change to Factory build
    lambdaName = "apiDocsHandler";
    entryHandler = "lib/lambdas/blog-api-docs-handler.ts";
    const apiDocsLambda = new aws_lambda_nodejs.NodejsFunction(
        this, lambdaName,
        {
          entry: entryHandler,
          handler: lambdaName,
          functionName: lambdaName,
          environment: {API_ID: api.restApiId}
        });
    const policy = new aws_iam.PolicyStatement({
      actions:["apigateway:GET"],
      resources:["*"]
    });
    apiDocsLambda.role?.addToPrincipalPolicy(policy);

    const apiDocsPath = api.root.addResource("api-docs"); //add endpoint
    apiDocsPath.addMethod("GET",Factory.buildIntegration(apiDocsLambda));
  };
}
