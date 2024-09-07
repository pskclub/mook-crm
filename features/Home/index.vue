<template>
  <Log :data-items="[allTracker.items.value, allTracker.byProfileItems.value]" />
  <div class="md:flex">
    <div class="mr-4">
      <p class="mb-4 text-xl font-bold">ปฏิทิน</p>
      <Datepicker
        v-model="date"
        inline
        auto-apply
        :enable-time-picker="false"
        locale="th"
        :max-date="new Date()"
      />
    </div>
    <div class="grid flex-1 gap-4 md:grid-cols-2">
      <div>
        <p class="text-xl font-bold">ของฉัน</p>
        <div class="mt-4 grid grid-cols-1 gap-4">
          <Card size="xs">
            <Form @submit="onSubmit">
              <FormFields :options="formFields" :form="form" class="grid grid-cols-2 gap-4" />
              <div class="mt-4">
                <Button
                  size="sm"
                  type="submit"
                  block
                  :loading="trackerCreate.status.value.isLoading"
                >
                  สร้าง
                </Button>
              </div>
            </Form>
          </Card>
          <Loader :is-loading="myTracker.status.value.isLoading">
            <TrackerItemEmpty v-if="myTracker.items.value.length === 0" />
            <TrackerGroupItem
              v-for="item in myTracker.byProfileItems.value"
              :key="item.profile.id"
              :item="item"
              editable
              @delete="onDelete"
              @update="onUpdate"
            />
          </Loader>
        </div>
      </div>
      <div>
        <p class="text-xl font-bold">ทั้งหมด</p>
        <div class="mt-4 grid grid-cols-1 gap-4">
          <Loader :is-loading="allTracker.status.value.isLoading">
            <TrackerItemEmpty v-if="allTracker.items.value.length === 0" />
            <TrackerGroupItem
              v-for="item in allTracker.byProfileItems.value"
              :key="item.profile.id"
              :item="item"
            />
          </Loader>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { type ITrackerItem, useProject, useTracker, useTrackerCreate } from '~/loaders/tracker'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useWatchChange } from '#imports'
import { INPUT_TYPES } from '#core/components/Form/types'
import * as z from 'zod'

const user = useSupabaseUser()
const allTracker = useTracker()
const myTracker = useTracker()
const project = useProject()
const trackerCreate = useTrackerCreate()
const noti = useNotification()

const date = ref(new Date())
const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      tracker_type: z.string().min(1, { message: 'กรุณาเลือกประเภทงาน' }),
      project_id: z.string().min(1, { message: 'กรุณาเลือกโครงการ' }),
      detail: z.string().min(1, { message: 'กรุณากรอกรายละเอียดงาน' }),
      timing: z.number().min(1, { message: 'กรุณากรอกเวลาที่ใช้' }),
    })
  ),
  initialValues: {
    tracker_type: '',
    project_id: '',
    detail: '',
  },
})

onMounted(() => {
  fetchAllTracker()
  fetchMyTracker()
  project.fetch()
})

const onSubmit = form.handleSubmit((values) => {
  trackerCreate.create({
    ...values,
    tracker_date: TimeHelper.getDateFormTime(date.value),
    created_by: user.value?.id,
  })
})

useWatchTrue(
  () => trackerCreate.status.value.isSuccess,
  () => {
    form.handleReset()
    fetchAllTracker()
    fetchMyTracker()
    noti.success({
      title: 'สร้างงานสําเร็จ',
    })
  }
)

useWatchTrue(
  () => trackerCreate.status.value.isError,
  () => {
    noti.error({
      title: 'สร้างงานไม่สําเร็จ',
      description: StringHelper.getError(trackerCreate.status.value.errorData),
    })
  }
)

const fetchAllTracker = () => {
  allTracker.fetch({
    filters: [
      {
        column: 'tracker_date',
        operator: 'eq',
        value: TimeHelper.getDateFormTime(date.value),
      },
    ],
  })
}

const fetchMyTracker = () => {
  myTracker.fetch({
    filters: [
      {
        column: 'tracker_date',
        operator: 'eq',
        value: TimeHelper.getDateFormTime(date.value),
      },
      {
        column: 'created_by',
        operator: 'eq',
        value: user.value!.id,
      },
    ],
  })
}

useWatchChange(
  () => date.value,
  () => {
    fetchAllTracker()
    fetchMyTracker()
  }
)

const onDelete = (item: ITrackerItem) => {
  fetchAllTracker()
  fetchMyTracker()
}

const onUpdate = (item: ITrackerItem) => {
  fetchAllTracker()
  fetchMyTracker()
}

const formFields = createFormFields(() => [
  {
    type: INPUT_TYPES.SELECT,
    props: {
      isRequired: true,
      name: 'tracker_type',
      placeholder: 'ประเภทงาน',
      options: [
        { label: 'On Project', value: 'project' },
        { label: 'On Meeting', value: 'meeting' },
        { label: 'Leave', value: 'leave' },
        { label: 'Team Management', value: 'team_management' },
        { label: 'Standby', value: 'standby' },
        { label: 'OT', value: 'ot' },
      ],
    },
  },
  {
    type: INPUT_TYPES.SELECT,
    props: {
      isRequired: true,
      name: 'project_id',
      placeholder: 'โปรเจค',
      isLoading: project.status.isLoading,
      options: ArrayHelper.toOptions(project.items, 'id', 'name'),
    },
  },
  {
    type: INPUT_TYPES.SELECT,
    class: 'col-span-2',
    props: {
      isRequired: true,
      name: 'timing',
      placeholder: 'เวลาที่ใช้',
      options: [
        { label: '1', value: 1 },
        { label: '1.5', value: 1.5 },
        { label: '2', value: 2 },
        { label: '2.5', value: 2.5 },
        { label: '3', value: 3 },
        { label: '3.5', value: 3.5 },
        { label: '4', value: 4 },
        { label: '4.5', value: 4.5 },
        { label: '5', value: 5 },
        { label: '5.5', value: 5.5 },
        { label: '6', value: 6 },
        { label: '6.5', value: 6.5 },
        { label: '7', value: 7 },
        { label: '7.5', value: 7.5 },
        { label: '8', value: 8 },
      ],
    },
  },
  {
    type: INPUT_TYPES.TEXTAREA,
    class: 'col-span-2',
    props: {
      isRequired: true,
      name: 'detail',
      placeholder: 'รายละเอียด',
    },
  },
])
</script>
