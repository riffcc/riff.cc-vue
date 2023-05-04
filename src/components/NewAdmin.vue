<template>
  <div class="grid w-80 sm:w-[25rem] h-48 mx-auto">
    <p class="font-medium mx-auto">New admin</p>
    <div class="py-4 relative mb-2">
      <p class="text-sm mb-1 ml-1">Address:</p>
      <input
        placeholder="0xa5Cf4DDFe4BfDbE712bD2f54EAadaCebb809fAED"
        type="text"
        class="form-input bg-slate-800 w-full h-9 px-1.5"
        v-model="newAdminAddress"
      />
      <p v-if="newAdminAddress && !isValidAddress" class="text-xs text-red-500 absolute -bottom-1">Not a valid address.</p>
    </div>
    <div class="flex items-center gap-3">
      <p class="text-sm ml-1">Super:</p>
      <input
        type="checkbox"
        v-model="adminSuper"
      />
    </div>
    <div class="flex justify-end">
      <button 
        @click="handleOnSubmit" 
        class="py-1.5 px-6 rounded-lg w-fit bg-cyan-400 disabled:text-slate-300 disabled:bg-cyan-700"
        :disabled="loadingCreateAdmin || loadingUpdateAdmin || !newAdminAddress || (newAdminAddress && !isValidAddress)"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script setup>
import { useApolloClient, useMutation } from '@vue/apollo-composable';
import { computed, ref, watch } from 'vue';
import { AdminFragment, CREATE_ETH_ACCOUNT, CREATE_ADMIN, GET_USERS, UPDATE_ADMIN } from '../utils/constants'
import { checkAccount } from '../utils/checkAccount';

const props = defineProps({
  refetchAdmins: Function
})

const id = import.meta.env.VITE_WEBSITE_ID

const newAdminAddress = ref(null)
const adminSuper = ref(false)
const alreadyIsAdmin = ref(false)
const alreadyAdminInactive = ref(false)
const alreadyAdminId = ref(null)
const { client } = useApolloClient()

const isValidAddress = computed(() => {
  return newAdminAddress.value.startsWith("0x") && newAdminAddress.value.length === 42;
})

const { mutate: createAdmin, loading: loadingCreateAdmin } = useMutation(CREATE_ADMIN)
const { mutate: updateAdmin, loading: loadingUpdateAdmin } = useMutation(UPDATE_ADMIN)
watch(newAdminAddress, (address) => {
  if (!address) {
    alreadyIsAdmin.value = false;
    alreadyAdminInactive.value = false;
    return
  }

  const adminExists = client.readFragment({
    id: client.cache.identify({ __typename: "Admin", admin: { address } }),
    fragment: AdminFragment
  })
  if(adminExists?.id) {
    alreadyIsAdmin.value = true;
    alreadyAdminInactive.value = adminExists.inactive ? true : false;
    alreadyAdminId.value = adminExists.id
  }
})


const handleOnSubmit = async () => {

try {

  if (alreadyIsAdmin.value) {
    await updateAdmin({
      input: {
        id: alreadyAdminId.value,
        content: {
          inactive: false,
          super: adminSuper.value,
          metadata: {
            updatedAt: Date.now().toString(),
            createdAt: Date.now().toString()
          }
        }
      }
    })
    props.refetchAdmins()
    newAdminAddress.value = null
    return;
  }

  const getUsers = async (variables) => {
    return await client.query({
      query: GET_USERS,
      variables: {
        id,
        pageSize: 1,
        ...variables
      },
      fetchPolicy: 'no-cache'
    })
  }
  const resultGetUsers = await getUsers()
  const accountId = await checkAccount(getUsers, newAdminAddress.value, resultGetUsers.data.node.users)

  if (accountId) {
    console.log('accountId exists')
    const resulCreateAdmin = await createAdmin({
      input: {
        content: {
          websiteID: id,
          adminID: accountId,
          super: adminSuper.value,
          metadata: {
            createdAt: Date.now().toString(),
            updatedAt: Date.now().toString()
          }
        }
      }
    })
    console.log('resulCreateAdmin', resulCreateAdmin)
  } else {
    const resultCreateEthAccount = await client.mutate({
      mutation: CREATE_ETH_ACCOUNT,
      variables: {
        input: {
          content: {
            address: newAdminAddress.value,
            websiteID: id,
            metadata: {
              updatedAt: Date.now().toString(),
              createdAt: Date.now().toString()
            }
          }
        },
      }
    });
    const resulCreateAdmin = await createAdmin({
      input: {
        content: {
          websiteID: id,
          adminID: resultCreateEthAccount.data.createEthAccount.document.id,
          super: adminSuper.value,
          metadata: {
            createdAt: Date.now().toString(),
            updatedAt: Date.now().toString()
          }
        }
      }
    })
    console.log('resulCreateAdmin', resulCreateAdmin)
  }
  props.refetchAdmins()
  newAdminAddress.value = null
} catch (error) {
  console.log('error on handleOnsubmit in NewAdmin', error)
}

}
</script>