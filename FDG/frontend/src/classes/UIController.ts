import { GraphManager } from "./GraphManager";
import { MathUtility } from "../utility/MathUtility";

export class UIController {
    private readonly _graphManager: GraphManager;

    private _elements: {
        fetchButton?: HTMLButtonElement;
        clearButton?: HTMLButtonElement;
        wikiInput?: HTMLInputElement;
        appendMode?: HTMLInputElement;
        depthSlider?: HTMLInputElement;
        depthValue?: HTMLSpanElement;
        relationLimit?: HTMLInputElement;
        relationLimitValue?: HTMLSpanElement;
        graphStats?: HTMLElement;
    };

    constructor(graphManager: GraphManager) {
        this._graphManager = graphManager;
        this._elements = this.getElements();
        this.setupEventListeners();
        this.updateDepthDisplay();
        this.updateEntityLimitDisplay();
        this.startStatsUpdate();
    }

    /**
     * Gets DOM elements for UI controls
     */
    private getElements() {
        return {
            fetchButton: document.getElementById("fetch-graph") as HTMLButtonElement,
            clearButton: document.getElementById("clear-graph") as HTMLButtonElement,
            wikiInput: document.getElementById("wiki-input") as HTMLInputElement,
            appendMode: document.getElementById("append-mode") as HTMLInputElement,
            depthSlider: document.getElementById("depth-slider") as HTMLInputElement,
            depthValue: document.getElementById("depth-value") as HTMLSpanElement,
            relationLimit: document.getElementById("relation-limit") as HTMLInputElement,
            relationLimitValue: document.getElementById("relation-limit-value") as HTMLSpanElement,
            graphStats: document.getElementById("graph-stats") as HTMLElement,
        };
    }

    /**
     * Sets up event listeners for UI controls
     */
    private setupEventListeners() {
        // Fetch graph button
        this._elements.fetchButton?.addEventListener("click", () => this.handleFetchGraph());

        // Clear graph button
        this._elements.clearButton?.addEventListener("click", () => this.handleClearGraph());

        // Depth slider
        this._elements.depthSlider?.addEventListener("input", () => this.updateDepthDisplay());

        // Entity limit slider
        this._elements.relationLimit?.addEventListener("input", () => this.updateEntityLimitDisplay());
    }

    /**
     * Handles fetch graph button click
     */
    private async handleFetchGraph() {
        try {
            this.setLoadingState(true);
            const settings = this.getSettings();
            const entityId = this._elements.wikiInput?.value.trim() || "Q1"; // defualt to universe
            const appendMode = settings.appendMode && !this._graphManager.isEmpty(); // loads if empty
            await this._graphManager.fetchRelations(entityId, settings.depth, settings.relationLimit, appendMode);
            if (appendMode) {
                // When appending graph may be disconnected and BFS origins need to be redefined
                this._graphManager.graph.updateComponents();
            }
            this.showSuccess(`Graph loaded for: ${entityId}`);
        } catch (error) {
            console.error("Error fetching graph:", error);
            this.showError("Failed to fetch graph data");
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Handles clear graph button click
     */
    private handleClearGraph() {
        this._graphManager.clearGraph();
        this.showSuccess("Graph cleared");
    }

    /**
     * Updates loading state of UI elements
     */
    private setLoadingState(loading: boolean) {
        if (this._elements.fetchButton) {
            this._elements.fetchButton.disabled = loading;
            this._elements.fetchButton.textContent = loading ? "Loading..." : "Fetch Graph";
        }

        if (this._elements.clearButton) {
            this._elements.clearButton.disabled = loading;
        }
    }

    private updateDepthDisplay() {
        if (this._elements.depthSlider && this._elements.depthValue) {
            this._elements.depthValue.textContent = this._elements.depthSlider.value;
        }
    }

    private updateEntityLimitDisplay() {
        if (this._elements.relationLimit && this._elements.relationLimitValue) {
            this._elements.relationLimitValue.textContent = this._elements.relationLimit.value;
        }
    }

    /**
     *  Updates graph stats since backend delay
     */
    private startStatsUpdate() {
        setInterval(() => this.updateStats(), 1000);
    }

    private updateStats() {
        if (this._elements.graphStats) {
            const numOfVertices = Object.keys(this._graphManager.getVertices()).length;
            const numOfEdges = this._graphManager.getEdges().length;
            this._elements.graphStats.textContent = `Vertices: ${numOfVertices} | Edges: ${numOfEdges}`;
        }
    }

    /**
     * Shows success message to user
     */
    private showSuccess(message: string) {
        console.log(`✅ ${message}`);
    }

    /**
     * Shows error message to user
     */
    private showError(message: string) {
        console.error(`❌ ${message}`);
    }

    /**
     * Gets current UI settings ensuring defense against malicious attacks
     */
    getSettings() {
        return {
            depth: MathUtility.clamp(parseInt(this._elements.depthSlider?.value || "1"), 1, 5),
            relationLimit: MathUtility.clamp(parseInt(this._elements.relationLimit?.value || "5"), 1, 10),
            appendMode: this._elements.appendMode?.checked || false,
            entityId: this._elements.wikiInput?.value.trim() || "Q1", // TODO: Add more security
        };
    }

    /**
     * Updates UI state based on graph state
     */
    updateUIState() {
        const isEmpty = this._graphManager.isEmpty();

        // Update append mode availability
        if (this._elements.appendMode) {
            this._elements.appendMode.disabled = isEmpty;
        }

        // Update clear button availability
        if (this._elements.clearButton) {
            this._elements.clearButton.disabled = isEmpty;
        }
    }
}
