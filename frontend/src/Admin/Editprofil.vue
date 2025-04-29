<template>
    <div class="max-w-4xl mx-auto mt-10 p-6 bg-white border rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-blue-700 mb-6">Profilni tahrirlash</h2>
  
      <form @submit.prevent="submit(formRef)" class="space-y-6">
        <!-- Email -->
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex flex-col w-full">
            <label for="email" class="font-semibold text-gray-700 mb-2">Email:</label>
            <n-input
              id="email"
              placeholder="Emailni kiriting"
              maxlength="45"
              clearable
              v-model:value="formRef.email"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <!-- First Name -->
          <div class="flex flex-col w-full">
            <label for="firstname" class="font-semibold text-gray-700 mb-2">Ismi:</label>
            <n-input
              id="firstname"
              placeholder="Ismni kiriting"
              maxlength="15"
              clearable
              v-model:value="formRef.firstname"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <!-- Last Name and Birthday -->
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex flex-col w-full">
            <label for="lastname" class="font-semibold text-gray-700 mb-2">Familiyasi:</label>
            <n-input
              id="lastname"
              placeholder="Familiyani kiriting"
              maxlength="15"
              clearable
              v-model:value="formRef.lastname"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div class="flex flex-col w-full">
            <label for="birthday" class="font-semibold text-gray-700 mb-2">Tug'ilgan kuni:</label>
            <n-date-picker
              id="birthday"
              v-model:value="formRef.brithday"
              type="date"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <!-- Parent Name and Address -->
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex flex-col w-full">
            <label for="parentName" class="font-semibold text-gray-700 mb-2">Otasining ismi:</label>
            <n-input
              id="parentName"
              placeholder="Otasining ismini kiriting"
              maxlength="15"
              clearable
              v-model:value="formRef.Parent_Name"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div class="flex flex-col w-full">
            <label for="address" class="font-semibold text-gray-700 mb-2">Uy manzili:</label>
            <n-input
              id="address"
              placeholder="Uy manzilini kiriting"
              maxlength="45"
              clearable
              v-model:value="formRef.address"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <!-- Submit Button -->
        <div class="flex justify-end">
          <n-button
            type="primary"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition"
            @click="submit(formRef)"
          >
            Saqlash
          </n-button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useMessage } from "naive-ui";
  import url from "../../base";
  import { Dean } from "../../Pinia/index.js";
  
  let store = Dean();
  
  const formRef = ref({
    email: ref(null),
    firstname: ref(null),
    lastname: ref(null),
    brithday: ref(1723894439972),
    address: ref(null),
    Parent_Name: ref(null),
  });
  
  const message = useMessage();
  
  onMounted(async () => {
    await store.getProfil();
    formRef.value.email = store.profile.email;
    formRef.value.firstname = store.profile.firstname;
    formRef.value.lastname = store.profile.lastname;
    formRef.value.address = store.profile.address;
    formRef.value.Parent_Name = store.profile.parent_name;
    formRef.value.brithday = new Date(store.profile.brithday).getTime();
  });
  
  async function submit(e) {
    let body = {};
    let token = localStorage.token;
    for (let i in e) {
      if (!e[i]) return message.info(`${i} ni kiriting`);
      body[i] = e[i];
    }
  
    let date = new Date(body.brithday);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
  
    body.brithday = `${year}-${month}-${day}`;
  
    let backend = await fetch(`${url}admin/changeProfil`, {
      method: "POST",
      headers: {
        "-x-token": token,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    });
    if (backend.status == 200) {
      store.getProfil();
      return message.success("O'zgartirildi");
    }
    if (backend.status == 401) return (window.location.href = "/dean/login");
  
    if (backend.status == 400) {
      backend = await backend.json();
      message.error(backend.error);
    }
  }
  </script>