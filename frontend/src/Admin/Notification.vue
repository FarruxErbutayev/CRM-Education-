<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <p class="text-2xl font-bold text-gray-800 mb-6">
      Bildirishnomalar
    </p>

    <div class="w-full lg:w-[1000px] mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden">
      <n-table :bordered="false" :single-line="false">
        <thead class="bg-gray-200">
          <tr>
            <th class="py-3 px-4 text-left">№</th>
            <th class="py-3 px-4 text-left">Sarlavha</th>
            <th class="py-3 px-4 text-center">Boshlanish vaqti</th>
            <th class="py-3 px-4 text-center">Tugash vaqti</th>
            <th class="py-3 px-4 text-left">Description</th>
            <th class="py-3 px-4 text-center">Joylashuv</th>
            <th class="py-3 px-4 text-center">Teglar</th>
            <th class="py-3 px-4 text-center">Activligi</th>
            <th class="py-3 px-4 text-center text-red-600">O'chirish</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(i, j) in data"
            :key="i.id"
            class="hover:bg-gray-100 transition"
          >
            <td class="py-3 px-4">{{ j + 1 }}</td>
            <td class="py-3 px-4 font-bold">{{ i.title }}</td>
            <td class="py-3 px-4 text-center">
              {{ (new Date(i.start_time)).toLocaleString() }}
            </td>
            <td class="py-3 px-4 text-center">
              <div class="flex flex-col items-center">
                {{ (new Date(i.end_time)).toLocaleString() }}
                <countdown :targetDateTime="i.end_time" />
              </div>
            </td>
            <td class="py-3 px-4 text-justify text-sm">
              <div class="truncate w-[150px]">{{ i.description }}</div>
            </td>
            <td class="py-3 px-4 text-center">
              <span v-if="i.location">{{ i.location }}</span>
              <span v-else class="text-gray-500 italic">Mavjud emas</span>
            </td>
            <td class="py-3 px-4 text-center">
              <span v-if="i.tags">{{ i.tags }}</span>
              <span v-else class="text-gray-500 italic">Mavjud emas</span>
            </td>
            <td class="py-3 px-4 text-center">
              <n-switch
                @click="change_active({ id: i.id, active: i.active })"
                v-model:value="i.active"
              >
                <template #checked>Faol</template>
                <template #unchecked>Faol emas</template>
              </n-switch>
            </td>
            <td class="py-3 px-4 text-center">
              <n-button
                type="error"
                @click="showModal = true; deleteitemtext = i.title; deleteitem = i.id"
              >
                <i class="far fa-trash-can"></i>
              </n-button>
            </td>
          </tr>
          <tr v-if="!data.length">
            <td colspan="9" class="py-6 text-center text-gray-500">
              <i class="far fa-circle-xmark text-4xl text-green-600"></i>
              <div class="mt-4">Ma'lumot topilmadi</div>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>

    <!-- Modal -->
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="O'chirish"
      :content="`''${deleteitemtext}'' element o'chirilsinmi ?`"
      positive-text="O'chirish"
      negative-text="Bekor qilish"
      @positive-click="submitCallback"
      @negative-click="cancelCallback"
    />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { ref, onMounted } from "vue";
import countdown from "./component/countdown.vue";
import url from "../../base";

const router = useRouter();
const message = useMessage();

let data = ref([]);
let showModal = ref(false);
let deleteitemtext = ref("");
let deleteitem = ref(null);

let callbackend = async function () {
  const token = localStorage.token;

  let backend = await fetch(`${url}notification`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "-x-token": token,
    },
  });
  if (backend.status == 200) {
    backend = await backend.json();
    data.value = backend;
  }
  if (backend.status == 401) router.push("/login");
};

onMounted(async () => {
  callbackend();
});

async function change_active(obj) {
  let token = localStorage.token;
  try {
    let backend = await fetch(`${url}calendar/active`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "-x-token": token,
      },
      body: JSON.stringify(obj),
    });
    if (backend.status == 200) {
      message.success("Ma'lumot o'zgartirildi");
      router.go(0);
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
}

const cancelCallback = async function () {};

const submitCallback = async function () {
  let token = localStorage.token;
  try {
    let backend = await fetch(`${url}calendar/delete/${deleteitem.value}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "-x-token": token,
      },
    });
    if (backend.status == 200) {
      message.success("Ma'lumot o'chirildi");
      router.go(0);
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
</script>

<style>
/* Custom scrollbar styling */
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