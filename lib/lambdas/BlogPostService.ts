import {DynamoDBClient, PutItemCommand, ScanCommand} from '@aws-sdk/client-dynamodb';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {BlogPost} from "./BlogPost";

export class BlogPostService {
    private tableName: string;
    private dynamo: DynamoDBClient;
    constructor(tableName: string) {
        this.tableName = tableName;
        this.dynamo = new DynamoDBClient();
    }

    async saveBlogPost(blogPost:BlogPost): Promise<void> {
        const params = {
            TableName: this.tableName,
            //marshall Util is to ensure correct transformation between JS data to DynamoDB
            Item: marshall(blogPost)
        };

        const command = new PutItemCommand(params);
        await this.dynamo.send(command);
    }
    async getAllBlogPost(): Promise<BlogPost[]> {
        const params = {
            TableName: this.tableName
        };
        const command = new ScanCommand(params);
        const response = await this.dynamo.send(command);
        const Items = response.Items ?? [];
        return Items.map((item) => unmarshall(item) as BlogPost);
    }
}
