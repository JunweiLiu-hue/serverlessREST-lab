import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.MOVIES_TABLE || "Movies";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const movieID = event.pathParameters?.movieID;

        if (!movieID) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "movieID is required" }),
            };
        }

        await docClient.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { movieID },
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Movie deleted successfully" }),
        };

    } catch (error) {
        console.error("Error deleting movie:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to delete movie", error: (error as Error).message }),
        };
    }
};
