
export type chapter = string[]

export interface bible {
  abbrev: string;
  chapters: chapter[];
  name: string;
}

export interface bibleFr {
  bible: bible[]
}