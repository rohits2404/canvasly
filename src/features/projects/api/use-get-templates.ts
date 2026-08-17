import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

export type ResponseType = InferResponseType<
    typeof client.api.projects.templates.$get,
    200
>;
type RequestType = InferRequestType<
    typeof client.api.projects.templates.$get
>["query"];

export const useGetTemplates = (apiQuery: RequestType) => {
    const query = useQuery({
        queryKey: [
            "templates",
            {
                page: apiQuery.page,
                limit: apiQuery.limit,
            },
        ],
        queryFn: async () => {
            const response = await client.api.projects.templates.$get({
                query: apiQuery,
            });

            console.log("TEMPLATE RESPONSE:", response);

            if (!response.ok) {
                throw new Error("Failed To Fetch Templates");
            }

            const result = await response.json();

            console.log("TEMPLATE JSON:", result);
            console.log("TEMPLATE DATA:", result.data);

            return result.data;
        },
    });

    return query;
};
