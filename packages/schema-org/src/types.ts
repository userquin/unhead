import type { SchemaOrgGraph } from './core'
import type { ImageObject, Organization, Person } from './nodes'

export type Arrayable<T> = T | Array<T>
export type NodeRelation<T> = T | IdReference
export type NodeRelations<T> = Arrayable<NodeRelation<T>>
export type Identity = Person | Organization
export type ResolvableDate = string | Date
export type OptionalSchemaOrgPrefix<T extends string> = T | `https://schema.org/${T}`
export interface ResolvedMeta {
  host: string
  url: string
  currency?: string
  inLanguage?: string
  image?: string
  title?: string
  description?: string
  datePublished?: string
  dateModified?: string

  trailingSlash?: boolean
}

export interface MetaInput {
  /**
   * Whether to inject the scripts at the end of the body or in the head.
   */
  tagPosition?: 'body' | 'head'

  trailingSlash?: boolean
  host: string
  url?: string
  path?: string
  currency?: string
  image?: string
  inLanguage?: string
  title?: string
  description?: string
  datePublished?: string
  dateModified?: string
  /**
   * @deprecated use tagPosition
   */
  position?: 'body' | 'head'
  /**
   * @deprecated use `language`
   */
  defaultLanguage?: string
  /**
   * @deprecated use `currency`
   */
  defaultCurrency?: string
  /**
   * @deprecated use `host`
   */
  canonicalHost?: string
  /**
   * @deprecated use `url` or `path`
   */
  canonicalUrl?: string
}

export interface UserConfig extends MetaInput {}

export interface SchemaOrgNodeDefinition<ResolvedInput> {
  alias?: string
  cast?: (node: any, ctx: SchemaOrgGraph) => ResolvedInput
  idPrefix?: 'host' | 'url' | ['host' | 'url', string ]
  inheritMeta?: (keyof ResolvedMeta | { key: keyof ResolvedInput, meta: keyof ResolvedMeta })[]
  defaults?: Partial<ResolvedInput> | ((ctx: SchemaOrgGraph) => Partial<any>)
  required?: (keyof ResolvedInput)[]
  resolve?: (node: ResolvedInput, ctx: SchemaOrgGraph) => ResolvedInput
  resolveRootNode?: (node: ResolvedInput, ctx: SchemaOrgGraph) => void
}

export interface Thing {
  '@type'?: Arrayable<string>
  '@id'?: Id
  /**
   * A reference-by-ID to the WebPage node.
   */
  'mainEntityOfPage'?: Arrayable<IdReference>
  /**
   * A reference-by-ID to the WebPage node.
   */
  'mainEntity'?: Arrayable<IdReference>
  /**
   * An image object or referenced by ID.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  'image'?: NodeRelations<ImageObject | string>

  /**
   * The work that this work has been translated from. E.g. 物种起源 is a translationOf “On the Origin of Species”.
   */
  'translationOfWork'?: NodeRelations<Thing>
  /**
   * A work that is a translation of the content of this work. E.g. 西遊記 has an English workTranslation “Journey to the West”, a German workTranslation “Monkeys Pilgerfahrt” and a Vietnamese translation Tây du ký bình khảo.
   */
  'workTranslation'?: NodeRelations<Thing>

  /**
   * Allow any arbitrary keys
   */
  [key: string]: any
}

export interface SchemaOrgNode extends Thing {
  _resolver?: SchemaOrgNodeDefinition<any>
  _dedupeStrategy?: 'replace' | 'merge'
}

export type WithResolver<T> = T & {
  _resolver?: SchemaOrgNodeDefinition<T>
}

export interface IdReference {
  /** IRI identifying the canonical address of this object. */
  '@id': string
}

// we support string for DX
export type Id = string | `#${string}` | `https://${string}#${string}`
