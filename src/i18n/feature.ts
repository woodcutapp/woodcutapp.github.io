export type i18nResourceFeature = { [key in i18nNamespaceFeature]: Record<i18nNamespaceFeatureKeys, string> }

export type i18nNamespaceFeature = 'feature'

export type i18nNamespaceFeatureKeys =
  | 'cutlist'
  | 'cutlist.description'
  | 'cuts'
  | 'cuts.description'
  | 'export'
  | 'export.description'
  | 'ruler'
  | 'ruler.description'
  | 'transform'
  | 'transform.description'
