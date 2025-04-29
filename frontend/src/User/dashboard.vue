<template>
    <div class="bg-gray-200 overflow-hidden w-[100vw] h-[100vh]">
      <div class="w-full h-[50px] flex justify-between items-center bg-gray-900">
        <RouterLink to="/" class="text-white">
          <span
            class="me-5 flex justify-center w-[240px] block absolute text-white select-none text-[28px] flex items-center gap-1 top-[10px] left-[10px] font-semibold">
            <img src="/aileet.png" class="w-[40px]" alt="" />
            {{ 'Aileet' }}
          </span>
        </RouterLink>
  
        <div class="flex gap-3 items-center">
          <Ring />
          <n-dropdown disabled trigger="hover" :options="options_lang" @select="changeLang">
            <n-button>
              <img
                :src="toggle === 'uz'
                  ? '/1670868198_grizly-club-p-flag-uzbekistana-png-9.png'
                  : '/EM7LidKw8aA.jpg'"
                class="w-[25px]"
                alt=""
              />
            </n-button>
          </n-dropdown>
  
          <div class="h-full w-[200px] cursor-pointer me-4">
            <n-dropdown trigger="hover" :options="options" @select="handleSelect">
              <div class="h-full ps-3 flex items-center w-full border-s-[1px]">
                <img
                  v-if="data.profil_url"
                  :src="`${url}/${data.profil_url}`"
                  class="w-[40px] h-[40px] rounded-[50%]"
                  alt=""
                />
                <div class="flex flex-col">
                  <span class="text-white font-bold ps-3">{{ data.lastname }} {{ data.firstname }}</span>
                  <span class="text-white text-[12px] text-center">Admin</span>
                </div>
              </div>
            </n-dropdown>
          </div>
        </div>
      </div>
  
      <n-layout class="h-full" has-sider>
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          show-trigger
          :inverted="inverted"
          :collapsed="collapsed"
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <n-menu :inverted="inverted" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
        </n-layout-sider>
  
        <n-layout>
          <div class="p-3 pb-[100px]">
            <RouterView />
          </div>
        </n-layout>
      </n-layout>
    </div>
  </template>
  
  <script setup>
  import { ref, h, onMounted, watch } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  import { useMessage } from 'naive-ui';
  import { Dean } from '../../Pinia/index.js';
  import Ring from './component/ring.vue';
  import url from '../../base';
  
  const store = Dean();
  const router = useRouter();
  const message = useMessage();
  
  const data = ref({
    profil_url: '',
    lastname: '',
    firstname: ''
  });
  
  async function getProfil() {
    const status = await store.getProfil();
    if (status === 401) router.push('/login');
    data.value = store.profile;
  }
  
  onMounted(() => {
    getProfil();
  });
  
  const toggle = ref('uz');
  const options_lang = [
    { label: "O'zb", key: 'uz' },
    { label: 'En', key: 'en' }
  ];
  
  function changeLang(key) {
    localStorage.setItem('lang', key);
    toggle.value = key;
  }
  
  function renderIcon(className) {
    return () => h('i', { class: className });
  }
  
  const menuOptions = [
    {
      label: () =>
        h(RouterLink, { to: '/changepassword' }, { default: () => 'Parolni almashtirish' }),
      key: 'changepassword',
      icon: renderIcon('fas fa-lock')
    },
    {
      label: () =>
        h(RouterLink, { to: '/editprofil' }, { default: () => 'Profilni tahrirlash' }),
      key: 'editprofil',
      icon: renderIcon('fas fa-user-pen')
    },
    {
      label: () =>
        h(RouterLink, { to: '/login' }, { default: () => 'Tizimdan chiqish' }),
      key: 'logout',
      icon: renderIcon('fas fa-arrow-right-from-bracket')
    }
  ];
  
  const options = ref([
    {
      key: 'sign_out',
      type: 'render',
      render: () =>
        h(
          'div',
          {
            class:
              'ps-4 duration-700 flex items-center hover:bg-red-200 cursor-pointer border-t-[1px] border-solid'
          },
          [
            h('span', {
              innerHTML:
                '<span class="text-[20px] text-red-800"><i class="fas fa-arrow-right-from-bracket"></i></span>'
            }),
            h('div', { class: 'text-red-800 ps-3' }, { default: () => 'Tizimdan chiqish' })
          ]
        ),
      props: {
        onClick: async () => {
          try {
            const response = await fetch(`${url}admin/logout`, {
              method: 'POST',
              credentials: 'include'
            });
            if (response.ok) {
              router.push('/login');
            } else {
              console.error('Logout failed:', await response.text());
            }
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
      }
    }
  ]);
  
  const collapsed = ref(localStorage.collapsed === 'true');
  watch(collapsed, (val) => {
    localStorage.setItem('collapsed', val ? 'true' : 'false');
  });
  
  const inverted = ref(true);
  </script>
  
  <style scoped>
  .material-symbols-outlined {
    font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 24;
  }
  
  ::-webkit-scrollbar-track {
    border: 1px solid white;
    background-color: #b2bec3;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    background-color: #dfe6e9;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: rgb(0, 20, 40);
    border-radius: 5px;
  }
  </style>
  