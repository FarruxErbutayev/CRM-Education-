<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <div class="overflow-x-auto custom-scroll pb-12">
      <p class="text-2xl font-bold text-gray-800 mb-6">
        Qayta ko'rilmagan murojaatlar
      </p>
      <div class="mx-auto mt-5 w-full lg:w-[1200px] flex flex-col gap-6">
        <div class="container bg-white shadow-md rounded-lg overflow-hidden">
          <n-table v-if="!loading" :bordered="false" :single-line="false">
            <thead class="bg-gray-200">
              <tr>
                <th class="py-3 px-4 text-left">№</th>
                <th class="py-3 px-4 text-center">F.I</th>
                <th class="py-3 px-4 text-center">Telefon raqami</th>
                <th class="py-3 px-4 text-center">Tasnifi</th>
                <th class="py-3 px-4 text-center">Holati</th>
                <th class="py-3 px-4 text-center">Vaqti</th>
                <th class="py-3 px-4 text-center">Tahrirlash</th>
                <th class="py-3 px-4 text-center">Qayta ko'rish</th>
                <th class="py-3 px-4 text-center text-red-600">O'chirish</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(i, j) in data"
                :key="new Number(i.id)"
                class="hover:bg-gray-100 transition"
              >
                <td class="py-3 px-4">{{ (j + 1) + (page - 1) * size }}</td>
                <td class="py-3 px-4 font-bold">
                  <span
                    :class="i.status == 4 ? 'line-through text-red-700' : ''"
                  >
                    {{ i.lastname }} {{ i.firstname }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center">{{ i.phone }}</td>
                <td class="py-3 px-4 text-center">{{ i.description }}</td>
                <td class="py-3 px-4 text-center">{{ i.statusname }}</td>
                <td class="py-3 px-4 text-center">
                  {{ (new Date(i.created_at)).toLocaleString() }}
                </td>
                <td class="py-3 px-4 text-center">
                  <n-button type="tertiary" @click="editmodal(i)">
                    <i class="fas fa-pen"></i>
                  </n-button>
                </td>
                <td class="py-3 px-4 text-center">
                  <span v-if="i.reseen">
                    {{ (new Date(i.reseen)).toLocaleString() }}
                    <reversecountdown :startDate="i.reseen" />
                  </span>
                  <span v-else class="text-gray-500">Mavjud emas</span>
                </td>
                <td class="py-3 px-4 text-center">
                  <n-button
                    type="error"
                    @click="deletemodal = true; deleteitem = i.id; deletecontent = `${i.lastname} ${i.firstname}dan kelgan taklifni o'chirasizmi ?`"
                  >
                    <i class="far fa-trash-can"></i>
                  </n-button>
                </td>
              </tr>
              <tr v-if="!data.length">
                <td colspan="9" class="py-6 text-center text-gray-500">
                  <i>Ma'lumot mavjud emas</i>
                </td>
              </tr>
            </tbody>
          </n-table>

          <n-table v-if="loading" :bordered="false" :single-line="false">
            <thead class="bg-gray-200">
              <tr>
                <th class="py-3 px-4 text-left">№</th>
                <th class="py-3 px-4 text-center">F.I</th>
                <th class="py-3 px-4 text-center">Telefon raqami</th>
                <th class="py-3 px-4 text-center">Tasnifi</th>
                <th class="py-3 px-4 text-center">Holati</th>
                <th class="py-3 px-4 text-center">Vaqti</th>
                <th class="py-3 px-4 text-center">####</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i, j) in 5" :key="j">
                <td class="py-3 px-4">{{ j + 1 + (page - 1) * size }}</td>
                <td class="py-3 px-4 text-center font-bold">
                  <n-skeleton v-if="loading" height="40px" width="100%" />
                </td>
                <td class="py-3 px-4 text-center">
                  <n-skeleton v-if="loading" height="40px" width="100%" />
                </td>
                <td class="py-3 px-4 text-center">
                  <n-skeleton v-if="loading" height="40px" width="100%" />
                </td>
                <td class="py-3 px-4 text-center">
                  <n-skeleton v-if="loading" height="40px" width="100%" />
                </td>
                <td class="py-3 px-4 text-center">
                  <n-skeleton v-if="loading" height="40px" width="100%" />
                </td>
                <td class="py-3 px-4 text-center">
                  <n-skeleton v-if="loading" height="40px" width="100%" />
                </td>
              </tr>
            </tbody>
          </n-table>
        </div>

        <n-pagination
          v-model:page="page"
          :page-count="sizecount"
          class="mt-4"
        />
        <div class="font-bold text-gray-700">
          <span class="text-green-600">Barcha ma'lumotlar soni:</span>
          <span :title="total">{{ total }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal section -->
  <n-modal
    v-model:show="store.modals.editApeal.show"
    class="custom-card"
    preset="card"
    :style="{ width: '600px' }"
    :title="`${store.modals.editApeal.data.lastname} ${store.modals.editApeal.data.firstname}`"
    :bordered="true"
    size="huge"
    :segmented="{ content: 'soft', footer: 'soft' }"
  >
    <editapeals />
  </n-modal>

  <n-modal
    v-model:show="deletemodal"
    preset="dialog"
    title="O'chirish"
    :content="deletecontent"
    positive-text="Ha"
    negative-text="Bekor qilindi"
    @positive-click="deletedata"
    @negative-click="cancelCallback"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import url from "../../base/index";
import { Dean } from "../../Pinia/index.js";
import editapeals from "./Modals/editapeals.vue";
import reversecountdown from "./component/reversecountdown.vue";

let store = Dean();

function editmodal(data) {
  store.modals.editApeal.show = true;
  store.modals.editApeal.data = data;
}

let deletecontent = ref("");
let deletemodal = ref(false);
let deleteitem = ref(null);

let deletedata = async function () {
  let token = localStorage.token;
  try {
    let backend = await fetch(`${url}apeal/edit/byid/${deleteitem.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "-x-token": token,
      },
    });
    if (backend.status == 200) {
      message.success("Ma'lumot o'chirildi");
      callbackend(page.value);
      return;
    }
    if (backend.status == 401) {
      return router.push("/login");
    }
    if (backend.status == 400) {
      backend = await backend.json();
      message.error(backend.error);
    }
  } catch (error) {}
};

let cancelCallback = function () {};

let page = ref(1);
let message = useMessage();
let size = ref(10);
let data = ref([]);
let sizecount = ref(1);
let loading = ref(false);
let total = ref(0);
let router = useRouter();

watch(page, (page, old) => {
  callbackend(page);
});

let callbackend = async (page) => {
  data.value = [];
  loading.value = true;
  let token = localStorage.token;
  try {
    let backend = await fetch(
      `${url}notification/getapel/all?${new URLSearchParams({
        page: page,
        size: size.value,
      }).toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "-x-token": token,
        },
      }
    );
    if (backend.status == 200) {
      backend = await backend.json();
      sizecount.value = Math.ceil(new Number(backend[0].total) / 10);
      data.value = [...backend];
      loading.value = false;
      total.value = backend[0].total;
      return;
    }
    if (backend.status == 401) return router.push("/login");
  } catch (error) {
    if (error.message == "Failed to fetch")
      return message.error("Server bilan aloqa uzildi");
  }
};

onMounted(async () => {
  callbackend(1);
});

watch(
  () => store.modals.editApeal.loading,
  (data, old) => {
    if (data) {
      callbackend(page.value);
    }
  },
  { deep: true }
);
</script>

<style>
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgb(0, 20, 60) #eee;
}

.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: rgb(0, 20, 60);
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 2px solid rgb(0, 20, 60);
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgb(0, 20, 60);
}
</style>