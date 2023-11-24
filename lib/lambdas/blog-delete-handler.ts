import { APIGatewayEvent } from "aws-lambda";
import {BlogPostService} from "./BlogPostService";

//env variable provided from lambda function (rest-api stack)
const TABLE_NAME = process.env.TABLE_NAME!;
const blogPostService = new BlogPostService(TABLE_NAME);

export const deleteBlogPostHandler = async (event: APIGatewayEvent) => {
    const id = event.pathParameters!.id!;
    await blogPostService.deleteBlogPostById(id);
    return {
        statusCode: 204,
    };
}
