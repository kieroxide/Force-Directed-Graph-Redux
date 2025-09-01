// These interfaces are type declarations for the imported graph data
// TODO: Make wikidata reader not just for games

// Maps an entity QID to its label
export interface EntityMap {
  [entity_id: string]: string;
}

// Maps a property PID to its label
export interface PropertyMap {
  [property_id: string]: string;
}

// Maps a source entity to its outgoing relationships
export interface RelationshipsMap {
  [source_id: string]: {
    [property_id: string]: string[]; // Array of target QIDs
  };
}
