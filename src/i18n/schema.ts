import { i18nNamespaceProjectKeys } from '@woodcutapp/woodcutapp'

import { i18nNamespaceAppMenuKeys } from '@/i18n/app-menu'
import { i18nNamespaceCommonKeys } from '@/i18n/common'
import { i18nNamespaceFeatureKeys } from '@/i18n/feature'
import { i18nNamespaceHomeKeys } from '@/i18n/home'
import { i18nNamespaceNavigationKeys } from '@/i18n/navigation'

export type AppMenuJsonSchema = Record<i18nNamespaceAppMenuKeys, string>
export type CommonJsonSchema = Record<i18nNamespaceCommonKeys, string>
export type FeatureJsonSchema = Record<i18nNamespaceFeatureKeys, string>
export type HomeJsonSchema = Record<i18nNamespaceHomeKeys, string>
export type NavigationJsonSchema = Record<i18nNamespaceNavigationKeys, string>
export type ProjectJsonSchema = Record<i18nNamespaceProjectKeys, string>
