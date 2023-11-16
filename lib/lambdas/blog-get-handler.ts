import { APIGatewayEvent } from "aws-lambda";
import {BlogPostService} from "./BlogPostService";

//env variable provided from lambda function (rest-api stack)
const TABLE_NAME = process.env.TABLE_NAME!;
const blogPostService = new BlogPostService(TABLE_NAME);

export const getBlobPostHandler = async (event: APIGatewayEvent) => {
    const blogPosts = await blogPostService.getAllBlogPost();
    return {
        statusCode: 200,
        body: JSON.stringify(blogPosts)
    };
}
