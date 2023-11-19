import { APIGatewayEvent } from "aws-lambda";
import {BlogPostService} from "./BlogPostService";

//env variable provided from lambda function (rest-api stack)
const TABLE_NAME = process.env.TABLE_NAME!;
const blogPostService = new BlogPostService(TABLE_NAME);

export const getBlogPostHandler = async (event: APIGatewayEvent) => {
    const id = event.pathParameters!.id!;
    let blogPost = await blogPostService.getBlogPostById(id);
    const returnBody = blogPost! ? blogPost: {"message": "not found!"};
    return {
        statusCode: 200,
        body: JSON.stringify(returnBody)
    };
}
