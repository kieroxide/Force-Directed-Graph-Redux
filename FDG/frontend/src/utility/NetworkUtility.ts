
export class NetworkUtility {
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
}
