import { APIGatewayEvent } from "aws-lambda";
import {BlogPostService} from "./BlogPostService";

//env variable provided from lambda function (rest-api stack)
const TABLE_NAME = process.env.TABLE_NAME!;
const blogPostService = new BlogPostService(TABLE_NAME);

export const getBlobPostHandler = async (event: APIGatewayEvent) => {
    const order = event?.queryStringParameters?.order;
    let blogPosts = await blogPostService.getAllBlogPost();
    if (order?.toLowerCase() === "asc") {
        //order ascending
        blogPosts = blogPosts.sort((blogPostA,blogPostB) =>
            blogPostA.createdAt.localeCompare(blogPostB.createdAt)
        );
    }  else {
        //order descending
        blogPosts = blogPosts.sort((blogPostA,blogPostB) =>
            blogPostB.createdAt.localeCompare(blogPostA.createdAt)
        );
    }
    return {
        statusCode: 200,
        body: JSON.stringify(blogPosts)
    };
}
