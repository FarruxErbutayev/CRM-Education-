<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h2 class="text-2xl font-bold text-center text-blue-700 dark:text-blue-300 mb-8">
          Parolni almashtirish
        </h2>
  
        <div class="space-y-6">
          <!-- Eski parol -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Eski parol</label>
            <n-input
              type="password"
              show-password-on="mousedown"
              placeholder="Eski parol"
              :maxlength="18"
              v-model:value="oldpassword"
            />
          </div>
  
          <!-- Yangi parol -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Yangi parol</label>
            <n-input
              type="password"
              show-password-on="mousedown"
              placeholder="Yangi parol"
              :maxlength="18"
              v-model:value="newpassword"
            />
          </div>
  
          <!-- Yangi parol (qayta) -->
          <div>
            <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">Yangi parol (qayta)</label>
            <n-input
              type="password"
              show-password-on="mousedown"
              placeholder="Parolni qayta kiriting"
              :maxlength="18"
              v-model:value="confirmpassword"
            />
          </div>
        </div>
  
        <!-- Submit tugmasi -->
        <div class="flex justify-end mt-8">
          <n-button
            class="rounded-lg px-6 py-2 hover:bg-blue-600 transition"
            type="primary"
            @click="submit({ oldpassword, newpassword, confirmpassword })"
          >
            O'zgartirish
          </n-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import url from "../../base";
  import { useRouter } from "vue-router";
  import { useMessage } from "naive-ui";
  import { ref } from "vue";
  
  const router = useRouter();
  const message = useMessage();
  
  let oldpassword = ref("");
  let newpassword = ref("");
  let confirmpassword = ref("");
  
  const submit = async (obj) => {
    try {
      let token = localStorage.token;
      let backend = await fetch(`${url}admin/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "-x-token": token,
        },
        body: JSON.stringify(obj),
      });
  
      if (backend.status === 400) {
        backend = await backend.json();
        message.error(backend.error);
        return;
      }
  
      if (backend.status === 401) {
        router.push("/login");
        return;
      }
  
      if (backend.status === 201) {
        oldpassword.value = "";
        newpassword.value = "";
        confirmpassword.value = "";
        message.success("Parol almashtirildi");
      }
    } catch (error) {
      message.error("Tizimda xatolik yuz berdi");
    }
  };
  </script>
  