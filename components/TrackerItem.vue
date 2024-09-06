<template>
  <Card size="sm" class="flex items-center justify-between">
    <Modal v-model="isShowEditModal" title="แก้ไข">
      <Form @submit="onSubmit">
        <FormFields :options="formFields" class="grid grid-cols-2 gap-4" />
        <div class="mt-6">
          <Button size="sm" type="submit" block :loading="trackerUpdate.status.value.isLoading">
            แก้ไข
          </Button>
        </div>
      </Form>
    </Modal>
    <div class="flex-1 truncate">
      <div class="flex flex-col">
        <div class="flex justify-between">
          <div class="flex items-center space-x-3">
            <p
              class="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
            >
              {{ item.projects.name }}
            </p>
            <p class="flex items-center truncate text-sm text-gray-500">
              <Icon name="ph:clock" class="mr-1" />
              {{ item.timing }} ชั่วโมง
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <p class="text-primary text-sm uppercase">{{ item.tracker_type }}</p>
            <div v-if="editable">
              <UDropdown
                :items="[
                  [
                    {
                      label: 'แก้ไข',
                      icon: 'ph:pencil',
                      click: () => {
                        isShowEditModal = true
                      },
                    },
                    { label: 'ลบ', icon: 'ph:trash', click: onDelete },
                  ],
                ]"
                :popper="{ placement: 'bottom-end' }"
              >
                <Icon name="ph:dots-three-vertical-bold" class="text-gray-400" />
              </UDropdown>
            </div>
          </div>
        </div>

        <p class="mt-4 whitespace-pre-line text-sm text-gray-900" v-html="item.detail.trim()" />
        <p class="mt-4 text-xs text-gray-500">
          By {{ item.profiles.display_name }} ({{ item.profiles.team }})
        </p>
      </div>
    </div>
  </Card>
</template>
<script lang="ts" setup>
import {
  type ITrackerItem,
  useProject,
  useTrackerRemove,
  useTrackerUpdate,
} from '~/loaders/tracker'
import * as z from 'zod'
import { INPUT_TYPES } from '#core/components/Form/types'

const emits = defineEmits(['update', 'delete'])

const props = defineProps<{
  item: ITrackerItem
  editable?: boolean
}>()

const dialog = useDialog()
const noti = useNotification()
const trackerRemove = useTrackerRemove()
const trackerUpdate = useTrackerUpdate()
const project = useProject()
const isShowEditModal = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      tracker_type: z.string().min(1, { message: 'กรุณาเลือกประเภทงาน' }),
      project_id: z.string().min(1, { message: 'กรุณาเลือกโครงการ' }),
      detail: z.string().min(1, { message: 'กรุณากรอกรายละเอียดงาน' }),
      timing: z.number().min(1, { message: 'กรุณากรอกเวลาที่ใช้' }),
    })
  ),
  initialValues: props.item,
  keepValuesOnUnmount: true,
})

const onDelete = () => {
  dialog
    .warning({
      title: 'ยืนยัน',
      description: 'คุณต้องการลบรายการนี้หรือไม่?',
      confirmText: 'ลบ',
      cancelText: 'ยกเลิก',
      isShowCancelBtn: true,
    })
    .then(() => {
      trackerRemove.remove(props.item.id)
    })
}

useWatchTrue(
  () => trackerRemove.status.value.isSuccess,
  () => {
    noti.success({
      title: 'ลบรายการสําเร็จ',
    })

    emits('delete', props.item)
  }
)

useWatchTrue(
  () => trackerRemove.status.value.isError,
  () => {
    noti.error({
      title: 'ลบรายการไม่สําเร็จ',
      description: StringHelper.getError(trackerRemove.status.value.errorData),
    })
  }
)

useWatchTrue(
  () => trackerUpdate.status.value.isSuccess,
  () => {
    noti.success({
      title: 'แก้ไขข้อมูลสําเร็จ',
    })

    isShowEditModal.value = false
    emits('update', props.item)
  }
)

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

const onSubmit = form.handleSubmit((values) => {
  trackerUpdate.update(props.item.id, values)
})
</script>
