export type i18nResourceNavigation = Record<i18nNamespaceNavigation, Record<i18nNamespaceNavigationKeys, string>>

export type i18nNamespaceNavigation = 'navigation'

export type i18nNamespaceNavigationKeys
  = | 'app'
    | 'home'
