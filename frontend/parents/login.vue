<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar (mobile menu) -->
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    <div v-show="sidebarOpen" class="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
      <!--
        Off-canvas menu overlay, show/hide based on off-canvas menu state.
        Entering: "transition-opacity ease-linear duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "transition-opacity ease-linear duration-300"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div
        v-show="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300"
        :class="{ 'opacity-100': sidebarOpen, 'opacity-0': !sidebarOpen }"
        aria-hidden="true"
      ></div>

      <!--
        Off-canvas menu, show/hide based on off-canvas menu state.
        Entering: "transition ease-in-out duration-300 transform"
          From: "-translate-x-full"
          To: "translate-x-0"
        Leaving: "transition ease-in-out duration-300 transform"
          From: "translate-x-0"
          To: "-translate-x-full"
      -->
      <div
        v-show="sidebarOpen"
        class="relative flex flex-col flex-1 w-full max-w-xs bg-emerald-700 transition ease-in-out duration-300 transform"
        :class="{ 'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen }"
      >
        <!-- Close button -->
        <div class="absolute top-0 right-0 pt-2 -mr-12">
          <button
            type="button"
            class="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            @click="sidebarOpen = false"
          >
            <span class="sr-only">Yopish</span>
            <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <img class="w-auto h-8" src="https://tailwindui.com/img/logos/workflow-logo-emerald-500-mark-white-text.svg" alt="O'quv markaz" />
          </div>
          <nav class="px-2 mt-5 space-y-1">
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              :class="[
                item.current ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-600 hover:bg-opacity-75',
                'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150',
              ]"
              @click.prevent="setActiveSection(item.id)"
            >
              <svg
                :class="[
                  item.current ? 'text-emerald-300' : 'text-emerald-400 group-hover:text-emerald-300',
                  'mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-150',
                ]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                v-html="item.icon"
              ></svg>
              {{ item.name }}
            </a>
          </nav>
        </div>
        <!-- User Profile Area -->
        <div class="flex flex-shrink-0 p-4 border-t border-emerald-800">
          <div class="flex items-center flex-shrink-0 w-full group">
            <img class="inline-block w-10 h-10 rounded-full" :src="user.imageUrl" alt="" />
            <div class="ml-3">
              <p class="text-base font-medium text-white">{{ user.name }}</p>
              <p class="text-sm font-medium text-emerald-200 group-hover:text-emerald-100">
                Ota-ona
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-shrink-0 w-14" aria-hidden="true">
        <!-- Force sidebar to shrink to fit close icon -->
      </div>
    </div>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div class="flex flex-col flex-1 min-h-0 bg-emerald-700">
        <div class="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <img class="w-auto h-8" src="https://tailwindui.com/img/logos/workflow-logo-emerald-500-mark-white-text.svg" alt="O'quv markaz" />
          </div>
          <nav class="flex-1 px-2 mt-5 space-y-1">
             <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              :class="[
                item.current ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-600 hover:bg-opacity-75',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150', // Adjusted text size to sm
              ]"
              @click.prevent="setActiveSection(item.id)"
            >
              <svg
                :class="[
                  item.current ? 'text-emerald-300' : 'text-emerald-400 group-hover:text-emerald-300',
                  'mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-150', // Adjusted margin to mr-3
                ]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                v-html="item.icon"
              ></svg>
              {{ item.name }}
            </a>
          </nav>
        </div>
         <!-- User Profile Area -->
        <div class="flex flex-shrink-0 p-4 border-t border-emerald-800">
          <div class="flex items-center flex-shrink-0 w-full group">
            <img class="inline-block w-9 h-9 rounded-full" :src="user.imageUrl" alt="" />
            <div class="ml-3">
              <p class="text-sm font-medium text-white">{{ user.name }}</p>
               <p class="text-xs font-medium text-emerald-200 group-hover:text-emerald-100">
                 Ota-ona
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 md:pl-64">
       <!-- Mobile Header -->
      <div class="sticky top-0 z-10 flex items-center h-16 bg-white border-b border-gray-200 md:hidden">
        <button
          type="button"
          class="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 md:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Menyuni ochish</span>
          <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
         <!-- Header Content (shared between mobile and desktop, but positioned differently) -->
        <div class="flex justify-end flex-1 px-4 sm:px-6 md:px-8">
             <div class="flex items-center space-x-4">
                <!-- Notifications dropdown -->
                <div class="relative">
                  <button
                    id="notifications-button"
                    @click="toggleNotifications"
                    @keydown.escape="notificationsOpen = false"
                    class="relative p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    aria-label="Bildirishnomalar" aria-haspopup="true" :aria-expanded="notificationsOpen"
                  >
                    <span class="sr-only">Bildirishnomalar</span>
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span v-if="unreadNotificationsCount > 0" class="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                       {{ unreadNotificationsCount }}
                    </span>
                  </button>

                  <!-- Notifications panel -->
                  <transition
                      enter-active-class="transition duration-100 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                    <div
                      v-if="notificationsOpen"
                      class="absolute right-0 z-20 w-80 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="notifications-button">
                         <div class="px-4 pt-2 pb-1">
                             <h3 class="text-sm font-medium text-gray-900">Bildirishnomalar</h3>
                         </div>
                        <div v-if="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500">
                          Hozircha bildirishnomalar yo'q
                        </div>
                        <div v-else class="max-h-60 overflow-y-auto">
                           <a
                             v-for="notification in notifications"
                             :key="notification.id"
                             href="#"
                             class="block px-4 py-3 text-sm text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100"
                             role="menuitem"
                           >
                             <div class="flex items-start space-x-3">
                               <div class="flex-shrink-0 pt-0.5">
                                 <span
                                   :class="[
                                     'inline-block w-2 h-2 rounded-full',
                                     notification.read ? 'bg-gray-300' : 'bg-emerald-500'
                                   ]"
                                   aria-hidden="true"
                                 ></span>
                               </div>
                               <div class="flex-1">
                                 <p :class="['font-medium', { 'text-gray-900': !notification.read, 'text-gray-600': notification.read }]">
                                     {{ notification.title }}
                                 </p>
                                 <p class="text-xs text-gray-500">{{ notification.time }}</p>
                               </div>
                             </div>
                           </a>
                        </div>
                        <div class="border-t border-gray-100" v-if="notifications.length > 0">
                          <a href="#" class="block px-4 py-2 text-sm font-medium text-center text-emerald-600 transition duration-150 ease-in-out hover:text-emerald-500 hover:bg-gray-50" role="menuitem">
                            Barcha bildirishnomalarni ko'rish
                          </a>
                        </div>
                      </div>
                    </div>
                   </transition>
                </div>

                <!-- Profile dropdown -->
                <div class="relative">
                   <div>
                      <button
                        @click="toggleProfile"
                        @keydown.escape="profileOpen = false"
                        type="button"
                        class="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        id="user-menu-button" :aria-expanded="profileOpen" aria-haspopup="true"
                      >
                        <span class="sr-only">Profilni ochish</span>
                        <img class="w-8 h-8 rounded-full" :src="user.imageUrl" alt="Foydalanuvchi profili rasmi" />
                      </button>
                   </div>
                  <!-- Profile panel -->
                   <transition
                      enter-active-class="transition duration-100 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                    <div
                      v-if="profileOpen"
                      class="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                       role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1"
                    >
                      <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabindex="-1">Profil</a>
                      <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabindex="-1">Sozlamalar</a>
                      <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabindex="-1">Chiqish</a>
                    </div>
                  </transition>
                </div>
              </div>
        </div>
      </div>

      <main class="flex-1">
        <div class="py-6">
           <!-- Page Header -->
          <div class="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            <div class="pb-5 border-b border-gray-200">
              <h1 class="text-2xl font-semibold leading-tight text-gray-900">{{ activeSection.title }}</h1>
              <!-- Desktop Header Actions - Placed here for context but handled above -->
            </div>
          </div>

          <!-- Page Content -->
          <div class="px-4 mx-auto max-w-7xl sm:px-6 md:px-8 mt-6">
            <!-- Dashboard section -->
            <div v-if="activeSection.id === 'dashboard'" class="space-y-8">
              <!-- Children overview section -->
              <div>
                <h2 class="text-lg font-medium leading-6 text-gray-900">Farzandlaringiz</h2>
                <div class="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                  <!-- Child Card -->
                  <div
                    v-for="child in children"
                    :key="child.id"
                    class="overflow-hidden bg-white rounded-lg shadow transition hover:shadow-md"
                  >
                    <div class="p-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <img class="w-12 h-12 rounded-full" :src="child.imageUrl" :alt="`${child.name} profil rasmi`" />
                        </div>
                        <div class="flex-1 w-0 ml-5">
                          <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                              {{ child.name }}
                            </dt>
                            <dd class="mt-0.5">
                              <div class="text-lg font-medium text-gray-900">
                                {{ child.course }}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div class="px-5 py-3 bg-gray-50">
                      <div class="text-sm">
                        <a href="#" class="font-medium text-emerald-700 transition hover:text-emerald-900">
                          Batafsil ko'rish
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent activities section -->
              <div>
                <h2 class="text-lg font-medium leading-6 text-gray-900">So'nggi faoliyatlar</h2>
                <div class="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                  <ul role="list" class="divide-y divide-gray-200">
                    <li v-for="activity in activities" :key="activity.id" class="px-6 py-4">
                      <div class="flex space-x-3">
                        <img class="flex-shrink-0 w-6 h-6 rounded-full" :src="activity.childImageUrl" :alt="`${activity.childName} rasmi`" />
                        <div class="flex-1 min-w-0 space-y-1">
                          <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium text-gray-900">{{ activity.childName }}</h3>
                            <p class="text-sm text-gray-500 whitespace-nowrap">{{ activity.time }}</p>
                          </div>
                          <p class="text-sm text-gray-500">
                            {{ activity.description }}
                          </p>
                        </div>
                      </div>
                    </li>
                     <li v-if="!activities.length" class="px-6 py-4 text-sm text-center text-gray-500">
                        Faoliyatlar mavjud emas.
                     </li>
                  </ul>
                   <div class="px-6 py-3 bg-gray-50" v-if="activities.length">
                     <a
                       href="#"
                       class="text-sm font-medium text-center text-emerald-600 transition hover:text-emerald-500 block"
                     >
                       Ko'proq ko'rish
                     </a>
                   </div>
                </div>
              </div>

              <!-- Grid: Upcoming events & Quick stats -->
              <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <!-- Upcoming events section -->
                <div>
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-medium leading-6 text-gray-900">Kelgusi tadbirlar</h2>
                    <a href="#" class="text-sm font-medium text-emerald-600 transition hover:text-emerald-500">
                      Barcha tadbirlar
                    </a>
                  </div>
                  <div class="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                    <ul role="list" class="divide-y divide-gray-200">
                      <li v-for="event in events" :key="event.id" class="px-6 py-4">
                        <div class="flex items-center space-x-4">
                          <div class="flex-shrink-0">
                            <div class="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-md">
                              <svg class="w-6 h-6 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">
                              {{ event.title }}
                            </p>
                            <p class="text-sm text-gray-500 truncate">
                              {{ event.date }} - {{ event.time }}
                            </p>
                          </div>
                          <div>
                            <a href="#" class="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-emerald-700 bg-emerald-100 transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                              Eslatma
                            </a>
                          </div>
                        </div>
                      </li>
                      <li v-if="!events.length" class="px-6 py-4 text-sm text-center text-gray-500">
                         Kelgusi tadbirlar mavjud emas.
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Quick stats section -->
                <div>
                  <h2 class="text-lg font-medium leading-6 text-gray-900">Tezkor statistika</h2>
                  <div class="grid grid-cols-1 gap-5 mt-4 sm:grid-cols-2">
                    <div
                      v-for="stat in stats"
                      :key="stat.name"
                      class="px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:p-6 transition hover:shadow-md"
                    >
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        {{ stat.name }}
                      </dt>
                      <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {{ stat.value }}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Attendance section -->
            <div v-if="activeSection.id === 'attendance'" class="space-y-8">
              <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h2 class="text-lg font-medium leading-6 text-gray-900">Davomat</h2>
                  <p class="mt-1 text-sm text-gray-500">
                    Farzandlaringizning o'quv markazdagi davomati haqida ma'lumot.
                  </p>
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-4">
                  <label for="child-select-attendance" class="sr-only">Farzandni tanlang</label>
                  <select
                    id="child-select-attendance"
                    v-model="selectedChild"
                    class="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  >
                    <option value="">Barcha farzandlar</option>
                    <option v-for="child in children" :key="child.id" :value="child.id">
                      {{ child.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Calendar view -->
              <div class="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">
                    Aprel, 2023 (Namuna)
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">Haftalik davomat ko'rinishi</p>
                </div>
                <div class="border-t border-gray-200">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-300">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Farzand
                          </th>
                          <th
                            v-for="day in ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']"
                            :key="day"
                            scope="col"
                            class="px-3 py-3.5 w-16 text-center text-sm font-semibold text-gray-900"
                          >
                            {{ day }}
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="child in filteredChildren" :key="child.id">
                          <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                            {{ child.name }}
                          </td>
                          <td
                            v-for="(status, index) in child.attendance"
                            :key="index"
                            class="px-3 py-4 text-sm text-center whitespace-nowrap"
                          >
                            <span v-if="status !== 'none'"
                              :class="[
                                'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold',
                                { 'bg-green-100 text-green-800': status === 'present' },
                                { 'bg-red-100 text-red-800': status === 'absent' },
                                { 'bg-yellow-100 text-yellow-800': status === 'late' },
                              ]"
                              :title="status === 'present' ? 'Qatnashdi' : status === 'absent' ? 'Qatnashmadi' : status === 'late' ? 'Kechikdi' : ''"
                            >
                              <span v-if="status === 'present'">✓</span>
                              <span v-else-if="status === 'absent'">✗</span>
                              <span v-else-if="status === 'late'">K</span>
                            </span>
                             <span v-else class="text-gray-400">-</span>
                          </td>
                        </tr>
                         <tr v-if="!filteredChildren.length">
                             <td colspan="8" class="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                                Tanlangan farzand uchun ma'lumot topilmadi yoki farzand tanlanmagan.
                             </td>
                         </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Attendance summary -->
              <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">
                    Davomat statistikasi (Umumiy)
                  </h3>
                </div>
                <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl class="sm:divide-y sm:divide-gray-200">
                    <div v-for="child in filteredChildren" :key="`stats-${child.id}`" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">{{ child.name }}</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <div class="flex items-center">
                            <span class="inline-block w-3 h-3 mr-1.5 bg-green-500 rounded-full" aria-hidden="true"></span>
                            <span>Qatnashgan: {{ child.attendanceSummary.present }}%</span>
                          </div>
                          <div class="flex items-center">
                            <span class="inline-block w-3 h-3 mr-1.5 bg-red-500 rounded-full" aria-hidden="true"></span>
                            <span>Qatnashmagan: {{ child.attendanceSummary.absent }}%</span>
                          </div>
                          <div class="flex items-center">
                            <span class="inline-block w-3 h-3 mr-1.5 bg-yellow-500 rounded-full" aria-hidden="true"></span>
                            <span>Kechikkan: {{ child.attendanceSummary.late }}%</span>
                          </div>
                        </div>
                      </dd>
                    </div>
                     <div v-if="!filteredChildren.length" class="py-4 sm:py-5 sm:px-6 text-sm text-center text-gray-500">
                        Statistika uchun farzand tanlanmagan.
                     </div>
                  </dl>
                </div>
              </div>
            </div>

            <!-- Payments section -->
            <div v-if="activeSection.id === 'payments'" class="space-y-8">
              <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h2 class="text-lg font-medium leading-6 text-gray-900">To'lovlar</h2>
                  <p class="mt-1 text-sm text-gray-500">
                    To'lovlar tarixi va kelgusi to'lovlar haqida ma'lumot.
                  </p>
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-4">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
                  >
                    To'lov qilish
                  </button>
                </div>
              </div>

              <!-- Upcoming payments -->
              <div class="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">
                    Kelgusi to'lovlar
                  </h3>
                </div>
                <div class="border-t border-gray-200">
                   <div class="overflow-x-auto">
                     <table class="min-w-full divide-y divide-gray-300">
                       <thead class="bg-gray-50">
                         <tr>
                           <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Farzand</th>
                           <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kurs</th>
                           <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Summa</th>
                           <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Muddati</th>
                           <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Holati</th>
                           <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Amallar</span></th>
                         </tr>
                       </thead>
                       <tbody class="divide-y divide-gray-200 bg-white">
                         <tr v-for="payment in upcomingPayments" :key="payment.id">
                           <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{{ payment.childName }}</td>
                           <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ payment.course }}</td>
                           <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ payment.amount }} so'm</td>
                           <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ payment.dueDate }}</td>
                           <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                             <span :class="['inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                               { 'bg-yellow-100 text-yellow-800': payment.status === 'pending' },
                               { 'bg-red-100 text-red-800': payment.status === 'overdue' },
                               { 'bg-green-100 text-green-800': payment.status === 'paid' } // Assuming 'paid' exists
                             ]">
                               {{ payment.status === 'pending' ? 'Kutilmoqda' : payment.status === 'overdue' ? 'Muddati o\'tgan' : 'To\'langan' }}
                             </span>
                           </td>
                           <td class="relative py-4 pl-3 pr-4 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                             <a href="#" class="text-emerald-600 transition hover:text-emerald-900">To'lash<span class="sr-only">, {{ payment.childName }}</span></a>
                           </td>
                         </tr>
                          <tr v-if="!upcomingPayments.length">
                              <td colspan="6" class="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                                 Kelgusi to'lovlar mavjud emas.
                              </td>
                          </tr>
                       </tbody>
                     </table>
                   </div>
                </div>
              </div>

              <!-- Payment history -->
              <div class="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">
                    To'lovlar tarixi
                  </h3>
                </div>
                <div class="border-t border-gray-200">
                   <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                          <tr>
                            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Farzand</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kurs</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Summa</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">To'lov sanasi</th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">To'lov usuli</th>
                            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Amallar</span></th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                          <tr v-for="payment in paymentHistory" :key="payment.id">
                            <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{{ payment.childName }}</td>
                            <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ payment.course }}</td>
                            <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ payment.amount }} so'm</td>
                            <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ payment.date }}</td>
                            <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{{ payment.method }}</td>
                            <td class="relative py-4 pl-3 pr-4 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                              <a href="#" class="text-emerald-600 transition hover:text-emerald-900">Kvitansiya<span class="sr-only">, {{ payment.childName }}</span></a>
                            </td>
                          </tr>
                           <tr v-if="!paymentHistory.length">
                               <td colspan="6" class="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                                  To'lovlar tarixi mavjud emas.
                               </td>
                           </tr>
                        </tbody>
                      </table>
                   </div>
                </div>
              </div>
            </div>

            <!-- Communication section -->
            <div v-if="activeSection.id === 'communication'" class="space-y-8">
              <div>
                <h2 class="text-lg font-medium leading-6 text-gray-900">Aloqa</h2>
                <p class="mt-1 text-sm text-gray-500">
                  O'quv markaz o'qituvchilari va ma'muriyati bilan bog'lanish uchun ma'lumotlar.
                </p>
              </div>

              <!-- Contact cards -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="contact in contacts" :key="contact.email" class="overflow-hidden bg-white rounded-lg shadow transition hover:shadow-md">
                    <div class="p-5">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <img class="object-cover w-12 h-12 rounded-full" :src="contact.imageUrl" :alt="`${contact.name} profil rasmi`" />
                        </div>
                        <div class="flex-1 min-w-0 ml-4">
                          <h3 class="text-sm font-medium text-gray-900 truncate">{{ contact.name }}</h3>
                          <p class="text-sm text-gray-500 truncate">{{ contact.role }}</p>
                        </div>
                      </div>
                      <div class="mt-4 space-y-2">
                        <div class="flex items-center">
                           <svg class="flex-shrink-0 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                           </svg>
                          <span class="ml-2 text-sm text-gray-500 truncate">{{ contact.phone }}</span>
                        </div>
                        <div class="flex items-center">
                          <svg class="flex-shrink-0 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                            <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                          </svg>
                          <span class="ml-2 text-sm text-gray-500 truncate">{{ contact.email }}</span>
                        </div>
                      </div>
                      <div class="flex mt-5 space-x-3">
                        <button type="button" class="inline-flex items-center justify-center flex-1 w-0 px-3 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                           <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                             <path fill-rule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.411-.993 2.67-2.43 2.902a41.102 41.102 0 01-6.57.524c-2.236 0-4.43-.18-6.57-.524-1.437-.231-2.43-1.49-2.43-2.902V5.426c0-1.411.993-2.67 2.43-2.902zM9 8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1zM6 8a1 1 0 00-1 1v.01a1 1 0 102 0V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                             <path d="M2 15.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 15.25z" />
                           </svg>
                          Xabar
                        </button>
                        <button type="button" class="inline-flex items-center justify-center flex-1 w-0 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 border border-transparent rounded-md transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                           <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                           </svg>
                          Qo'ng'iroq
                        </button>
                      </div>
                    </div>
                 </div>
              </div>

              <!-- Message form -->
              <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">
                    Xabar yuborish
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    Savol yoki takliflaringiz bo'lsa, ma'muriyatga yuborishingiz mumkin.
                  </p>
                </div>
                <div class="border-t border-gray-200">
                  <form class="px-4 py-5 space-y-6 sm:p-6" @submit.prevent="sendMessage">
                    <div>
                      <label for="subject" class="block text-sm font-medium text-gray-700">Mavzu</label>
                      <div class="mt-1">
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          placeholder="Xabar mavzusi"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label for="message" class="block text-sm font-medium text-gray-700">Xabar matni</label>
                      <div class="mt-1">
                        <textarea
                          id="message"
                          name="message"
                          rows="4"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                          placeholder="Xabar matnini shu yerga kiriting..."
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div class="flex justify-end">
                      <button
                        type="submit"
                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        Yuborish
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

             <!-- Placeholder for other sections (Children, Courses, Events, Settings) -->
             <div v-if="['children', 'courses', 'events', 'settings'].includes(activeSection.id)">
                <div class="p-8 text-center bg-white rounded-lg shadow">
                  <h3 class="text-lg font-medium text-gray-900">{{ activeSection.title }}</h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Bu bo'lim hozircha ishlab chiqilmoqda. Tez orada qo'shiladi!
                  </p>
                   <svg class="w-16 h-16 mx-auto mt-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.75 3.75 0 00-5.304-5.304L2.25 11.42m9.172 3.75a3.75 3.75 0 01-5.304-5.304L8.828 12.828m4.832 2.472l2.472-2.472M12.828 8.828l5.304 5.304m-5.304-5.304L8.828 12.828m4.832 2.472l-2.472 2.472M12.828 12.828l5.304-5.304m-5.304 5.304L8.828 8.828" />
                   </svg>
                </div>
             </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    const sidebarOpen = ref(false);
    const notificationsOpen = ref(false);
    const profileOpen = ref(false);
    const selectedChild = ref('');

    const user = ref({
      name: 'Azizov Akbar',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });

    const navigation = ref([
      { id: 'dashboard', name: 'Boshqaruv paneli', href: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />', current: true },
      // { id: 'children', name: 'Farzandlar', href: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />', current: false },
      // { id: 'courses', name: 'Kurslar', href: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />', current: false },
      { id: 'attendance', name: 'Davomat', href: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />', current: false },
      { id: 'payments', name: 'To\'lovlar', href: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 10.5l-1.5-1.5m0 0l-1.5 1.5m1.5-1.5V15m1.5 1.5l-1.5-1.5m0 0l1.5-1.5m-1.5 1.5V18m1.5-7.5l-1.5-1.5m0 0l-1.5 1.5m1.5-1.5V9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008zm0-9.75h.008v.008H12V7.5z" />', current: false }, // Updated icon for payments
      { id: 'communication', name: 'Aloqa', href: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-2.138a1.125 1.125 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />', current: false },
      // { id: 'events', name: 'Tadbirlar', href: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />', current: false },
      // { id: 'settings', name: 'Sozlamalar', href: '#', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.184-.582.496-.646.87l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.646-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-1.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.184.582-.496.646-.87l.213-1.28z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />', current: false }
    ]);

    const activeSection = computed(() => {
        const currentNav = navigation.value.find(item => item.current);
        return currentNav ? { id: currentNav.id, title: currentNav.name } : { id: 'dashboard', title: 'Boshqaruv paneli' };
    });

    const children = ref([
       { id: 1, name: 'Azizov Jasur', course: 'Ingliz tili (Advanced)', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80', attendance: ['present', 'present', 'absent', 'present', 'late', 'none', 'none'], attendanceSummary: { present: 75, absent: 15, late: 10 } },
       { id: 2, name: 'Azizova Nilufar', course: 'Matematika (Olimpiada)', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80', attendance: ['present', 'present', 'present', 'present', 'present', 'none', 'none'], attendanceSummary: { present: 95, absent: 0, late: 5 } },
       { id: 3, name: 'Azizov Sardor', course: 'Robototexnika', imageUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80', attendance: ['present', 'absent', 'present', 'late', 'present', 'none', 'none'], attendanceSummary: { present: 80, absent: 10, late: 10 } }
    ]);

    const notifications = ref([
      { id: 1, title: 'Jasur bugun ingliz tili darsida faol qatnashdi', time: 'Bugun, 14:30', read: false },
      { id: 2, title: 'Nilufar matematika olimpiadasiga tayyorlanmoqda', time: 'Kecha, 10:15', read: false },
      { id: 3, title: 'Sardor robototexnika bo\'yicha yangi loyihani boshladi', time: '2 kun oldin', read: true }
    ]);

     const unreadNotificationsCount = computed(() => {
        return notifications.value.filter(n => !n.read).length;
     });


    const activities = ref([
      { id: 1, childName: 'Jasur', childImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=1&w=48&h=48&q=80', description: 'Ingliz tili darsida yangi mavzuni a\'lo darajada o\'zlashtirdi', time: 'Bugun, 14:30' },
      { id: 2, childName: 'Nilufar', childImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=1&w=48&h=48&q=80', description: 'Matematika olimpiadasi uchun qo\'shimcha mashg\'ulotga yozildi', time: 'Kecha, 11:45' },
      { id: 3, childName: 'Sardor', childImageUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=1&w=48&h=48&q=80', description: 'Robototexnika darsida yangi robot modelini yig\'ishni boshladi', time: '2 kun oldin' }
    ]);

    const events = ref([
      { id: 1, title: 'Ota-onalar bilan uchrashuv', date: '15-Aprel, 2023', time: '18:00' },
      { id: 2, title: 'O\'quv markaz taqdimoti', date: '20-Aprel, 2023', time: '10:00' },
      { id: 3, title: 'Ochiq dars kuni', date: '25-Aprel, 2023', time: '09:00' }
    ]);

    const stats = ref([
      { name: 'O\'rtacha baho', value: '4.7' },
      { name: 'Davomat', value: '92%' },
      { name: 'Topshirilgan v.', value: '45/48' }, // Shortened for space
      { name: 'Faollik', value: 'Yuqori' }
    ]);

    const upcomingPayments = ref([
      { id: 1, childName: 'Azizov Jasur', course: 'Ingliz tili (Adv)', amount: '450,000', dueDate: '30-Apr-23', status: 'pending' },
      { id: 2, childName: 'Azizova Nilufar', course: 'Matematika (Olimp)', amount: '500,000', dueDate: '25-Apr-23', status: 'pending' },
      { id: 3, childName: 'Azizov Sardor', course: 'Robototexnika', amount: '600,000', dueDate: '15-Apr-23', status: 'overdue' }
    ]);

    const paymentHistory = ref([
      { id: 1, childName: 'Azizov Jasur', course: 'Ingliz tili (Adv)', amount: '450,000', date: '30-Mar-23', method: 'Payme' },
      { id: 2, childName: 'Azizova Nilufar', course: 'Matematika (Olimp)', amount: '500,000', date: '25-Mar-23', method: 'Click' },
      { id: 3, childName: 'Azizov Sardor', course: 'Robototexnika', amount: '600,000', date: '15-Mar-23', method: 'Naqd pul' }
    ]);

     const contacts = ref([
        { id: 1, name: 'Karimov Bobur', role: 'Ingliz tili o\'qituvchisi', phone: '+998 90 123 45 67', email: 'bobur@educentre.uz', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80' },
        { id: 2, name: 'Rahimova Sabina', role: 'Matematika o\'qituvchisi', phone: '+998 90 987 65 43', email: 'sabina@educentre.uz', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80' },
        { id: 3, name: 'Toshmatov Alisher', role: 'Robototexnika o\'q.', phone: '+998 90 456 78 90', email: 'alisher@educentre.uz', imageUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80' },
        // --- UPDATED CONTACT ---
        {
          id: 4,
          name: 'Yo\'ldoshov Aziz', // Changed Name
          role: 'O\'quv markaz direktori', // Kept Role
          phone: '+998 90 111 22 33',
          email: 'director@educentre.uz',
          imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80' // Changed Image URL to a male photo
        }
        // --- END OF UPDATE ---
      ]);

    const filteredChildren = computed(() => {
      if (!selectedChild.value) {
        return children.value;
      }
      const childId = parseInt(selectedChild.value);
      return children.value.filter(child => child.id === childId);
    });

    const toggleNotifications = () => {
      notificationsOpen.value = !notificationsOpen.value;
      if (notificationsOpen.value) {
        profileOpen.value = false;
      }
    };

    const toggleProfile = () => {
      profileOpen.value = !profileOpen.value;
      if (profileOpen.value) {
        notificationsOpen.value = false;
      }
    };

    const setActiveSection = (sectionId) => {
      navigation.value.forEach(item => {
        item.current = item.id === sectionId;
      });
      sidebarOpen.value = false; // Close mobile sidebar
      // Reset child filter when navigating away from attendance
      if (sectionId !== 'attendance') {
          selectedChild.value = '';
      }
    };

    const sendMessage = (event) => {
        // Placeholder for actual message sending logic
        console.log('Sending message...');
        alert('Xabar yuborish funksiyasi hali qo\'shilmagan.');
        event.target.reset(); // Reset form fields
    };


    // Close dropdowns when clicking outside
    const closeDropdowns = (event) => {
        // Improved logic to prevent closing when clicking inside the dropdown trigger buttons
        if (!event.target.closest('[aria-labelledby="notifications-button"]') && !event.target.closest('#notifications-button')) {
            notificationsOpen.value = false;
        }
        if (!event.target.closest('[aria-labelledby="user-menu-button"]') && !event.target.closest('#user-menu-button')) {
            profileOpen.value = false;
        }
    };


    onMounted(() => {
      document.addEventListener('click', closeDropdowns, true); // Use capture phase
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdowns, true); // Use capture phase
    });


    return {
      sidebarOpen,
      notificationsOpen,
      profileOpen,
      selectedChild,
      user,
      navigation,
      activeSection,
      children,
      notifications,
      unreadNotificationsCount,
      activities,
      events,
      stats,
      upcomingPayments,
      paymentHistory,
      contacts,
      filteredChildren,
      toggleNotifications,
      toggleProfile,
      setActiveSection,
      sendMessage,
    };
  }
};
</script>

<style>
/* Add any minor custom styles if absolutely necessary */
/* For example, fine-tuning scrollbar appearance if needed */
/* Or transitions if not fully covered by Tailwind */

/* Ensure SVGs injected via v-html inherit text color correctly if needed */
/* svg { */
  /* fill: currentColor; */ /* Usually not needed with stroke icons */
/* } */
</style>