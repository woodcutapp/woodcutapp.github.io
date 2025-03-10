export type i18nResourceCommon = { [key in i18nNamespaceCommon]: Record<i18nNamespaceCommonKeys, string> }

export type i18nNamespaceCommon = 'common'

export type i18nNamespaceCommonKeys =
  | 'app'
  | 'board'
  | 'cancel'
  | 'component'
  | 'copy'
  | 'cut'
  | 'find'
