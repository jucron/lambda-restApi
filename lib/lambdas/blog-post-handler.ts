import { APIGatewayEvent } from "aws-lambda";
import { v4 as uuid } from "uuid";
import {BlogPost} from "./BlogPost";
import {BlogPostService} from "./BlogPostService";

//env variable provided from lambda function (rest-api stack)
const TABLE_NAME = process.env.TABLE_NAME!;
const blogPostService = new BlogPostService(TABLE_NAME);

export const  createBlogPostHandler = async (event: APIGatewayEvent) => {
    const partialBlogPost = JSON.parse(event.body!) as {
        title: string;
        author: string;
        content: string;
    };
    const id = uuid();
    const createdAt = new Date().toISOString();
    const blogPost : BlogPost = {
        id,
        title: partialBlogPost.title,
        author: partialBlogPost.author,
        content: partialBlogPost.content,
        createdAt
    }

    await blogPostService.saveBlogPost(blogPost);

    return {
        statusCode: 201,
        body: JSON.stringify(blogPost)
    };
}
