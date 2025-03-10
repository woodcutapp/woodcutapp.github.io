export type i18nResourceHome = { [key in i18nNamespaceHome]: Record<i18nNamespaceHomeKeys, string> }

export type i18nNamespaceHome = 'home'

export type i18nNamespaceHomeKeys =
  | 'app.name'
  | 'app.slogan'
  | 'app.text'
  | 'features'
  | 'help'
  | 'help.text'
  | 'start'
