import { defineAppConfig } from '#imports'
import { type AppConfigInput } from 'nuxt/schema'
import { SITE } from '~/constants/site'
import { badge, button, buttonGroup, pagination, table } from '#core/ui.config'
import { alert } from '#core/ui.config/alert'
import { formGroup } from '#core/ui.config/formGroup'
import { checkbox } from '#core/ui.config/checkbox'
import { input } from '#core/ui.config/input'
import { select } from '#core/ui.config/select'
import { selectMenu } from '#core/ui.config/selectMenu'
import { textarea } from '#core/ui.config/textarea'
import { toggle } from '#core/ui.config/toggle'
import { notification } from '#core/ui.config/notification'

// Configs here will be merged with the default config
export default defineAppConfig<AppConfigInput>({
  core: {
    limit_per_page: 30,
    date_format: 'dd-MM-yyyy',
    date_time_format: 'dd MMM yyyy HH:mm',
    time_format: 'HH:mm',
    is_thai_year: true,
    is_thai_month: true,
    site_name: SITE.TITLE,
  },
  ui: {
    strategy: 'override',
    primary: 'main',
    table,
    pagination,
    badge,
    alert,
    button,
    buttonGroup,
    formGroup,
    checkbox,
    input,
    select,
    selectMenu,
    textarea,
    toggle,
    notification,
    notifications: {
      position: 'top-0 end-0',
    },
  },
})
