export interface PokemonSummary {
  id: number;
  name: string;
  types: string[];
  sprite_url: string | null;
  base_experience: number | null;
}

export interface Stat {
  name: string;
  value: number;
}

export interface Ability {
  name: string;
  is_hidden: boolean;
}

export interface EvolutionNode {
  name: string;
  level: number | null;
  trigger: string | null;
  sprite_url: string | null;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: string[];
  sprite_url: string | null;
  base_experience: number | null;
  stats: Stat[];
  abilities: Ability[];
  height: number;
  weight: number;
  evolution_chain: EvolutionNode[] | null;
}

export interface DamageRelations {
  double_damage_from: string[];
  double_damage_to: string[];
  half_damage_from: string[];
  half_damage_to: string[];
  no_damage_from: string[];
  no_damage_to: string[];
}

export interface TypeInfo {
  name: string;
  color_hex: string;
  damage_relations: DamageRelations;
}

export interface PaginatedResponse {
  items: PokemonSummary[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
