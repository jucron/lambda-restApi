import {APIGatewayEvent} from "aws-lambda";
import {APIGatewayClient, GetExportCommand} from "@aws-sdk/client-api-gateway";
import {htmlTemplate} from "./swagger";

export const apiDocsHandler = async (event: APIGatewayEvent) => {
    const ui = event?.queryStringParameters?.ui;
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

    if (!ui) {
        return {
            statusCode: 200,
            body: response
        };
    }
    return {
        statusCode: 200,
        body: htmlTemplate,
        headers: {
            "Content-Type": "text/html"
        }
    }
}
