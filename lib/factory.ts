import {aws_apigateway, aws_dynamodb, aws_lambda_nodejs, Stack} from "aws-cdk-lib";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {AttributeType} from "aws-cdk-lib/aws-dynamodb";
import {RestApi} from "aws-cdk-lib/aws-apigateway";

export class Factory {

public static buildNodeJsFunction (stack: Stack, name: string, entryHandler: string, tableName: string): NodejsFunction {
    return new aws_lambda_nodejs.NodejsFunction(
        stack,
        name,
        {
            entry: entryHandler,
            handler: name,
            functionName: name,
            environment: {TABLE_NAME: tableName}
        });
    }
    static buildIntegration(createBlogPostLambda: NodejsFunction) {
        return new aws_apigateway.LambdaIntegration(createBlogPostLambda);
    }
    static buildTable(stack: Stack, tableName: string) {
        return new aws_dynamodb.Table(stack, tableName, {
            tableName: "blogPostTable",
            partitionKey: {
                name: "id",
                type: AttributeType.STRING
            }
        });
    }
}
