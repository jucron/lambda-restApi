import {aws_apigateway, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Builder} from "./builder";

export class RestApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //dynamodb Table setting up
    const table = Builder.buildTable(this,"blogPostTable");

    //lambda functions setting up
    //POST lambda
    let lambdaName = "createBlobPostHandler";
    let entryHandler = "lib/lambdas/blog-post-handler.ts";
    const createBlogPostLambda = Builder.buildNodeJsFunction(this, lambdaName,entryHandler,table.tableName);
    table.grantWriteData(createBlogPostLambda);

    //GET lambda
    lambdaName = "getBlobPostHandler";
    entryHandler = "lib/lambdas/blog-get-handler.ts";
    const getBlogPostLambda = Builder.buildNodeJsFunction(this, lambdaName,entryHandler,table.tableName);
    table.grantReadData(getBlogPostLambda);

    //Setting up methods to resource https://.../blogposts
    const api = new aws_apigateway.RestApi(this,"blogPostApi");
    const blogPostPath = api.root.addResource("blogposts");
    blogPostPath.addMethod("POST", Builder.buildIntegration(createBlogPostLambda));
    blogPostPath.addMethod("GET", Builder.buildIntegration(getBlogPostLambda));
  };
}
