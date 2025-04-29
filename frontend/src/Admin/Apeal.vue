<template>
  <div>
    <div class="overflow-x-auto custom-scroll pb-[50px]">
      <p class="text-lg font-semibold text-blue-800 dark:text-blue-300">
        <span class="text-[22px] font-bold">Murojaatlar</span>
      </p>
      <div class="mx-auto mt-5 w-full lg:w-[1200px] flex flex-col gap-4">

        <div class="container bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl">
          <n-table v-if="!loading" :bordered="false" :single-line="false">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th class="py-2 px-3 text-center">№</th>
                <th class="py-2 px-3 text-center">F.I</th>
                <th class="py-2 px-3 text-center">Telefon raqami</th>
                <th class="py-2 px-3 text-center">Tasnifi</th>
                <th class="py-2 px-3 text-center">Holati</th>
                <th class="py-2 px-3 text-center">Vaqti</th>
                <th class="py-2 px-3 text-center">Tahrirlash</th>
                <th class="py-2 px-3 text-center">Qayta ko'rish</th>
                <th class="py-2 px-3 text-center text-red-600">O'chirish</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, j) in data" :key="i.id"
                class="transition-all hover:bg-blue-50 dark:hover:bg-gray-800 border-b dark:border-gray-700 rounded-lg">
                <td class="text-center py-2 px-3">{{ (j + 1) + (page - 1) * size }}</td>
                <td class="text-center font-bold">
                  <span :class="i.status == 4 ? 'line-through text-red-600' : ''">
                    {{ i.lastname }} {{ i.firstname }}
                  </span>
                </td>
                <td class="text-center select-text">{{ i.phone }}</td>
                <td class="text-center">{{ i.description }}</td>
                <td class="text-center">{{ i.statusname }}</td>
                <td class="text-center">{{ (new Date(i.created_at)).toLocaleString() }}</td>
                <td class="text-center">
                  <n-button type="primary" size="small" @click="editmodal(i)">
                    <i class="fas fa-pen"></i>
                  </n-button>
                </td>
                <td class="text-center">
                  {{ i.reseen ? (new Date(i.reseen)).toLocaleString() : 'Mavjud emas' }}
                </td>
                <td class="text-center">
                  <n-button type="error" size="small"
                    @click="deletemodal = true; deleteitem = i.id; deletecontent = `${i.lastname} ${i.firstname}dan kelgan taklifni o'chirasizmi ?`">
                    <i class="far fa-trash-can"></i>
                  </n-button>
                </td>
              </tr>
            </tbody>
          </n-table>

          <n-table v-if="loading" :bordered="false" :single-line="false">
            <thead>
              <tr>
                <th class="text-center">№</th>
                <th class="text-center">F.I</th>
                <th class="text-center">Telefon raqami</th>
                <th class="text-center">Tasnifi</th>
                <th class="text-center">Holati</th>
                <th class="text-center">Vaqti</th>
                <th class="text-center">####</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, j) in 5" :key="j">
                <td class="text-center">{{ j + 1 + (page - 1) * size }}</td>
                <td class="text-center"><n-skeleton height="30px" width="100%" /></td>
                <td class="text-center"><n-skeleton height="30px" width="100%" /></td>
                <td class="text-center"><n-skeleton height="30px" width="100%" /></td>
                <td class="text-center"><n-skeleton height="30px" width="100%" /></td>
                <td class="text-center"><n-skeleton height="30px" width="100%" /></td>
                <td class="text-center"><n-skeleton height="30px" width="100%" /></td>
              </tr>
            </tbody>
          </n-table>
        </div>

        <n-pagination v-model:page="page" :page-count="sizecount" />
        <div class="font-bold">
          <span class="text-green-600">Barcha ma'lumotlar soni</span>:
          <span :title="total">{{ total }}</span>
        </div>
      </div>
    </div>

    <!-- Modal for editing -->
    <n-modal v-model:show="store.modals.editApeal.show" class="custom-card" preset="card"
      :style="{ width: '600px' }" :title="`${store.modals.editApeal.data.lastname} ${store.modals.editApeal.data.firstname}`"
      :bordered="true" size="huge" :segmented="{ content: 'soft', footer: 'soft' }">
      <editapeals />
    </n-modal>

    <!-- Delete confirmation modal -->
    <n-modal v-model:show="deletemodal" preset="dialog" title="O'chirish" :content="deletecontent"
      positive-text="Ha" negative-text="Bekor qilindi" @positive-click="deletedata" @negative-click="cancelCallback" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import url from "../../base/index";
import { Dean } from "../../Pinia/index.js";
import editapeals from "./Modals/editapeals.vue";

let store = Dean();
let page = ref(1);
let size = ref(10);
let data = ref([]);
let loading = ref(false);
let sizecount = ref(1);
let total = ref(0);
let message = useMessage();
let router = useRouter();

let deletemodal = ref(false);
let deleteitem = ref(null);
let deletecontent = ref('');

function editmodal(data) {
  store.modals.editApeal.show = true;
  store.modals.editApeal.data = data;
}

async function deletedata() {
  try {
    const token = localStorage.token;
    let backend = await fetch(`${url}apeal/edit/byid/${deleteitem.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        '-x-token': token
      }
    });
    if (backend.status === 200) {
      message.success("Ma'lumot o'chirildi");
      callbackend(page.value);
    } else if (backend.status === 401) {
      router.push('/login');
    } else if (backend.status === 400) {
      const error = await backend.json();
      message.error(error.error);
    }
  } catch (e) {
    message.error("O'chirishda xatolik yuz berdi.");
  }
}

function cancelCallback() {}

async function callbackend(pageNum) {
  data.value = [];
  loading.value = true;
  try {
    const token = localStorage.token;
    let response = await fetch(`${url}apeal/getapeal/all?${new URLSearchParams({ page: pageNum, size: size.value })}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        '-x-token': token
      }
    });
    if (response.status === 200) {
      const json = await response.json();
      sizecount.value = Math.ceil(+json[0].total / 10);
      data.value = json;
      total.value = json[0].total;
    } else if (response.status === 401) {
      router.push('/login');
    }
  } catch (e) {
    message.error("Server bilan aloqa uzildi");
  } finally {
    loading.value = false;
  }
}

onMounted(() => callbackend(1));
watch(page, (newPage) => callbackend(newPage));
watch(() => store.modals.editApeal.loading, (val) => {
  if (val) callbackend(page.value);
});
</script>

<style>
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgb(0, 20, 60) #eee;
}
.custom-scroll::-webkit-scrollbar {
  height: 8px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: #f0f0f0;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 2px solid #f0f0f0;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #444;
}
</style>
