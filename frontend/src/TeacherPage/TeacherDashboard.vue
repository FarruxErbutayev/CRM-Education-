<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <!-- Login form -->
    <div v-if="!currentTeacher" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-center text-purple-600">O'qituvchi kirish paneli</h2>
      <div v-if="loginError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ loginError }}
      </div>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            v-model="email"
            class="w-full p-2 border border-gray-300 rounded"
            required
          >
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Parol</label>
          <input
            type="password"
            v-model="password"
            class="w-full p-2 border border-gray-300 rounded"
            required
          >
        </div>
        <button
          type="submit"
          class="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Kirish
        </button>
      </form>
    </div>

    <!-- Teacher Dashboard -->
    <div v-else class="max-w-6xl mx-auto">
      <header class="bg-white p-4 mb-4 rounded-lg shadow-md flex justify-between items-center">
        <!-- Left Side: Title and Welcome Message -->
        <div>
          <h1 class="text-xl font-bold text-purple-600">O'qituvchi paneli</h1>
          <p class="text-gray-600">Xush kelibsiz, {{ currentTeacher.name }}!</p>
        </div>

        <!-- Right Side: Icons and Logout Button -->
        <div class="flex items-center space-x-4">

          <!-- Notifications Icon -->
          <button
            @click="viewNotifications"
            class="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 relative"
            title="Bildirishnomalar"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <!-- Profile Icon (now maybe shows image) -->
          <button
            @click="activeTab = 'profile'"
            class="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            title="Profil"
          >
             <!-- Show Image if available, else Icon -->
             <img v-if="currentTeacher.imageUrl" :src="currentTeacher.imageUrl" alt="Profil rasm" class="h-8 w-8 rounded-full object-cover">
             <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          <!-- Logout Button -->
          <button
            @click="logout"
            class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
          >
            Chiqish
          </button>
        </div>
      </header>

      <div class="flex flex-col md:flex-row gap-4">
        <!-- Sidebar -->
        <nav class="bg-white p-4 rounded-lg shadow-md md:w-64">
           <ul class="space-y-2">
            <li>
              <button
                @click="activeTab = 'dashboard'"
                class="w-full text-left px-4 py-2 rounded"
                :class="activeTab === 'dashboard' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'"
              >
                Bosh sahifa
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'schedule'"
                class="w-full text-left px-4 py-2 rounded"
                :class="activeTab === 'schedule' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'"
              >
                Dars jadvali
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'groups'"
                class="w-full text-left px-4 py-2 rounded"
                :class="activeTab === 'groups' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'"
              >
                Guruhlar
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'attendance'"
                class="w-full text-left px-4 py-2 rounded"
                :class="activeTab === 'attendance' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'"
              >
                Davomat
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'profile'"
                class="w-full text-left px-4 py-2 rounded"
                :class="activeTab === 'profile' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'"
              >
                Profil
              </button>
            </li>
          </ul>
        </nav>

        <!-- Main content -->
        <main class="bg-white p-4 rounded-lg shadow-md flex-1">
          <h2 class="text-xl font-bold mb-4">
            {{
              activeTab === 'dashboard' ? 'Bosh sahifa' :
              activeTab === 'schedule' ? 'Dars jadvali' :
              activeTab === 'groups' ? 'Guruhlar' :
              activeTab === 'attendance' ? 'Davomat' :
              activeTab === 'profile' ? (isEditingProfile ? 'Profilni Tahrirlash' : 'Profil') :
              'Bosh sahifa'
            }}
          </h2>

          <!-- Dashboard content -->
          <div v-if="activeTab === 'dashboard'">
            <!-- ... (Dashboard content remains the same) ... -->
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-purple-100 p-4 rounded-lg">
                <h3 class="font-bold">Guruhlar</h3>
                <p class="text-2xl">{{ currentTeacher.groups.length }}</p>
              </div>
              <div class="bg-blue-100 p-4 rounded-lg">
                <h3 class="font-bold">O'quvchilar</h3>
                <p class="text-2xl">{{ getTotalStudents() }}</p>
              </div>
              <div class="bg-green-100 p-4 rounded-lg">
                <h3 class="font-bold">Darslar</h3>
                <p class="text-2xl">{{ currentTeacher.schedule.length }}</p>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="font-bold mb-2">Bugungi darslar</h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div v-if="getTodayLessons().length === 0" class="text-gray-500">
                  Bugun darslar yo'q
                </div>
                <div v-else class="space-y-2">
                  <div v-for="(lesson, index) in getTodayLessons()" :key="index" class="p-3 bg-white rounded border border-gray-200">
                    <div class="flex justify-between">
                      <div>
                        <span class="font-medium">{{ lesson.group }}</span>
                        <span class="text-gray-500 ml-2">{{ lesson.subject }}</span>
                      </div>
                      <div class="text-gray-600">{{ lesson.time }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-bold mb-2">So'nggi faoliyatlar</h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="space-y-2">
                  <div v-for="(activity, index) in currentTeacher.recentActivities" :key="index" class="p-3 bg-white rounded border border-gray-200">
                    <div class="flex justify-between">
                      <div>{{ activity.description }}</div>
                      <div class="text-gray-600 text-sm">{{ activity.time }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule content -->
          <div v-if="activeTab === 'schedule'">
             <!-- ... (Schedule content remains the same) ... -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kun</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaqt</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guruh</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fan</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xona</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(lesson, index) in currentTeacher.schedule" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">{{ lesson.day }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ lesson.time }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ lesson.group }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ lesson.subject }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ lesson.room }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Groups content -->
          <div v-if="activeTab === 'groups'">
            <!-- ... (Groups content remains the same) ... -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(group, index) in currentTeacher.groups" :key="index" class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-bold mb-2">{{ group.name }}</h3>
                <div class="text-sm text-gray-600 mb-2">{{ group.subject }} | {{ group.students.length }} o'quvchi</div>
                <div class="space-y-1">
                  <div v-for="(student, studentIndex) in group.students" :key="studentIndex" class="p-2 bg-white rounded">
                    {{ student }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Attendance content -->
          <div v-if="activeTab === 'attendance'">
            <!-- ... (Attendance content remains the same) ... -->
              <div class="mb-4">
              <label class="block text-gray-700 mb-2">Guruhni tanlang</label>
              <select class="w-full p-2 border border-gray-300 rounded" v-model="selectedGroup">
                <option value="">Guruhni tanlang</option>
                <option v-for="(group, index) in currentTeacher.groups" :key="index" :value="group.name">
                  {{ group.name }}
                </option>
              </select>
            </div>

            <div v-if="selectedGroup" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold">{{ selectedGroup }} guruhi davomati</h3>
                <div class="text-sm text-gray-600">{{ getCurrentDate() }}</div>
              </div>

              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">O'quvchi</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Izoh</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(student, index) in getSelectedGroupStudents()" :key="index">
                      <td class="px-6 py-4">{{ student }}</td>
                      <td class="px-6 py-4">
                        <select class="p-1 border border-gray-300 rounded">
                          <option value="present">Keldi</option>
                          <option value="absent">Kelmadi</option>
                          <option value="late">Kechikdi</option>
                        </select>
                      </td>
                      <td class="px-6 py-4">
                        <input type="text" class="p-1 border border-gray-300 rounded w-full" placeholder="Izoh...">
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-4 flex justify-end">
                <button class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                  Saqlash
                </button>
              </div>
            </div>
          </div>

          <!-- Profile content -->
          <div v-if="activeTab === 'profile'">
            <!-- Profile View -->
            <div v-if="!isEditingProfile" class="bg-gray-50 p-6 rounded-lg">
              <div class="flex justify-end mb-4">
                 <button @click="startEditingProfile" class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm">
                    Tahrirlash
                  </button>
              </div>
              <div class="flex flex-col md:flex-row items-center md:items-start">
                <div class="md:w-1/3 mb-4 md:mb-0 flex flex-col items-center">
                   <!-- Profile Picture Display -->
                   <div class="bg-purple-100 h-40 w-40 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                       <img v-if="currentTeacher.imageUrl" :src="currentTeacher.imageUrl" alt="Profil rasm" class="h-full w-full object-cover">
                       <span v-else class="text-purple-600 text-4xl font-bold">
                           {{ currentTeacher.name.charAt(0) }}
                       </span>
                   </div>
                </div>
                <div class="md:w-2/3 md:pl-6">
                  <div class="space-y-4">
                    <div>
                      <h3 class="text-sm text-gray-500">F.I.O</h3>
                      <p class="font-medium text-lg">{{ currentTeacher.name }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm text-gray-500">Email</h3>
                      <p class="font-medium">{{ currentTeacher.email }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm text-gray-500">Telefon</h3>
                      <p class="font-medium">{{ currentTeacher.phone }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm text-gray-500">Fanlar</h3>
                      <p class="font-medium">{{ currentTeacher.subjects.join(', ') }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm text-gray-500">Tajriba</h3>
                      <p class="font-medium">{{ currentTeacher.experience }} yil</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Edit Form -->
            <div v-else class="bg-gray-50 p-6 rounded-lg">
              <form @submit.prevent="saveProfileChanges">
                <div class="flex flex-col md:flex-row gap-6">
                  <!-- Left Side: Image Upload -->
                  <div class="md:w-1/3 flex flex-col items-center">
                    <div class="bg-purple-100 h-40 w-40 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                       <!-- Image Preview -->
                       <img v-if="profileImagePreview" :src="profileImagePreview" alt="Rasm prevyu" class="h-full w-full object-cover">
                       <span v-else class="text-purple-600 text-4xl font-bold">
                           {{ editableProfile.name ? editableProfile.name.charAt(0) : '?' }}
                       </span>
                    </div>
                    <label class="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm">
                      Rasmni o'zgartirish
                      <input type="file" class="hidden" @change="handleImageUpload" accept="image/*">
                    </label>
                     <p v-if="profileImagePreview" class="text-xs text-gray-500 mt-2">Yangi rasm tanlandi.</p>
                  </div>

                  <!-- Right Side: Form Fields -->
                  <div class="md:w-2/3 space-y-4">
                     <div>
                      <label class="block text-sm text-gray-500 mb-1">F.I.O</label>
                      <input type="text" v-model="editableProfile.name" class="w-full p-2 border border-gray-300 rounded" required>
                    </div>
                     <div>
                      <label class="block text-sm text-gray-500 mb-1">Email (tahrirlanmaydi)</label>
                      <input type="email" :value="editableProfile.email" class="w-full p-2 border border-gray-300 rounded bg-gray-100" disabled>
                    </div>
                    <div>
                      <label class="block text-sm text-gray-500 mb-1">Telefon</label>
                      <input type="tel" v-model="editableProfile.phone" class="w-full p-2 border border-gray-300 rounded">
                    </div>
                    <div>
                      <label class="block text-sm text-gray-500 mb-1">Fanlar (vergul bilan ajrating)</label>
                      <input type="text" :value="editableProfile.subjects.join(', ')" @input="editableProfile.subjects = $event.target.value.split(',').map(s => s.trim())" class="w-full p-2 border border-gray-300 rounded">
                    </div>
                     <div>
                      <label class="block text-sm text-gray-500 mb-1">Tajriba (yil)</label>
                      <input type="number" v-model.number="editableProfile.experience" class="w-full p-2 border border-gray-300 rounded" min="0">
                    </div>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="mt-6 flex justify-end space-x-3">
                   <button type="button" @click="cancelProfileEdit" class="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">
                     Bekor qilish
                   </button>
                   <button type="submit" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                     Saqlash
                   </button>
                </div>
              </form>
            </div>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// --- State ---
const email = ref('')
const password = ref('')
const loginError = ref('')
const currentTeacher = ref(null)
const activeTab = ref('dashboard')
const selectedGroup = ref('')

// Profile Editing State
const isEditingProfile = ref(false)
const editableProfile = ref(null) // Will hold a copy of teacher data for editing
const profileImagePreview = ref(null) // Holds data URL for image preview


// --- Simulated Database ---
const teachersDatabase = ref([ // Make it a ref to allow modification
  {
    id: 1,
    name: 'Karimov Karim',
    email: 'karim@example.com',
    password: 'password123',
    phone: '+998 90 187 45 67',
    subjects: ['Ingliz tili (Boshlang\'ich)', 'Ingliz tili (O\'rta)'],
    experience: 5,
    imageUrl: null, // Added field for profile picture URL
    groups: [ /* ... groups ... */
       {
        name: 'A1 guruhi',
        subject: 'Ingliz tili (Boshlang\'ich)',
        students: ['Aliyev Ali', 'Valiyeva Valida', 'Karimov Karim', 'Azizova Aziza']
      },
      {
        name: 'B1 guruhi',
        subject: 'Ingliz tili (O\'rta)',
        students: ['Toshmatov Toshmat', 'Rahimov Rahim', 'Zokirova Zokira']
      }
    ],
    schedule: [ /* ... schedule ... */
      { day: 'Dushanba', time: '09:00 - 10:30', group: 'A1 guruhi', subject: 'Ingliz tili (Boshlang\'ich)', room: '101' },
      { day: 'Dushanba', time: '11:00 - 12:30', group: 'B1 guruhi', subject: 'Ingliz tili (O\'rta)', room: '102' },
      { day: 'Chorshanba', time: '09:00 - 10:30', group: 'A1 guruhi', subject: 'Ingliz tili (Boshlang\'ich)', room: '101' },
      { day: 'Chorshanba', time: '11:00 - 12:30', group: 'B1 guruhi', subject: 'Ingliz tili (O\'rta)', room: '102' },
      { day: 'Juma', time: '09:00 - 10:30', group: 'A1 guruhi', subject: 'Ingliz tili (Boshlang\'ich)', room: '101' },
      { day: 'Juma', time: '11:00 - 12:30', group: 'B1 guruhi', subject: 'Ingliz tili (O\'rta)', room: '102' }
     ],
    recentActivities: [ /* ... activities ... */
      { description: 'A1 guruhida davomat to\'ldirildi', time: '2 soat oldin' },
      { description: 'B1 guruhiga yangi o\'quvchi qo\'shildi', time: '1 kun oldin' },
      { description: 'Dars jadvali o\'zgartirildi', time: '3 kun oldin' }
     ]
  },
  {
    id: 2,
    name: 'Aliyeva Nilufar',
    email: 'nilufar@example.com',
    password: 'password456',
    phone: '+998 90 234 56 78',
    subjects: ['IELTS tayyorgarlik'],
    experience: 7,
    imageUrl: 'https://via.placeholder.com/150/771796', // Example placeholder image
    groups: [ /* ... groups ... */
      {
        name: 'IELTS-1',
        subject: 'IELTS tayyorgarlik',
        students: ['Zokirova Zokira', 'Qodirov Qodir', 'Toshmatov Toshmat']
      }
    ],
    schedule: [ /* ... schedule ... */
     { day: 'Seshanba', time: '14:00 - 16:00', group: 'IELTS-1', subject: 'IELTS tayyorgarlik', room: '201' },
      { day: 'Payshanba', time: '14:00 - 16:00', group: 'IELTS-1', subject: 'IELTS tayyorgarlik', room: '201' },
      { day: 'Shanba', time: '10:00 - 12:00', group: 'IELTS-1', subject: 'IELTS tayyorgarlik', room: '201' }
    ],
    recentActivities: [ /* ... activities ... */
      { description: 'IELTS-1 guruhida davomat to\'ldirildi', time: '1 soat oldin' },
      { description: 'Yangi o\'quv materiallari yuklandi', time: '2 kun oldin' }
     ]
  },
   {
    id: 3,
    name: 'Toshmatov Jasur',
    email: 'jasur@example.com',
    password: 'password789',
    phone: '+998 90 845 67 89',
    subjects: ['Matematika'],
    experience: 10,
    imageUrl: null,
    groups: [ /* ... groups ... */
      {
        name: 'Math-1',
        subject: 'Matematika',
        students: ['Qodirov Qodir', 'Aliyev Ali', 'Rahimov Rahim']
      }
     ],
    schedule: [ /* ... schedule ... */
      { day: 'Dushanba', time: '15:00 - 16:30', group: 'Math-1', subject: 'Matematika', room: '301' },
      { day: 'Chorshanba', time: '15:00 - 16:30', group: 'Math-1', subject: 'Matematika', room: '301' },
      { day: 'Juma', time: '15:00 - 16:30', group: 'Math-1', subject: 'Matematika', room: '301' }
    ],
    recentActivities: [ /* ... activities ... */
      { description: 'Math-1 guruhida davomat to\'ldirildi', time: '3 soat oldin' },
      { description: 'Nazorat ishi natijalari kiritildi', time: '2 kun oldin' }
     ]
  }
])

// --- Methods ---

// Authentication
const login = () => {
  loginError.value = ''
  const teacher = teachersDatabase.value.find( // Use .value for refs
    t => t.email === email.value && t.password === password.value
  )
  if (teacher) {
    currentTeacher.value = teacher
    email.value = ''
    password.value = ''
    isEditingProfile.value = false // Reset edit mode on login
  } else {
    loginError.value = 'Email yoki parol noto\'g\'ri'
  }
}

const logout = () => {
  currentTeacher.value = null
  activeTab.value = 'dashboard'
  selectedGroup.value = ''
  isEditingProfile.value = false // Reset edit mode on logout
  editableProfile.value = null
  profileImagePreview.value = null
}

// Dashboard Helpers
const getTotalStudents = () => {
  if (!currentTeacher.value) return 0
  return currentTeacher.value.groups.reduce((sum, group) => sum + group.students.length, 0)
}

const getTodayLessons = () => {
  if (!currentTeacher.value) return []
  const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
  const today = days[new Date().getDay()]
  return currentTeacher.value.schedule.filter(lesson => lesson.day === today)
}

// Attendance Helpers
const getCurrentDate = () => {
  const date = new Date()
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getSelectedGroupStudents = () => {
  if (!currentTeacher.value || !selectedGroup.value) return []
  const group = currentTeacher.value.groups.find(g => g.name === selectedGroup.value)
  return group ? group.students : []
}

// Notifications (Placeholder)
const viewNotifications = () => {
  alert('Bildirishnomalar ko\'rsatiladi (hozircha implement qilinmagan).')
}

// --- Profile Editing Methods ---
const startEditingProfile = () => {
  if (!currentTeacher.value) return;
  // Create a deep copy to avoid modifying the original object directly
  editableProfile.value = JSON.parse(JSON.stringify(currentTeacher.value));
  // Set initial preview to current image or null
  profileImagePreview.value = currentTeacher.value.imageUrl;
  isEditingProfile.value = true;
}

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        // Use FileReader to create a preview
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImagePreview.value = e.target.result;
            // In a real app, you might store the file object itself
            // in editableProfile to upload it later, e.g.:
            // editableProfile.value.newImageFile = file;
        };
        reader.readAsDataURL(file);
    }
}

const saveProfileChanges = () => {
    if (!editableProfile.value || !currentTeacher.value) return;

    // Update the main currentTeacher object
    currentTeacher.value.name = editableProfile.value.name;
    currentTeacher.value.phone = editableProfile.value.phone;
    currentTeacher.value.subjects = editableProfile.value.subjects;
    currentTeacher.value.experience = editableProfile.value.experience;
    // Update the image URL (in simulation, just use the preview)
    currentTeacher.value.imageUrl = profileImagePreview.value;

    // --- Simulate Persistence ---
    // Find the teacher in the 'datase' and update them too
    const dbIndex = teachersDatabase.value.findIndex(t => t.id === currentTeacher.value.id);
    if (dbIndex !== -1) {
        // Create a new object with updated values to ensure reactivity if needed
        teachersDatabase.value[dbIndex] = { ...teachersDatabaes.value[dbIndex], ...currentTeacher.value };
    }
    // --- End Simulation ---
ba
    // Exit edit mode
    isEditingProfile.value = false;
    editableProfile.value = null;
    // Keep pmagePreview as it's now the currentTeacher's image URL
}

const cancelProfileEdit = () => {
    isEditingProfile.value = false;
    editableProfile.value = null;
    profileImagePreview.value = null; // Reset preview
}

</script>

<style>
/* Optional: Style the hidden file input trigger */
.hidden {
  display: none;
}
</style>
