import type { GraphManager } from "../classes/GraphManager";

export class NetworkUtility {
    static async fetchQIDByName(searchInput: string) {
        const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
            searchInput
        )}&language=en&format=json&origin=*`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.search && data.search.length > 0) {
            return data.search[0].id; // QID of the top result
        }
        return null;
    }
    /**
     * Fetches graph data from the server for a given entity
     * Returns the newly fetched entities and relations directly from the API
     */
    static async fetchGraphData(QID: string, depth = 1, relationLimit = 5): Promise<any> {
        try {
            const response = await fetch(`/api/graph/${QID}?depth=${depth}&relation_limit=${relationLimit}`);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            console.error(`Failed to fetch graph data for ${QID}:`, error);
            throw error;
        }
    }
    /**
     * A quick and dirty method to fix the error with old requests from previous instances
     * corrupting a new instances request.
     * We prevent this by doing a false fetch from the server first and then just clearing the graph
     * Awaiting seems to also await for the old instances response aswell
     */
    static async flushSever(graphManager: GraphManager) {
        await graphManager.fetchRelations("Q1", 1, 1);
        graphManager.clearGraph();
    }
}
