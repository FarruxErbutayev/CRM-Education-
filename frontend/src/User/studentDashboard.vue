<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Login form -->
    <div v-if="!isLoggedIn" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 class="text-2xl font-bold mb-4 text-center text-purple-600">O'quvchi kirish paneli</h2>
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

    <!-- Dashboard -->
    <div v-else class="max-w-6xl mx-auto p-4">
      <header class="bg-white p-4 mb-4 rounded-lg shadow-md flex justify-between items-center">
        <!-- Left Side: Title and Welcome Message -->
        <div>
          <h1 class="text-xl font-bold text-purple-600">O'quvchi profili</h1>
          <p class="text-gray-600">Xush kelibsiz, {{ currentStudent.name }}!</p>
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

          <!-- Profile Icon -->
          <button
            @click="activeTab = 'profile'"
            class="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            title="Profil"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                @click="activeTab = 'courses'"
                class="w-full text-left px-4 py-2 rounded"
                :class="activeTab === 'courses' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'"
              >
                Kurslar
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'assignments'"
                class="w-full text-left px-4 py-2 rounded"
                :class="activeTab === 'assignments' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'"
              >
                Vazifalar
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'exams'"
                class="w-full text-left px-4 py-2 rounded"
                :class="activeTab === 'exams' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'"
              >
                Imtihonlar
              </button>
            </li>
            <li>
              <button
                @click="activeTab = 'payment'"
                class="w-full text-left px-4 py-2 rounded"
                :class="activeTab === 'payment' ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'"
              >
                To'lovlar
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
              activeTab === 'courses' ? 'Kurslar' :
              activeTab === 'assignments' ? 'Vazifalar' :
              activeTab === 'exams' ? 'Imtihonlar' :
              activeTab === 'payment' ? 'To\'lovlar' :
              activeTab === 'profile' ? 'Profil' : 'Bosh sahifa'
            }}
          </h2>

          <!-- Dashboard content -->
          <div v-if="activeTab === 'dashboard'">
             <!-- ... (dashboard content remains the same) ... -->
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-purple-100 p-4 rounded-lg">
                <h3 class="font-bold">Kurslar</h3>
                <p class="text-2xl">{{ currentStudent.courses.length }}</p>
              </div>
              <div class="bg-blue-100 p-4 rounded-lg">
                <h3 class="font-bold">Vazifalar</h3>
                <p class="text-2xl">{{ currentStudent.assignments.length }}</p>
              </div>
              <div class="bg-green-100 p-4 rounded-lg">
                <h3 class="font-bold">Davomat</h3>
                <p class="text-2xl">{{ Math.round((currentStudent.attendance.present / currentStudent.attendance.total) * 100) }}%</p>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="font-bold mb-2">Keyingi darslar</h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div v-if="currentStudent.upcomingLessons.length === 0" class="text-gray-500">
                  Bugun darslar yo'q
                </div>
                <div v-else class="space-y-2">
                  <div v-for="(lesson, index) in currentStudent.upcomingLessons" :key="index" class="p-3 bg-white rounded border border-gray-200">
                    <div class="flex justify-between">
                      <div>
                        <span class="font-medium">{{ lesson.subject }}</span>
                      </div>
                      <div class="text-gray-600">{{ lesson.time }}</div>
                    </div>
                    <div class="text-gray-500 text-sm">{{ lesson.location }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule content -->
          <div v-if="activeTab === 'schedule'">
             <!-- ... (schedule content remains the same) ... -->
             <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kun</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaqt</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fan</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xona</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(lesson, index) in schedule" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">{{ lesson.day }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ lesson.time }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ lesson.subject }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ lesson.location }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Courses content -->
          <div v-if="activeTab === 'courses'">
             <!-- ... (courses content remains the same) ... -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(course, index) in currentStudent.courses" :key="index" class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-bold mb-2">{{ course.name }}</h3>
                <div class="text-sm text-gray-600 mb-2">O'qituvchi: {{ course.teacher }}</div>
                <div class="text-sm text-gray-600 mb-2">Jadval: {{ course.schedule }}</div>
                <div class="text-sm text-gray-600 mb-2">Xona: {{ course.location }}</div>
                <div class="mt-2">
                  <div class="text-sm font-medium text-gray-500">Progress</div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div class="bg-purple-600 h-2.5 rounded-full" :style="{ width: course.progress + '%' }"></div>
                  </div>
                  <div class="text-right text-sm text-gray-600">{{ course.progress }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Assignments content -->
          <div v-if="activeTab === 'assignments'">
             <!-- ... (assignments content remains the same) ... -->
             <div class="space-y-4">
              <div v-for="(assignment, index) in currentStudent.assignments" :key="index" class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between">
                  <h3 class="font-bold">{{ assignment.title }}</h3>
                  <span class="px-2 py-1 text-xs rounded-full"
                    :class="assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'">
                    {{
                      assignment.status === 'completed' ? 'Topshirilgan' :
                      assignment.status === 'in-progress' ? 'Jarayonda' :
                      'Topshirilmagan'
                    }}
                  </span>
                </div>
                <div class="text-sm text-gray-600 mb-2">{{ assignment.course }}</div>
                <div class="text-sm text-gray-600 mb-2">Muddat: {{ assignment.dueDate }}</div>
                <p class="text-sm text-gray-700">{{ assignment.description }}</p>
              </div>
            </div>
          </div>

          <!-- Exams content (NEW) -->
          <div v-if="activeTab === 'exams'">
            <div class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <div>
                  <h3 class="text-lg font-semibold">Imtihonlar</h3>
                  <p class="text-sm text-gray-600">Bilimingizni tekshirish uchun testlarni yechib ko'ring</p>
                </div>
                <div v-if="!activeExam" class="flex items-center space-x-2">
                  <span class="text-sm text-gray-600">Umumiy natija:</span>
                  <div class="flex items-center">
                    <div class="w-32 bg-gray-200 rounded-full h-2.5">
                      <div 
                        class="bg-purple-600 h-2.5 rounded-full" 
                        :style="{ width: calculateExamProgress(exam) + '%' }"
                      ></div>
                    </div>
                    <span class="ml-2 text-sm font-medium">{{ calculateExamProgress(exam) }}%</span>
                  </div>
                </div>
              </div>

              <!-- Exam Selection View -->
              <div v-if="!activeExam">
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                  <div class="flex justify-between items-start mb-3">
                    <h4 class="font-bold text-lg">{{ exam.title }}</h4>
                    <span 
                      class="px-2 py-1 text-xs rounded-full"
                      :class="getExamStatusClass(exam)"
                    >
                      {{ getExamStatusText(exam) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">{{ exam.description }}</p>
                  <div class="flex justify-between items-center">
                    <div class="flex items-center">
                      <span class="text-xs text-gray-500 mr-2">Progress:</span>
                      <div class="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          class="bg-purple-600 h-2 rounded-full" 
                          :style="{ width: calculateExamProgress(exam) + '%' }"
                        ></div>
                      </div>
                      <span class="ml-2 text-xs">{{ calculateExamProgress(exam) }}%</span>
                    </div>
                    <button
                      @click="startExam()"
                      class="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
                    >
                      {{
                        exam.status === 'not-started'
                          ? 'Boshlash'
                          : exam.status === 'in-progress'
                          ? 'Davom ettirish'
                          : 'Qayta ko\'rish'
                      }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Active Exam View -->
              <div v-else class="bg-white border border-gray-200 rounded-lg p-6">
                <div class="flex justify-between items-center mb-6">
                  <div>
                    <h3 class="text-xl font-bold">{{ exam.title }}</h3>
                    <p class="text-sm text-gray-600">{{ exam.description }}</p>
                  </div>
                  <button 
                    @click="exitExam"
                    class="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
                  >
                    Chiqish
                  </button>
                </div>

                <!-- Progress Bar -->
                <div class="mb-6">
                  <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress: {{ currentQuestionIndex + 1 }} / {{ exam.questions.length }}</span>
                    <span>{{ calculateExamProgress(exam) }}% tugallandi</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      class="bg-purple-600 h-2.5 rounded-full" 
                      :style="{ width: calculateExamProgress(exam) + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Question Display -->
                <div v-if="!examCompleted" class="mb-8">
                  <div class="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 class="font-medium mb-2">Savol {{ currentQuestionIndex + 1 }}:</h4>
                    <p class="text-gray-800">{{ currentQuestion.text }}</p>
                  </div>

                  <!-- Answer Options -->
                  <div class="space-y-3">
                    <div 
                      v-for="(option, optionIndex) in currentQuestion.options" 
                      :key="optionIndex"
                      class="flex items-center"
                    >
                      <input 
                        type="radio" 
                        :id="`option-${optionIndex}`" 
                        :name="`question-${currentQuestionIndex}`" 
                        :value="optionIndex" 
                        v-model="currentQuestion.selectedAnswer"
                        class="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      >
                      <label :for="`option-${optionIndex}`" class="ml-3 block text-gray-700">
                        {{ option }}
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Exam Results (when completed) -->
                <div v-if="examCompleted" class="bg-gray-50 p-6 rounded-lg">
                  <div class="text-center mb-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Imtihon yakunlandi!</h3>
                    <p class="text-gray-600">Siz {{ exam.title }} imtihonini muvaffaqiyatli tugatdingiz.</p>
                  </div>
                  
                  <div class="flex justify-center mb-6">
                    <div class="relative w-32 h-32">
                      <svg class="w-32 h-32" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          stroke-width="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#8B5CF6"
                          stroke-width="3"
                          :stroke-dasharray="`${calculateExamScore()}, 100`"
                        />
                      </svg>
                      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span class="text-3xl font-bold text-gray-800">{{ calculateExamScore() }}%</span>
                      </div>
                    </div>
                  </div>

                  <div class="text-center space-y-4">
                    <p class="text-gray-700">
                      <span class="font-medium">To'g'ri javoblar:</span> {{ countCorrectAnswers() }} / {{ exam.questions.length }}
                    </p>
                    
                    <div class="flex justify-center space-x-3">
                      <button 
                        @click="reviewExam"
                        class="bg-purple-100 text-purple-700 px-4 py-2 rounded hover:bg-purple-200 transition-colors"
                      >
                        Javoblarni ko'rish
                      </button>
                      <button 
                        @click="exitExam"
                        class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                      >
                        Imtihonlar ro'yxatiga qaytish
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div v-if="!examCompleted" class="flex justify-between mt-6">
                  <button 
                    @click="previousQuestion"
                    :disabled="currentQuestionIndex === 0"
                    class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Oldingi
                  </button>
                  
                  <button 
                    v-if="currentQuestionIndex < exam.questions.length - 1"
                    @click="nextQuestion"
                    :disabled="currentQuestion.selectedAnswer === null"
                    class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Keyingi
                  </button>
                  
                  <button 
                    v-else
                    @click="finishExam"
                    :disabled="currentQuestion.selectedAnswer === null"
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Yakunlash
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Content -->
          <div v-if="activeTab === 'payment'">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Left Column: Saved Cards & Add Card -->
              <div class="lg:col-span-1 space-y-6">
                 <!-- Saved Cards -->
                <div>
                  <h3 class="text-lg font-semibold mb-3">Saqlangan kartalar</h3>
                  <div v-if="currentStudent.paymentMethods.length === 0" class="text-gray-500 bg-gray-50 p-4 rounded">
                      Hali kartalar qo'shilmagan.
                  </div>
                  <div v-else class="space-y-3">
                    <div v-for="card in currentStudent.paymentMethods" :key="card.id" class="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                      <div class="flex items-center space-x-3">
                         <svg class="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> </svg>
                        <div>
                          <span class="block font-medium text-sm">{{ card.maskedNumber }}</span>
                          <span class="block text-xs text-gray-500">{{ card.type }} - {{ card.expiryDate }}</span>
                        </div>
                      </div>
                      <button @click="removeCard(card.id)" class="text-red-500 hover:text-red-700 text-xs">O'chirish</button>
                    </div>
                  </div>
                </div>

                <!-- Add New Card Form -->
                <div>
                   <button @click="showAddCardForm = !showAddCardForm" class="text-purple-600 hover:text-purple-800 font-medium text-sm mb-3">
                      {{ showAddCardForm ? 'Bekor qilish' : '+ Yangi karta qo\'shish' }}
                   </button>
                   <form v-if="showAddCardForm" @submit.prevent="addCard" class="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
                      <h4 class="font-semibold text-md mb-2">Yangi karta ma'lumotlari</h4>
                       <div>
                         <label class="block text-sm font-medium text-gray-700 mb-1">Karta raqami</label>
                         <input type="text" v-model="newCardNumber" placeholder="XXXX XXXX XXXX XXXX" class="w-full p-2 border border-gray-300 rounded text-sm" required>
                       </div>
                       <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Amal qilish muddati (OO/YY)</label>
                          <input type="text" v-model="newCardExpiry" placeholder="05/27" class="w-full p-2 border border-gray-300 rounded text-sm" required>
                       </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Karta egasi (F.I.O)</label>
                          <input type="text" v-model="newCardHolder" placeholder="ALIYEV ALI" class="w-full p-2 border border-gray-300 rounded text-sm" required>
                       </div>
                       <div>
                         <label class="block text-sm font-medium text-gray-700 mb-1">Karta turi</label>
                         <select v-model="newCardType" class="w-full p-2 border border-gray-300 rounded text-sm" required>
                           <option value="UzCard">UzCard</option>
                           <option value="Humo">Humo</option>
                           <option value="Visa">Visa</option>
                           <option value="Mastercard">Mastercard</option>
                         </select>
                       </div>
                       <button type="submit" class="w-full bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700">
                           Kartani qo'shish
                       </button>
                       <p v-if="addCardError" class="text-red-600 text-sm mt-2">{{ addCardError }}</p>
                   </form>
                </div>
              </div>

              <!-- Middle Column: Make Payment -->
              <div class="lg:col-span-1 bg-blue-50 p-6 rounded-lg border border-blue-200">
                 <h3 class="text-lg font-semibold mb-4 text-blue-800">To'lovni amalga oshirish</h3>
                  <form @submit.prevent="initiatePayment">
                      <div class="mb-4">
                         <label class="block text-sm font-medium text-gray-700 mb-1">To'lov summasi (so'm)</label>
                         <input type="number" v-model.number="paymentAmount" min="1000" step="1000" placeholder="500000" class="w-full p-2 border border-gray-300 rounded" required>
                      </div>

                      <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">To'lov usuli (Saqlangan karta)</label>
                         <div v-if="currentStudent.paymentMethods.length > 0" class="space-y-2">
                           <!-- Saved Cards Radio -->
                           <div v-for="card in currentStudent.paymentMethods" :key="'pay-' + card.id" class="flex items-center">
                             <input type="radio" :id="'card-' + card.id" name="paymentMethod" :value="card.id" v-model="selectedPaymentCardId" class="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500">
                             <label :for="'card-' + card.id" class="ml-3 block text-sm font-medium text-gray-700">
                                {{ card.maskedNumber }} ({{ card.type }})
                             </label>
                           </div>
                         </div>
                         <div v-else class="text-sm text-gray-500">
                           To'lov qilish uchun avval karta qo'shing.
                         </div>
                      </div>

                      <button
                         type="submit"
                         :disabled="!paymentAmount || !selectedPaymentCardId || currentStudent.paymentMethods.length === 0"
                         class="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                          To'lash
                      </button>
                      <p v-if="paymentError" class="text-red-600 text-sm mt-2">{{ paymentError }}</p>
                      <p v-if="paymentSuccess" class="text-green-600 text-sm mt-2">{{ paymentSuccess }}</p>
                  </form>
              </div>

               <!-- Right Column: Payment History -->
               <div class="lg:col-span-1">
                  <h3 class="text-lg font-semibold mb-3">To'lovlar tarixi</h3>
                   <div v-if="currentStudent.paymentHistory.length === 0" class="text-gray-500 bg-gray-50 p-4 rounded">
                      Hali to'lovlar amalga oshirilmagan.
                   </div>
                  <div v-else class="overflow-x-auto border border-gray-200 rounded">
                      <table class="min-w-full divide-y divide-gray-200 text-sm">
                         <thead class="bg-gray-50">
                            <tr>
                               <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Sana</th>
                               <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Summa</th>
                               <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Usul</th>
                               <th class="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Holat</th>
                            </tr>
                         </thead>
                         <tbody class="bg-white divide-y divide-gray-200">
                             <tr v-for="(payment, index) in currentStudent.paymentHistory" :key="index">
                                <td class="px-4 py-2 whitespace-nowrap">{{ payment.date }}</td>
                                <td class="px-4 py-2 whitespace-nowrap">{{ payment.amount.toLocaleString() }} so'm</td>
                                <td class="px-4 py-2 whitespace-nowrap">{{ payment.method }}</td>
                                <td class="px-4 py-2 whitespace-nowrap">
                                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                    :class="payment.status === 'Muvaffaqiyatli' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                    {{ payment.status }}
                                  </span>
                                </td>
                             </tr>
                         </tbody>
                      </table>
                  </div>
               </div>
            </div>
          </div>

          <!-- Profile content -->
          <div v-if="activeTab === 'profile'">
             <!-- ... (profile content remains the same) ... -->
             <div class="bg-gray-50 p-6 rounded-lg">

              <!-- Profile Picture Section -->
              <div class="flex flex-col items-center mb-6">
                  <img
                    :src="profileImageUrl || '/placeholder-avatar.png'"
                    alt="Profil rasmi"
                    class="w-32 h-32 rounded-full object-cover border-4 border-purple-200 mb-4"
                  >
                  <label v-if="isEditingProfile" class="cursor-pointer bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600">
                      Rasmni o'zgartirish
                      <input type="file" class="hidden" @change="handleImageUpload" accept="image/*">
                  </label>
              </div>

              <!-- Profile Details Section -->
              <form @submit.prevent="saveProfile">
                <div class="space-y-4">
                  <!-- Display Mode -->
                  <template v-if="!isEditingProfile">
                    <div> <h3 class="text-sm text-gray-500">F.I.O</h3> <p class="font-medium">{{ currentStudent.name }}</p> </div>
                    <div> <h3 class="text-sm text-gray-500">Email</h3> <p class="font-medium">{{ currentStudent.email }}</p> </div>
                    <div> <h3 class="text-sm text-gray-500">Telefon</h3> <p class="font-medium">{{ currentStudent.phone || 'Kiritilmagan' }}</p> </div>
                    <div> <h3 class="text-sm text-gray-500">Manzil</h3> <p class="font-medium">{{ currentStudent.address || 'Kiritilmagan' }}</p> </div>
                    <div> <h3 class="text-sm text-gray-500">Guruh</h3> <p class="font-medium">{{ currentStudent.group }}</p> </div>
                    <div> <h3 class="text-sm text-gray-500">Ro'yxatdan o'tgan sana</h3> <p class="font-medium">{{ currentStudent.enrollmentDate }}</p> </div>
                  </template>

                  <!-- Edit Mode -->
                  <template v-else>
                     <div> <label class="block text-sm font-medium text-gray-700 mb-1">F.I.O</label> <input type="text" v-model="currentStudent.name" class="w-full p-2 border border-gray-300 rounded"> </div>
                     <div> <h3 class="text-sm text-gray-500">Email (o'zgartirib bo'lmaydi)</h3> <p class="font-medium bg-gray-100 p-2 rounded">{{ currentStudent.email }}</p> </div>
                     <div> <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label> <input type="tel" v-model="currentStudent.phone" class="w-full p-2 border border-gray-300 rounded"> </div>
                     <div> <label class="block text-sm font-medium text-gray-700 mb-1">Manzil</label> <textarea v-model="currentStudent.address" rows="3" class="w-full p-2 border border-gray-300 rounded"></textarea> </div>
                     <div> <h3 class="text-sm text-gray-500">Guruh (o'zgartirib bo'lmaydi)</h3> <p class="font-medium bg-gray-100 p-2 rounded">{{ currentStudent.group }}</p> </div>
                     <div> <h3 class="text-sm text-gray-500">Ro'yxatdan o'tgan sana (o'zgartirib bo'lmaydi)</h3> <p class="font-medium bg-gray-100 p-2 rounded">{{ currentStudent.enrollmentDate }}</p> </div>
                  </template>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 flex justify-end space-x-3">
                  <button v-if="!isEditingProfile" type="button" @click="toggleEditProfile" class="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"> Tahrirlash </button>
                  <template v-if="isEditingProfile">
                      <button type="button" @click="cancelEdit" class="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"> Bekor qilish </button>
                      <button type="submit" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"> Saqlash </button>
                  </template>
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
import { ref, computed } from 'vue'

// --- Authentication State ---
const isLoggedIn = ref(false)
const email = ref('')
const password = ref('')
const loginError = ref('')
const currentStudent = ref(null)

// --- UI State ---
const activeTab = ref('dashboard')
const isEditingProfile = ref(false)
const profileImageUrl = ref(null)
const originalProfileData = ref(null)

// --- Payment UI State ---
const showAddCardForm = ref(false)
const newCardNumber = ref('')
const newCardExpiry = ref('')
const newCardHolder = ref('')
const newCardType = ref('UzCard')
const addCardError = ref('')
const paymentAmount = ref(null)
const selectedPaymentCardId = ref(null)
const paymentError = ref('')
const paymentSuccess = ref('')

// --- Exam UI State ---
const activeExam = ref(null)
const currentQuestionIndex = ref(0)
const examCompleted = ref(false)
const isReviewing = ref(false)

// --- Sample Data ---
const schedule = [
  { day: 'Dushanba', time: '09:00 - 10:30', subject: 'Ingliz tili', location: '101-xona' },
  { day: 'Dushanba', time: '15:00 - 16:30', subject: 'Matematika', location: '301-xona' },
  { day: 'Chorshanba', time: '09:00 - 10:30', subject: 'Ingliz tili', location: '101-xona' },
  { day: 'Chorshanba', time: '15:00 - 16:30', subject: 'Matematika', location: '301-xona' },
  { day: 'Juma', time: '09:00 - 10:30', subject: 'Ingliz tili', location: '101-xona' },
  { day: 'Juma', time: '15:00 - 16:30', subject: 'Matematika', location: '301-xona' }
]

// --- Generate 50 Sample Questions for Exam ---
const generateQuestions = () => {
  const questions = []
  for (let i = 1; i <= 50; i++) {
    questions.push({
      id: `ingliz-tili-q${i}`,
      text: `Ingliz tili bo'yicha test savoli #${i}?`,
      options: [
        `Ingliz tili - ${i} uchun javob A`,
        `Ingliz tili - ${i} uchun javob B`,
        `Ingliz tili - ${i} uchun javob C`,
        `Ingliz tili - ${i} uchun javob D`
      ],
      correctAnswer: Math.floor(Math.random() * 4), // 0-3 orasida to'g'ri javob
      selectedAnswer: null
    })
  }
  return questions
}

// --- Single Exam for the Student ---
const exam = ref({
  id: 'exam-1',
  title: 'Ingliz tili - Oraliq imtihon',
  description: 'Ingliz tili kursi bo\'yicha oraliq imtihon. Grammatika va leksika bo\'yicha 50 ta test savoli.',
  status: 'not-started',
  questions: generateQuestions(),
  startedAt: null
})

// --- Simulated Database (Added Exam) ---
const studentsDatabase = [
  {
    id: 1,
    name: 'Aliyev Ali',
    email: 'ali@example.com',
    password: 'password123',
    phone: '+998 90 123 45 67',
    address: 'Toshkent sh., Chilonzor tumani, 7-mavze, 42-uy',
    group: 'A1 guruhi',
    enrollmentDate: '2023-09-01',
    profilePictureUrl: null,
    courses: [
      { name: 'Ingliz tili (Boshlang\'ich)', teacher: 'Karimov Karim', schedule: 'Dsh, Ch, J 09:00-10:30', location: '101', progress: 65 },
      { name: 'Matematika', teacher: 'Toshmatov Jasur', schedule: 'Dsh, Ch, J 15:00-16:30', location: '301', progress: 78 }
    ],
    upcomingLessons: [
       { subject: 'Ingliz tili (Boshlang\'ich)', time: '09:00 - 10:30', location: '101-xona' },
       { subject: 'Matematika', time: '15:00 - 16:30', location: '301-xona' }
    ],
    assignments: [
      { title: 'Grammatika mashqlari', course: 'Ingliz tili', description: 'Present Simple/Continuous...', dueDate: '2025-04-15', status: 'completed' },
      { title: 'Reading topshirig\'i', course: 'Ingliz tili', description: 'Matnni o\'qib, savollarga javob...', dueDate: '2025-05-29', status: 'in-progress' },
      { title: 'Algebra masalalari', course: 'Matematika', description: '5-bob, 1-10 masalalar...', dueDate: '2025-05-18', status: 'not-started' }
    ],
    attendance: { total: 30, present: 27, absent: 3 },
    // --- Payment Data ---
    paymentMethods: [
      { id: 'card_1a', maskedNumber: '**** **** **** 1234', expiryDate: '12/25', type: 'UzCard', cardHolderName: 'ALIYEV ALI' },
      { id: 'card_1b', maskedNumber: '**** **** **** 5678', expiryDate: '06/26', type: 'Humo', cardHolderName: 'ALIYEV ALI' }
    ],
    paymentHistory: [
      { date: '2025-10-05', amount: 550000, method: 'UzCard **** 1234', status: 'Muvaffaqiyatli' },
      { date: '2025-09-05', amount: 550000, method: 'Humo **** 5678', status: 'Muvaffaqiyatli' },
    ]
  },
  {
    id: 2,
    name: 'Valiyeva Valida',
    email: 'valida@example.com',
    password: 'password456',
    phone: '+998 90 234 56 78',
    address: 'Toshkent sh., Yunusobod tumani, 12-mavze, 15-uy',
    group: 'A1 guruhi',
    enrollmentDate: '2023-09-01',
    profilePictureUrl: '/sample-avatar.jpg',
    courses: [
      { name: 'Ingliz tili (Boshlang\'ich)', teacher: 'Karimov Karim', schedule: 'Dsh, Ch, J 09:00-10:30', location: '101', progress: 70 }
    ],
    upcomingLessons: [
      { subject: 'Ingliz tili (Boshlang\'ich)', time: '09:00 - 10:30', location: '101-xona' }
    ],
    assignments: [
      { title: 'Grammatika mashqlari', course: 'Ingliz tili', description: 'Present Simple/Continuous...', dueDate: '2023-11-15', status: 'completed' },
      { title: 'Reading topshirig\'i', course: 'Ingliz tili', description: 'Matnni o\'qib, savollarga javob...', dueDate: '2023-11-20', status: 'not-started' }
    ],
    attendance: { total: 15, present: 14, absent: 1 },
    // --- Payment Data ---
    paymentMethods: [],
    paymentHistory: []
  }
]

// --- Methods ---
const login = () => {
  loginError.value = ''
  const student = studentsDatabase.find(
    s => s.email === email.value && s.password === password.value
  )

  if (student) {
    currentStudent.value = JSON.parse(JSON.stringify(student))
    profileImageUrl.value = currentStudent.value.profilePictureUrl
    isLoggedIn.value = true
    email.value = ''
    password.value = ''
    activeTab.value = 'dashboard'
    isEditingProfile.value = false
    resetPaymentState()
  } else {
    loginError.value = 'Email yoki parol noto\'g\'ri'
  }
}

const logout = () => {
  isLoggedIn.value = false
  currentStudent.value = null
  activeTab.value = 'dashboard'
  isEditingProfile.value = false
  profileImageUrl.value = null
  originalProfileData.value = null
  resetPaymentState()
  resetExamState()
}

const resetPaymentState = () => {
  showAddCardForm.value = false
  newCardNumber.value = ''
  newCardExpiry.value = ''
  newCardHolder.value = ''
  newCardType.value = 'UzCard'
  addCardError.value = ''
  paymentAmount.value = null
  selectedPaymentCardId.value = null
  paymentError.value = ''
  paymentSuccess.value = ''
}

const resetExamState = () => {
  activeExam.value = null
  currentQuestionIndex.value = 0
  examCompleted.value = false
  isReviewing.value = false
}

const viewNotifications = () => {
  alert('Bildirishnomalar ko\'rsatiladi (hozircha implement qilinmagan).')
}

// --- Profile Methods ---
const toggleEditProfile = () => {
  originalProfileData.value = {
    ...currentStudent.value,
    profilePictureUrl: profileImageUrl.value
  }
  isEditingProfile.value = true
}

const saveProfile = () => {
  const studentIndex = studentsDatabase.findIndex(s => s.id === currentStudent.value.id)
  if (studentIndex !== -1) {
    studentsDatabase[studentIndex].name = currentStudent.value.name
    studentsDatabase[studentIndex].phone = currentStudent.value.phone
    studentsDatabase[studentIndex].address = currentStudent.value.address
    studentsDatabase[studentIndex].profilePictureUrl = profileImageUrl.value
  }
  isEditingProfile.value = false
  originalProfileData.value = null
  alert('Profil muvaffaqiyatli saqlandi!')
}

const cancelEdit = () => {
  if (originalProfileData.value) {
    currentStudent.value.name = originalProfileData.value.name
    currentStudent.value.phone = originalProfileData.value.phone
    currentStudent.value.address = originalProfileData.value.address
    profileImageUrl.value = originalProfileData.value.profilePictureUrl
  }
  isEditingProfile.value = false
  originalProfileData.value = null
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImageUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    alert('Iltimos, rasm faylini tanlang.')
  }
}

// --- Payment Methods ---
const addCard = () => {
  addCardError.value = ''
  if (!newCardNumber.value || !newCardExpiry.value || !newCardHolder.value) {
    addCardError.value = 'Iltimos, barcha maydonlarni to\'ldiring.'
    return
  }
  const cardNumberCleaned = newCardNumber.value.replace(/\s/g, '')
  if (!/^\d{16}$/.test(cardNumberCleaned)) {
    addCardError.value = 'Karta raqami 16 ta raqamdan iborat bo\'lishi kerak.'
    return
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(newCardExpiry.value)) {
    addCardError.value = 'Amal qilish muddati OO/YY formatida bo\'lishi kerak.'
    return
  }

  const newCard = {
    id: `card_${currentStudent.value.id}_${Date.now()}`,
    maskedNumber: `**** **** **** ${cardNumberCleaned.slice(-4)}`,
    expiryDate: newCardExpiry.value,
    type: newCardType.value,
    cardHolderName: newCardHolder.value.toUpperCase()
  }

  currentStudent.value.paymentMethods.push(newCard)
  const studentIndex = studentsDatabase.findIndex(s => s.id === currentStudent.value.id)
  if (studentIndex !== -1) {
    studentsDatabase[studentIndex].paymentMethods.push(newCard)
  }

  newCardNumber.value = ''
  newCardExpiry.value = ''
  newCardHolder.value = ''
  newCardType.value = 'UzCard'
  showAddCardForm.value = false
  alert('Karta muvaffaqiyatli qo\'shildi!')
}

const removeCard = (cardId) => {
  if (confirm('Haqiqatan ham ushbu kartani o\'chirmoqchimisiz?')) {
    currentStudent.value.paymentMethods = currentStudent.value.paymentMethods.filter(card => card.id !== cardId)
    const studentIndex = studentsDatabase.findIndex(s => s.id === currentStudent.value.id)
    if (studentIndex !== -1) {
      studentsDatabase[studentIndex].paymentMethods = studentsDatabase[studentIndex].paymentMethods.filter(card => card.id !== cardId)
    }
    // If the removed card was selected for payment, reset selection
    if (selectedPaymentCardId.value === cardId) {
      selectedPaymentCardId.value = null
    }
  }
}

const initiatePayment = () => {
  paymentError.value = ''
  paymentSuccess.value = ''

  if (!paymentAmount.value || paymentAmount.value <= 0) {
    paymentError.value = 'Iltimos, to\'g\'ri summa kiriting.'
    return
  }
  if (!selectedPaymentCardId.value) {
    paymentError.value = 'Iltimos, to\'lov uchun kartani tanlang.'
    return
  }

  // Payment with selected card
  const selectedCard = currentStudent.value.paymentMethods.find(card => card.id === selectedPaymentCardId.value)
  if (!selectedCard) {
    paymentError.value = 'Tanlangan karta topilmadi.'
    return
  }
  const paymentMethodDescription = `${selectedCard.type} ${selectedCard.maskedNumber}`

  // Simulate payment processing...
  console.log(`Simulating payment of ${paymentAmount.value} via ${paymentMethodDescription}`)
  // Assume success for simulation
  addPaymentToHistory(paymentMethodDescription)
  paymentSuccess.value = `${paymentAmount.value.toLocaleString()} so'm ${paymentMethodDescription} orqali muvaffaqiyatli to'landi!`

  // Clear form after successful card payment
  paymentAmount.value = null
  selectedPaymentCardId.value = null
}

const addPaymentToHistory = (methodDesc) => {
  const newPayment = {
    date: new Date().toLocaleDateString('uz-UZ'),
    amount: paymentAmount.value,
    method: methodDesc,
    status: 'Muvaffaqiyatli'
  }

  currentStudent.value.paymentHistory.unshift(newPayment)
  const studentIndex = studentsDatabase.findIndex(s => s.id === currentStudent.value.id)
  if (studentIndex !== -1) {
    if (!studentsDatabase[studentIndex].paymentHistory) {
      studentsDatabase[studentIndex].paymentHistory = []
    }
    studentsDatabase[studentIndex].paymentHistory.unshift(newPayment)
  }
}

// --- Exam Methods ---
const startExam = () => {
  activeExam.value = JSON.parse(JSON.stringify(exam.value))
  currentQuestionIndex.value = 0
  examCompleted.value = false
  isReviewing.value = false
  
  // If exam is not started yet, mark it as in-progress
  if (exam.value.status === 'not-started') {
    exam.value.status = 'in-progress'
    exam.value.startedAt = new Date().toISOString().split('T')[0]
  }
}

const exitExam = () => {
  // Save progress before exiting
  saveExamProgress()
  activeExam.value = null
  currentQuestionIndex.value = 0
  examCompleted.value = false
  isReviewing.value = false
}

const saveExamProgress = () => {
  if (!activeExam.value) return
  
  // Update questions with selected answers
  activeExam.value.questions.forEach((question, index) => {
    if (question.selectedAnswer !== null) {
      exam.value.questions[index].selectedAnswer = question.selectedAnswer
    }
  })
  
  // Update exam status if completed
  if (examCompleted.value) {
    exam.value.status = 'completed'
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < activeExam.value.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const finishExam = () => {
  examCompleted.value = true
  activeExam.value.status = 'completed'
  saveExamProgress()
}

const reviewExam = () => {
  isReviewing.value = true
  currentQuestionIndex.value = 0
}

// --- Computed Properties ---
const currentQuestion = computed(() => {
  if (!activeExam.value || !activeExam.value.questions[currentQuestionIndex.value]) {
    return { text: '', options: [], selectedAnswer: null }
  }
  return activeExam.value.questions[currentQuestionIndex.value]
})

const calculateExamProgress = () => {
  if (!exam.value || !exam.value.questions || exam.value.questions.length === 0) return 0
  
  const answeredQuestions = exam.value.questions.filter(q => q.selectedAnswer !== null).length
  return Math.round((answeredQuestions / exam.value.questions.length) * 100)
}

const countCorrectAnswers = () => {
  if (!activeExam.value || !activeExam.value.questions) return 0
  
  return activeExam.value.questions.filter(q => q.selectedAnswer === q.correctAnswer).length
}

const calculateExamScore = () => {
  if (!activeExam.value || !activeExam.value.questions || activeExam.value.questions.length === 0) return 0
  
  const correctAnswers = countCorrectAnswers()
  return Math.round((correctAnswers / activeExam.value.questions.length) * 100)
}

const getExamStatusClass = (exam) => {
  if (exam.status === 'completed') return 'bg-green-100 text-green-800'
  if (exam.status === 'in-progress') return 'bg-yellow-100 text-yellow-800'
  return 'bg-blue-100 text-blue-800'
}

const getExamStatusText = (exam) => {
  if (exam.status === 'completed') return 'Yakunlangan'
  if (exam.status === 'in-progress') return 'Jarayonda'
  return 'Boshlanmagan'
}
</script>

<style>
/* Add placeholder images to your public folder if needed */
/* /public/placeholder-avatar.png */
/* /public/sample-avatar.jpg (if used) */

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
