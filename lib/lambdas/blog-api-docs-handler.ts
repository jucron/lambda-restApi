import { APIGatewayEvent } from "aws-lambda";
import {APIGatewayClient, GetExportCommand} from "@aws-sdk/client-api-gateway";

export const blogApiDocsHandler = async (event: APIGatewayEvent) => {
    const apigateway = new APIGatewayClient();
    const restApiId = process.env.API_ID!;
    const getExportCommand = new GetExportCommand({
        restApiId: restApiId,
        exportType: "swagger",
        accepts: "application/json",
        stageName: "prod"
    })

    const api = await apigateway.send(getExportCommand);
    const response = Buffer.from(api.body!).toString("utf-8");

    return {
        statusCode: 200,
        body: response
    };
}
