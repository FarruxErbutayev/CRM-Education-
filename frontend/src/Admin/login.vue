<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <div class="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
      <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div>
          <img
            src="/aileet.png"
            class="w-32 mx-auto" />
            <div class="flex justify-center w-full font-bold">
              
            <n-gradient-text :size="24"  type="success">
    Aileet
  </n-gradient-text>
            </div>
        </div>
        <div class="mt-12 flex flex-col items-center">
          <h1 class="text-2xl xl:text-3xl font-extrabold">
            Tizimga kirish
          </h1>
          <div class="w-full   flex-1 mt-14">
            <div class="flex justify-center flex-col items-center">

            </div>


            <div class="mx-auto max-w-xs">
              <form @submit.prevent="loginfunc" method="post">
                <n-input type="text" size="large" placeholder="Email" v-model:value="login"
                  class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" />

                <n-input v-model:value="password"
                  class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password" show-password-on="mousedown" placeholder="Password" :maxlength="18" />

                <button type="submit" :disabled = 'disabled ? true:false'
                :class = "disabled ?'bg-teal-200 animate-bounce hover:bg-teal-200':''"
                  class="mt-5 tracking-wide font-semibold bg-teal-500 text-gray-100 w-full py-4 rounded-lg hover:bg-teal-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <span class="ml-3">
                    <span v-if="disabled">
                      <i class="fas fa-rotate animate-spin"></i>
                      
                    </span>
                    <span class="flex gap-4  items-center" v-else>
                      Kirish
                      
                      <i class="fas fa-right-to-bracket"></i>
                    </span>
                  </span>
                </button>
                <p class="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by templatana's
                  <a href="#" class="border-b border-gray-500 border-dotted">
                    Terms of Service
                  </a>
                  and its
                  <a href="#" class="border-b border-gray-500 border-dotted">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-indigo-100 text-center hidden lg:flex">
        <div
          class="m-12 xl:m-16 w-full bg-[url('/15848031292911696601-undraw_designer_life_w96d.svg')] bg-contain bg-center bg-no-repeat">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import url from "../../base/index"


import { ref } from 'vue';
import { useMessage } from "naive-ui"
import { RouterView } from 'vue-router';
import { useRouter } from "vue-router";
import { Dean } from "../../Pinia/index.js";

const message = useMessage();
const disabled = ref(false)
const router = useRouter();
const login = ref(null);
const password = ref(null);
async function loginfunc() {

  if (!password.value && !password.value)
    return message.warning("Formani to'ldiring")
  if (password.value.length < 3 && login.value.length < 3)
    return message.warning("3 ta belgidan ko'p bo'lishi lozim")
    disabled.value = true;

  login.value = login.value.trim();
  password.value = password.value.trim();
  try {
    let backend = await fetch(`${url}admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        login: login.value,
        password: password.value
      })
    });
    // console.log("bc", backend)
    if (backend.status == 200) {
      backend = await backend.json();
      localStorage.setItem('token', backend.token);
      let store = Dean();
// await store.getProfil();
(async()=>{await store.getProfil();})()

      router.push("/");
      login.value = '';
      password.value = '';
      
    }
    else {
      disabled.value = false;
      message.error("Login yoki parol xato");
      login.value = '';
      password.value = '';
      return;
    }
  } catch (error) {
    
  }

}
</script>