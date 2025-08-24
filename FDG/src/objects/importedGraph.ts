// These interfaces are type declarations for the imported graph data
// TODO: Make wikidata reader not just for games

export interface ObjNode {
    type: string;
    releaseDate?: string;
}

export interface ObjEdge {
    source: string;
    target: string;
    type: string;
}

export interface ObjGraphData {
    nodes: Record<string, ObjNode>;
    edges: ObjEdge[];
}
