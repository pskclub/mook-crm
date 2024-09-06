<template>
  <Container size="xs" class="my-6 flex h-full flex-1 items-center justify-center">
    <Card class="flex w-full flex-col" size="sm">
      <img src="/images/logo-m.png" alt="" class="mx-auto w-[110px]" />
      <p class="text-primary mx-auto my-4 text-2xl font-bold">เข้าสู่ระบบ</p>
      <Form @submit="onSubmit">
        <FormFields :options="formFields" />
        <div class="mt-6">
          <Button type="submit" block> เข้าสู่ระบบ </Button>
        </div>
      </Form>
    </Card>
  </Container>
</template>
<script lang="ts" setup>
import { useApp } from '#imports'
import { routes } from '~/constants/routes'
import { INPUT_TYPES } from '#core/components/Form/types'
import * as z from 'zod'

definePageMeta({
  layout: 'default',
})

useApp().defineSEO({
  title: routes.login.name,
  description: routes.login.name,
})

useApp().definePage({
  title: routes.login.name,
})

const dialog = useDialog()
const router = useRouter()
const supabase = useSupabaseClient()

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  initialValues: {
    email: '',
    password: '',
  },
})

const formFields = createFormFields(() => [
  {
    type: INPUT_TYPES.TEXT,
    props: {
      isRequired: true,
      name: 'email',
      label: 'อีเมล',
    },
  },
  {
    type: INPUT_TYPES.PASSWORD,
    props: {
      isRequired: true,
      name: 'password',
      label: 'รหัสผ่าน',
    },
  },
])

const onSubmit = form.handleSubmit(async (values) => {
  const res = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  if (res.error) {
    return dialog.error({
      title: 'เข้าสู่ระบบไม่สำเร็จ',
      description: res.error.message,
    })
  }

  router.push(routes.home.to)
})
</script>
