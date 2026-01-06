
<template>
  <div class="messages-container">
    <!-- Header Section (Uniform Card Style) -->
    <div class="section-header-card minimal-header-card">
      <div class="section-header-content">
        <div class="section-header-left">
          <div class="section-header-icon minimal-header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div class="section-header-title minimal-header-title">Messages</div>
            <div class="section-header-sub minimal-header-sub">Chat with your enrolled teachers and view announcements</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter and Search -->
    <div class="controls-section">
      <div class="search-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search teachers or subjects..."
          class="search-input"
        />
      </div>
      <div class="filter-tabs">
        <button 
          :class="['filter-tab', { 'active': currentTab === 'teachers' }]"
          @click="currentTab = 'teachers'; showArchive = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          My Teachers
        </button>
        <button 
          :class="['filter-tab', { 'active': currentTab === 'archive' }]"
          @click="currentTab = 'archive'; showArchive = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
          Archive
          <span v-if="currentTab === 'archive'" class="archive-indicator">In Archive</span>
        </button>
        <button 
          :class="['filter-tab', { 'active': currentTab === 'notifications' }]"
          @click="currentTab = 'notifications'; showArchive = false"
        >
          Announcements
          <span v-if="unreadNotificationsCount > 0" class="notification-badge">{{ unreadNotificationsCount }}</span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="content-area">
      <!-- Teachers Tab -->
      <div v-if="currentTab === 'teachers' || currentTab === 'archive'" class="tab-content">

        <!-- Empty state when no deleted conversations -->
        <div v-if="filteredTeachers.length === 0 && !hasDeletedConversations" class="empty-state">
          <p>{{ showArchive ? 'No archived conversations' : 'No teachers found' }}</p>
          <span class="empty-subtext">{{ showArchive ? 'Archived conversations will appear here.' : 'Teachers from your enrolled subjects will appear here.' }}</span>
        </div>

        <!-- Show Available Teachers when conversations are deleted -->
        <div v-else-if="filteredTeachers.length === 0 && hasDeletedConversations" class="deleted-state">
          <div class="deleted-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <p>You deleted all conversations</p>
          <span class="deleted-subtext">Your enrolled teachers are still available. Click below to see them again.</span>
          <button @click="showAvailableTeachers" class="show-teachers-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Show Available Teachers
          </button>
        </div>

        <!-- Teachers Grid -->
        <div v-else class="teachers-grid">
          <div v-for="subject in groupedTeachers" :key="subject.id" class="subject-section">
            <div class="subject-section-header">
              <h3 class="subject-section-name">{{ subject.name }}</h3>
              <span class="subject-section-code">{{ subject.code }}</span>
            </div>
            
            <div class="teachers-cards">
              <div 
                v-for="teacher in subject.teachers" 
                :key="`${teacher.id}-${teacher.section_id}`"
                :class="['simple-teacher-card', { 'has-unread': teacher.unread_count > 0 }]"
                @click="startChatWithTeacher(teacher)"
              >
                <div class="simple-teacher-header">
                  <div class="simple-teacher-left">
                    <div class="simple-teacher-avatar">
                      <span>{{ teacher.teacher_name?.[0] || 'T' }}</span>
                    </div>
                    <div class="simple-teacher-info">
                      <h4 class="simple-teacher-name">{{ teacher.teacher_name }}</h4>
                      <p class="simple-teacher-email">{{ teacher.email || teacher.teacher_email }}</p>
                      <div v-if="teacherPresence[teacher.id]?.is_online" class="simple-presence-status">
                        <div class="simple-online-dot"></div>
                        <span>Online</span>
                      </div>
                    </div>
                  </div>
                  <div class="simple-teacher-right">
                    <div v-if="teacher.unread_count > 0" class="simple-unread-badge">{{ teacher.unread_count }}</div>
                    <div class="options-btn-dropdown-wrapper" style="position: relative; display: inline-block;">
                      <button 
                        class="simple-options-btn" 
                        @click.stop="toggleTeacherOptions(`${teacher.id}-${teacher.section_id}`)"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                        </svg>
                      </button>
                      <div v-if="activeTeacherOptionsId === `${teacher.id}-${teacher.section_id}`" class="simple-options-dropdown" @click.stop>
                        <button @click.stop="archiveConversation(teacher); activeTeacherOptionsId = null" class="simple-dropdown-item">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="21 8 21 21 3 21 3 8"></polyline>
                            <rect x="1" y="3" width="22" height="5"></rect>
                            <line x1="10" y1="12" x2="14" y2="12"></line>
                          </svg>
                          {{ teacher.archived ? 'Unarchive' : 'Archive' }}
                        </button>
                        <button @click.stop="deleteConversation(teacher); activeTeacherOptionsId = null" class="simple-dropdown-item delete-option">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="simple-teacher-body">
                  <p class="simple-last-message">{{ teacher.last_message || 'Start a conversation' }}</p>
                  <div class="simple-message-meta">
                    <span v-if="teacher.last_message_time || teacher.last_message_date" class="simple-message-time">{{ formatTime(teacher.last_message_time || teacher.last_message_date) }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="simple-chat-icon">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-else-if="currentTab === 'notifications'" class="tab-content">
        <div class="notifications-actions">
          <div class="notification-filters">
            <button 
              :class="['filter-btn', { 'active': currentFilter === 'all' }]"
              @click="currentFilter = 'all'"
            >
              All
            </button>
            <button 
              :class="['filter-btn', { 'active': currentFilter === 'unread' }]"
              @click="currentFilter = 'unread'"
            >
              Unread
            </button>
          </div>
          <button class="action-btn" @click="clearNotifications" v-if="unreadNotificationsCount > 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            Mark all read
          </button>
        </div>
        
        <!-- Loading State for Notifications -->
        <div v-if="isLoadingNotifications" class="loading-state">
          <div class="loading-spinner-small">
            <div class="spinner"></div>
          </div>
          <p>Loading notifications...</p>
        </div>
        
        <div v-else-if="Object.keys(groupedBroadcasts).length === 0" class="empty-state">
          <!-- empty-icon removed -->
          <p>No announcements found</p>
          <span class="empty-subtext">Class announcements and notifications will appear here.</span>
        </div>
        
        <div v-else class="notifications-grid">
          <div 
            v-for="(group, key) in groupedBroadcasts" 
            :key="key" 
            class="notification-card"
            @click="openBroadcastGroup(group)"
          >
            <div class="notification-card-header">
              <div class="notification-left">
                <div class="notification-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <div class="notification-info">
                  <h3 class="notification-title">{{ group.subject }}</h3>
                  <p class="notification-section">{{ group.section }}</p>
                </div>
              </div>
              <div class="notification-card-right">
                <span class="notification-count">{{ group.announcements.length }}</span>
                <span v-if="group.announcements.some(a => !a.is_read)" class="unread-dot"></span>
              </div>
            </div>
            <div class="notification-card-body">
              <div class="notification-meta">
                <span class="notification-teacher">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {{ group.teacher }}
                </span>
                <div class="notification-badges">
                  <span class="announcement-count">{{ group.announcements.length }} announcement{{ group.announcements.length > 1 ? 's' : '' }}</span>
                  <span 
                    v-if="group.announcements.some(a => a.has_attachments || (a.attachments && a.attachments.length > 0))" 
                    class="attachment-indicator"
                    title="Contains attachments"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    {{ group.announcements.reduce((total, a) => total + (a.attachments?.length || 0), 0) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Chat Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="simple-modal-content">
        <div class="simple-modal-header">
          <div class="simple-header-info">
            <div class="simple-teacher-avatar-chat">
              <span>{{ activeTeacher?.teacher_name?.[0] || 'T' }}</span>
            </div>
            <div class="simple-header-details">
              <h2 class="simple-modal-title">{{ activeTeacher?.teacher_name }}</h2>
              <span class="simple-teacher-label">Teacher</span>
            </div>
          </div>
          <div class="simple-header-actions">
            <button @click="refreshConversation" class="refresh-btn" :disabled="isRefreshingConversation" title="Refresh Conversation">
              <svg :class="{ 'spin': isRefreshingConversation }" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>
            <button @click="closeModal" class="simple-close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="simple-modal-body">
          <!-- Loading Messages -->
          <div v-if="isLoadingMessages" class="simple-loading-messages">
            <div class="simple-loading-spinner">
              <div class="simple-spinner"></div>
            </div>
            <p>Loading conversation...</p>
          </div>

          <!-- Messages Container -->
          <div v-else class="simple-messages-container" ref="messagesContainer">
            <div 
              v-for="message in currentMessages" 
              :key="message.id" 
              :class="['simple-message-bubble', { 'sent': message.sender_id === currentStudentId, 'received': message.sender_id !== currentStudentId }]"
            >
              <div v-if="message.attachments && message.attachments.length > 0" class="simple-message-attachments">
                <div v-for="(attachment, idx) in message.attachments" :key="idx" class="simple-attachment">
                  <img v-if="attachment.type === 'image'" :src="attachment.url" :alt="attachment.name" class="simple-attachment-image" @click="viewAttachment(attachment)" />
                  <div v-else class="simple-attachment-file" @click="downloadAttachment(attachment)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    <span>{{ attachment.name }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </div>
                </div>
              </div>
              
              <p v-if="message.content" class="simple-message-text">{{ message.content }}</p>
              
              <div class="simple-message-footer">
                <span class="simple-message-time">{{ formatTime(message.sent_at) }}</span>
                <span v-if="message.sender_id === currentStudentId" class="simple-message-status">
                  <svg v-if="!message.is_read" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                    <polyline points="20 6 9 17 4 12" transform="translate(4, 0)"></polyline>
                  </svg>
                </span>
              </div>
            </div>
            <div v-if="currentMessages.length === 0 && !isLoadingMessages" class="simple-no-messages">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="simple-no-messages-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        </div>
        <div class="simple-modal-footer">
          <div v-if="selectedFile" class="simple-file-preview">
            <div class="simple-preview-content">
              <img v-if="previewFile" :src="previewFile" alt="Preview" class="simple-preview-image" />
              <div v-else class="simple-preview-file">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span>{{ selectedFile.name }}</span>
              </div>
              <button @click="removeFile" class="simple-remove-file-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="simple-message-input-area">
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              style="display: none" 
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <button class="simple-attach-btn" @click="fileInput?.click()" :disabled="isSendingMessage">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            <input 
              type="text" 
              v-model="newMessage" 
              @keyup.enter="sendMessage" 
              placeholder="Type your message to your teacher..." 
              class="simple-message-input"
              :disabled="isSendingMessage"
            />
            <button class="simple-send-btn" @click="sendMessage" :disabled="(!newMessage.trim() && !selectedFile) || isSendingMessage">
              <svg v-if="!isSendingMessage" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15.46 22 11 13 2 9.54 22 2"></polygon>
              </svg>
              <div v-else class="simple-button-spinner"></div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Simple Broadcast Modal -->
    <div v-if="isBroadcastModalOpen" class="modal-overlay" @click.self="closeBroadcastModal">
      <div class="modal-content enhanced-simple-broadcast-modal">
        <!-- Enhanced Simple Header -->
        <div class="enhanced-simple-modal-header">
          <div class="enhanced-simple-header-left">
            <div class="enhanced-simple-subject-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <div class="enhanced-simple-header-info">
              <h2 class="enhanced-simple-modal-title">{{ selectedBroadcastGroup?.subject }}</h2>
              <div class="enhanced-simple-teacher-info">
                <div class="enhanced-teacher-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <path d="M9 22V12h6v10"/>
                  </svg>
                  <span>{{ selectedBroadcastGroup?.section }}</span>
                </div>
                <div class="enhanced-teacher-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{{ selectedBroadcastGroup?.teacher }}</span>
                </div>
              </div>
            </div>
          </div>
          <button @click="closeBroadcastModal" class="enhanced-simple-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Enhanced Simple Body -->
        <div class="enhanced-simple-modal-body">
          <!-- Enhanced Simple Announcement Count -->
          <div class="enhanced-simple-announcement-count">
            <div class="enhanced-count-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <span>{{ selectedBroadcastGroup?.announcements?.length || 0 }} Announcements</span>
          </div>

          <!-- Enhanced Simple Announcement List -->
          <div class="enhanced-simple-announcement-list">
            <div 
              v-for="announcement in selectedBroadcastGroup?.announcements || []" 
              :key="announcement.notification_id"
              :class="['enhanced-simple-announcement-item', { 'unread': !announcement.is_read }]"
              @click="openAnnouncementDetail(announcement)"
            >
              <div class="enhanced-simple-announcement-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="enhanced-simple-announcement-content">
                <div class="enhanced-announcement-header">
                  <div class="enhanced-announcement-title-section">
                    <h3 class="enhanced-simple-announcement-title">Class Announcement</h3>
                    <span v-if="!announcement.is_read" class="enhanced-new-badge">New</span>
                  </div>
                  <div class="enhanced-announcement-subtitle">{{ announcement.title }}</div>
                </div>
                <div class="enhanced-simple-announcement-footer">
                  <div class="enhanced-simple-announcement-date">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{{ formatTime(announcement.created_at) }}</span>
                  </div>
                  <div v-if="announcement.has_attachments || (announcement.attachments && announcement.attachments.length > 0)" class="enhanced-attachment-indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    <span>{{ announcement.attachments?.length || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Announcement Detail Modal -->
    <div v-if="isAnnouncementDetailOpen" class="modal-overlay" @click.self="closeAnnouncementDetail">
      <div class="modal-content simple-announcement-detail-modal">
        <!-- Simple Header -->
        <div class="simple-announcement-header">
          <div class="simple-announcement-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            CLASS ANNOUNCEMENT
          </div>
          <button @click="closeAnnouncementDetail" class="simple-header-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Simple Subject Info -->
        <div class="simple-subject-info">
          <div class="simple-subject-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            {{ selectedAnnouncement?.subject_name }}
          </div>
          <div class="simple-subject-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <path d="M9 22V12h6v10"/>
            </svg>
            {{ selectedAnnouncement?.section_name }}
          </div>
        </div>

        <!-- Simple Body -->
        <div class="simple-announcement-body">
          <div v-if="selectedAnnouncement" class="simple-announcement-content">
            <!-- Simple Title -->
            <h2 class="simple-announcement-title">Class Announcement</h2>

            <!-- Simple Meta Cards -->
            <div class="simple-meta-cards">
              <div class="simple-meta-card">
                <div class="simple-meta-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="simple-meta-content">
                  <span class="simple-meta-label">TEACHER</span>
                  <span class="simple-meta-value">{{ selectedAnnouncement.teacher_name }}</span>
                </div>
              </div>
              
              <div class="simple-meta-card">
                <div class="simple-meta-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="simple-meta-content">
                  <span class="simple-meta-label">POSTED ON</span>
                  <span class="simple-meta-value">{{ formatFullDate(selectedAnnouncement.created_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Simple Content Section -->
            <div class="simple-content-section">
              <div class="simple-content-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Announcement Content
              </div>
              <div class="simple-content-body">
                <h3 class="simple-content-title">{{ selectedAnnouncement.title }}</h3>
                <p class="simple-content-text">{{ selectedAnnouncement.body }}</p>
              </div>
            </div>

            <!-- Simple Attachments Section -->
            <div v-if="selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0" class="simple-attachments-section">
              <div class="simple-attachments-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
                Attachments ({{ selectedAnnouncement.attachments.length }})
              </div>
              <div class="simple-attachments-grid">
                <div 
                  v-for="(attachment, idx) in selectedAnnouncement.attachments" 
                  :key="idx" 
                  class="simple-attachment-item"
                >
                  <!-- Image Attachments -->
                  <div v-if="attachment.type === 'image'" class="simple-attachment-image-container">
                    <img 
                      :src="attachment.url" 
                      :alt="attachment.name" 
                      class="simple-attachment-image" 
                      @click="viewAttachment(attachment)"
                    />
                    <div class="simple-attachment-overlay">
                      <button @click="viewAttachment(attachment)" class="simple-view-btn">View</button>
                      <button @click="downloadAttachment(attachment)" class="simple-download-btn">Download</button>
                    </div>
                  </div>

                  <!-- File Attachments -->
                  <div v-else class="simple-attachment-file" @click="downloadAttachment(attachment)">
                    <div class="simple-file-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                        <polyline points="13 2 13 9 20 9"/>
                      </svg>
                    </div>
                    <div class="simple-file-info">
                      <span class="simple-file-name">{{ attachment.name }}</span>
                      <span class="simple-file-size">{{ formatFileSize(attachment.size) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Simple Footer -->
        <div class="simple-announcement-footer">
          <button @click="closeAnnouncementDetail" class="simple-close-announcement-btn">
            Close Announcement
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner-container">
          <div class="loading-spinner"></div>
        </div>
        <p class="loading-text">{{ loadingMessage }}</p>
        <p class="loading-subtext">Please wait a moment...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'StudentMessages' })
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

// Types
interface Teacher {
  id: string
  teacher_name: string
  teacher_email?: string
  email?: string
  subject_name: string
  subject_id: number
  section_id: string
  section_name: string
  section_code: string
  last_message_date?: string
  last_message_time?: string
  last_message?: string
  unread_count: number
  archived?: boolean
  full_name?: string
  name?: string
}

interface Subject {
  id: number
  name: string
  code: string
  teachers: Teacher[]
}

interface Attachment {
  name: string
  url: string
  type: string
  size: string | number
  path: string
  mimeType?: string
}

interface Notification {
  notification_id: string
  title: string
  body: string
  created_at: string
  is_read: boolean
  read_at?: string
  notification_type: string
  teacher_name: string
  subject_name: string
  section_name: string
  section_id: string
  has_attachments: boolean
  attachments: Attachment[]
}

interface BroadcastGroup {
  section: string
  subject: string
  teacher: string
  announcements: Notification[]
}

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  sent_at: string
  is_read: boolean
  read_at?: string
  attachments: Attachment[]
}

// Watch for route changes
const route = useRoute()
watch(() => route.fullPath, () => {
  loadEnrolledSubjectsAndTeachers()
})

// State management
const currentTab = ref('teachers')
const currentFilter = ref('all')
const searchQuery = ref('')
const selectedSubject = ref('')
const isModalOpen = ref(false)
const isBroadcastModalOpen = ref(false)
const isAnnouncementDetailOpen = ref(false)
const selectedAnnouncement = ref<Notification | null>(null)
const activeTeacher = ref<Teacher | null>(null)
const selectedBroadcastGroup = ref<BroadcastGroup | null>(null)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Loading states
const isLoading = ref(true)
const loadingMessage = ref('Loading messages...')
const isLoadingMessages = ref(false)
const isSendingMessage = ref(false)
const isRefreshingConversation = ref(false)

const activeTeacherOptionsId = ref(null)
const showArchive = ref(false)
const selectedFile = ref<File | null>(null)
const previewFile = ref<string | null>(null)
const deletedConversationKeys = ref<Set<string>>(new Set())

// Real-time subscriptions
let messageChannel: any = null
let presenceChannel: any = null
let enrollmentChannel: any = null

// Data
const enrolledSubjects = ref<any[]>([])
const enrolledTeachers = ref<Teacher[]>([])
const notifications = ref<Notification[]>([])
const currentMessages = ref<Message[]>([])
const currentUser = ref<any>(null)
const currentStudentId = ref<string | null>(null)
const teacherPresence = ref<Record<string, any>>({})

// ================================
// COMPUTED PROPERTIES
// ================================

const unreadNotificationsCount = computed(() => {
  return notifications.value.filter(n => !n.is_read).length
})

const hasDeletedConversations = computed(() => {
  return deletedConversationKeys.value.size > 0 && filteredTeachers.value.length === 0 && !showArchive.value
})

const filteredTeachers = computed(() => {
  let teachers = enrolledTeachers.value.filter(t => showArchive.value ? t.archived : !t.archived)
  
  if (selectedSubject.value) {
    teachers = teachers.filter(t => t.subject_id === parseInt(selectedSubject.value))
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    teachers = teachers.filter(t => 
      t.teacher_name.toLowerCase().includes(query) ||
      t.subject_name.toLowerCase().includes(query)
    )
  }
  
  return teachers
})

const groupedTeachers = computed((): Subject[] => {
  const subjects: Record<number, Subject> = {}
  
  filteredTeachers.value.forEach(teacher => {
    const subjectId = teacher.subject_id
    if (!subjects[subjectId]) {
      subjects[subjectId] = {
        id: subjectId,
        name: teacher.subject_name,
        code: teacher.section_code,
        teachers: []
      }
    }
    subjects[subjectId].teachers.push(teacher)
  })
  
  return Object.values(subjects)
})

const groupedBroadcasts = computed((): Record<string, BroadcastGroup> => {
  const groups: Record<string, BroadcastGroup> = {}
  let notifs = notifications.value
  
  if (currentFilter.value === 'unread') {
    notifs = notifs.filter(n => !n.is_read)
  }
  
  notifs.forEach(notif => {
    const key = `${notif.section_name}: ${notif.subject_name}`
    if (!groups[key]) {
      groups[key] = {
        section: notif.section_name,
        subject: notif.subject_name,
        teacher: notif.teacher_name,
        announcements: []
      }
    }
    groups[key].announcements.push(notif)
  })
  
  return groups
})

// ================================
// FILE UPLOAD FUNCTIONS (FIXED)
// ================================

const uploadFileToStorage = async (file, folder = 'message-attachments') => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`
    
    console.log('Uploading file:', filePath)
    
    // Upload to storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }
    
    console.log('Upload successful:', uploadData)
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath)
    
    const attachmentData = {
      path: filePath,
      url: urlData.publicUrl,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: file.size,
      mimeType: file.type
    }
    
    console.log('Attachment data:', attachmentData)
    return attachmentData
    
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

const saveMessageAttachments = async (messageId, attachments) => {
  try {
    if (!attachments || attachments.length === 0) {
      return []
    }

    const attachmentRecords = attachments.map(att => ({
      message_id: messageId,
      file_name: att.name,
      file_path: att.path,
      file_url: att.url,
      file_type: att.type,
      file_size: att.size,
      mime_type: att.mimeType
    }))
    
    console.log('Saving attachments to DB:', attachmentRecords)
    
    const { data, error } = await supabase
      .from('message_attachments')
      .insert(attachmentRecords)
      .select()
    
    if (error) {
      console.error('Error saving attachments:', error)
      throw error
    }
    
    console.log('Attachments saved successfully:', data)
    return data
  } catch (error) {
    console.error('Error saving message attachments:', error)
    throw error
  }
}

// ================================
// HANDLER METHODS
// ================================

const toggleTeacherOptions = (teacherId) => {
  activeTeacherOptionsId.value = activeTeacherOptionsId.value === teacherId ? null : teacherId
}

const archiveConversation = (teacher) => {
  enrolledTeachers.value = enrolledTeachers.value.map(t => 
    (t.id === teacher.id && t.section_id === teacher.section_id) 
      ? { ...t, archived: !t.archived } 
      : t
  )
  activeTeacherOptionsId.value = null
}

const deleteConversation = async (teacher) => {
  if (!confirm(`Are you sure you want to delete the conversation with Teacher: ${teacher.teacher_name}?\n\nNote: All messages will be permanently deleted, but you can still message this teacher again.`)) {
    return
  }
  
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('section_id', teacher.section_id)
      .or(`and(sender_id.eq.${currentStudentId.value},recipient_id.eq.${teacher.id}),and(sender_id.eq.${teacher.id},recipient_id.eq.${currentStudentId.value})`)
    
    if (error) throw error
    
    deletedConversationKeys.value.add(`${teacher.id}-${teacher.section_id}`)
    
    enrolledTeachers.value = enrolledTeachers.value.filter(t => 
      !(t.id === teacher.id && t.section_id === teacher.section_id)
    )
    activeTeacherOptionsId.value = null
    
    console.log('Conversation deleted. Teacher can be restored.')
    
  } catch (error) {
    console.error('Error deleting conversation:', error)
    alert('Failed to delete conversation. Please try again.')
  }
}

const showAvailableTeachers = () => {
  deletedConversationKeys.value.clear()
  loadEnrolledSubjectsAndTeachers()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  selectedFile.value = file
  
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        previewFile.value = e.target.result
      }
    }
    reader.readAsDataURL(file)
  } else {
    previewFile.value = null
  }
}

const removeFile = () => {
  selectedFile.value = null
  previewFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const viewAttachment = (attachment) => {
  window.open(attachment.url, '_blank')
}

const downloadAttachment = (attachment) => {
  const link = document.createElement('a')
  link.href = attachment.url
  link.download = attachment.name
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const openBroadcastGroup = async (group: BroadcastGroup) => {
  selectedBroadcastGroup.value = group
  
  console.log('Opening broadcast group:', group)
  
  // Load attachments for announcements that don't have them loaded yet
  for (const announcement of group.announcements) {
    if (!announcement.attachments || announcement.attachments.length === 0) {
      console.log('Loading attachments for announcement:', announcement.notification_id)
      try {
        const { data: attachments, error } = await supabase
          .from('message_attachments')
          .select('*')
          .eq('message_id', announcement.notification_id)
        
        if (error) {
          console.warn('Error loading attachments for announcement:', error)
        } else if (attachments && attachments.length > 0) {
          announcement.attachments = attachments.map(att => ({
            name: att.file_name,
            url: att.file_url,
            type: att.file_type,
            size: att.file_size || 'Unknown size',
            path: att.file_path,
            mimeType: att.mime_type
          }))
          announcement.has_attachments = true
          console.log('Loaded attachments for announcement:', announcement.attachments)
        } else {
          announcement.attachments = []
          announcement.has_attachments = false
        }
      } catch (error) {
        console.warn('Error loading attachments for announcement (table might not exist):', error)
        announcement.attachments = []
        announcement.has_attachments = false
      }
    }
  }
  
  isBroadcastModalOpen.value = true
}

const closeBroadcastModal = () => {
  isBroadcastModalOpen.value = false
  selectedBroadcastGroup.value = null
}

const openAnnouncementDetail = async (announcement: Notification) => {
  selectedAnnouncement.value = announcement
  await loadAnnouncementAttachments(announcement.notification_id)
  await markBroadcastAsRead(announcement)
  isAnnouncementDetailOpen.value = true
}

const closeAnnouncementDetail = () => {
  isAnnouncementDetailOpen.value = false
  selectedAnnouncement.value = null
}

const loadAnnouncementAttachments = async (messageId: string) => {
  try {
    if (!selectedAnnouncement.value) return
    
    console.log('Loading attachments for announcement:', messageId)
    
    const { data: attachments, error } = await supabase
      .from('message_attachments')
      .select('*')
      .eq('message_id', messageId)
    
    if (error) {
      console.warn('Error loading announcement attachments:', error)
      selectedAnnouncement.value.attachments = []
      selectedAnnouncement.value.has_attachments = false
      return
    }
    
    if (attachments && attachments.length > 0) {
      selectedAnnouncement.value.attachments = attachments.map(att => ({
        name: att.file_name,
        url: att.file_url,
        type: att.file_type,
        size: att.file_size || 'Unknown size',
        path: att.file_path,
        mimeType: att.mime_type
      }))
      selectedAnnouncement.value.has_attachments = true
      console.log('Loaded attachments for announcement:', selectedAnnouncement.value.attachments)
    } else {
      selectedAnnouncement.value.attachments = []
      selectedAnnouncement.value.has_attachments = false
      console.log('No attachments found for announcement:', messageId)
    }
  } catch (err) {
    console.warn('Error loading announcement attachments (table might not exist):', err)
    if (selectedAnnouncement.value) {
      selectedAnnouncement.value.attachments = []
      selectedAnnouncement.value.has_attachments = false
    }
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatFullDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const markBroadcastAsRead = async (announcement: Notification) => {
  if (announcement.is_read) return
  
  try {
    if (!currentStudentId.value) return
    
    console.log('Marking broadcast as read:', announcement.notification_id, 'for student:', currentStudentId.value)
    
    // Insert into message_reads table to track that this student has read this message
    const { error } = await supabase
      .from('message_reads')
      .insert({
        message_id: announcement.notification_id,
        reader_id: currentStudentId.value
      })
    
    if (error && !error.message?.includes('duplicate key')) {
      throw error
    }
    
    // Update local state
    announcement.is_read = true
    announcement.read_at = new Date().toISOString()
    
    // Update in notifications array
    const notificationIndex = notifications.value.findIndex(n => n.notification_id === announcement.notification_id)
    if (notificationIndex !== -1) {
      notifications.value[notificationIndex].is_read = true
      notifications.value[notificationIndex].read_at = announcement.read_at
    }
    
    // Update in broadcast group if open
    if (selectedBroadcastGroup.value) {
      const groupAnnouncement = selectedBroadcastGroup.value.announcements.find(a => a.notification_id === announcement.notification_id)
      if (groupAnnouncement) {
        groupAnnouncement.is_read = true
        groupAnnouncement.read_at = announcement.read_at
      }
    }
    
    console.log('Broadcast marked as read successfully:', announcement.notification_id)
    
  } catch (error) {
    console.error('Error marking broadcast as read:', error)
  }
}

const handleClickOutside = (event) => {
  const optionsDropdown = event.target.closest('.simple-options-dropdown')
  const optionsBtn = event.target.closest('.simple-options-btn')
  
  if (!optionsDropdown && !optionsBtn) {
    activeTeacherOptionsId.value = null
  }
}

// ================================
// AUTHENTICATION METHODS
// ================================

const getCurrentUser = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    
    if (!user) {
      console.error('No authenticated user found')
      return null
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, auth_user_id, role, full_name, email')
      .eq('auth_user_id', user.id)
      .single()
    
    if (profileError) throw profileError
    
    if (!profile || profile.role !== 'student') {
      console.error('User is not a student or profile not found')
      return null
    }
    
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('profile_id', profile.id)
      .single()
    
    if (studentError) throw studentError
    
    currentUser.value = user
    currentStudentId.value = studentData.id
    
    console.log('Student authenticated:', profile.full_name)
    console.log('Student ID:', studentData.id)
    
    return { authUser: user, studentId: studentData.id, profile: profile }
    
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// ================================
// DATA LOADING METHODS
// ================================

const fetchMessages = async () => {
  try {
    if (!currentStudentId.value) {
      console.log('⚠️ No student ID available')
      enrolledSubjects.value = []
      enrolledTeachers.value = []
      notifications.value = []
      isLoading.value = false
      return
    }
    
    console.log('📧 Fetching messages for student:', currentStudentId.value)
    isLoading.value = true
    loadingMessage.value = 'Loading your messages...'
    
    // ============================================
    // FETCH TEACHERS AND NOTIFICATIONS IN PARALLEL
    // ============================================
    const [teachersData, notificationsData] = await Promise.all([
      // Fetch Teachers
      (async () => {
        const { data: enrollments, error: enrollError } = await supabase
          .from('enrollments')
          .select('section_id')
          .eq('student_id', currentStudentId.value)
          .eq('status', 'active')
        
        if (enrollError) {
          console.error('Error fetching enrollments:', enrollError)
          return { subjects: [], teachers: [] }
        }
        
        if (!enrollments || enrollments.length === 0) {
          console.log('No enrollments found for this student')
          return { subjects: [], teachers: [] }
        }
        
        const sectionIds = enrollments.map(e => e.section_id)
        
        const { data: sections, error: sectionsError } = await supabase
          .from('sections')
          .select('id, name, section_code, subject_id')
          .in('id', sectionIds)
        
        if (sectionsError || !sections || sections.length === 0) {
          return { subjects: [], teachers: [] }
        }
        
        const subjectIds = [...new Set(sections.map(s => s.subject_id))]
        const { data: subjects } = await supabase
          .from('subjects')
          .select('id, name, teacher_id')
          .in('id', subjectIds)
        
        const teacherIds = [...new Set(subjects?.map(s => s.teacher_id) || [])]
        const { data: teachers } = await supabase
          .from('teachers')
          .select('id, full_name, email')
          .in('id', teacherIds)
        
        const processedSubjects = []
        const processedTeachers = []
        const subjectMap = new Map()
        
        const subjectsDataMap = new Map(subjects?.map(s => [s.id, s]) || [])
        const teachersDataMap = new Map(teachers?.map(t => [t.id, t]) || [])
        
        for (const section of sections) {
          const subject = subjectsDataMap.get(section.subject_id)
          if (!subject) continue
          
          const teacher = teachersDataMap.get(subject.teacher_id)
          if (!teacher) continue
          
          if (!subjectMap.has(subject.id)) {
            processedSubjects.push({
              id: subject.id,
              name: subject.name,
              code: section.section_code
            })
            subjectMap.set(subject.id, true)
          }
          
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('section_id', section.id)
            .eq('sender_id', teacher.id)
            .eq('recipient_id', currentStudentId.value)
            .eq('message_type', 'direct')
            .eq('is_read', false)
          
          const { data: lastMsgData } = await supabase
            .from('messages')
            .select('message_text, sent_at')
            .eq('section_id', section.id)
            .or(`and(sender_id.eq.${currentStudentId.value},recipient_id.eq.${teacher.id}),and(sender_id.eq.${teacher.id},recipient_id.eq.${currentStudentId.value})`)
            .eq('message_type', 'direct')
            .order('sent_at', { ascending: false })
            .limit(1)
          
          const lastMsg = lastMsgData && lastMsgData.length > 0 ? lastMsgData[0] : null
          
          processedTeachers.push({
            id: teacher.id,
            teacher_name: teacher.full_name,
            email: teacher.email,
            subject_id: subject.id,
            subject_name: subject.name,
            section_id: section.id,
            section_name: section.name,
            section_code: section.section_code,
            unread_count: unreadCount || 0,
            last_message: lastMsg?.message_text || null,
            last_message_time: lastMsg?.sent_at || null,
            name: teacher.full_name,
            archived: false
          })
        }
        
        return { subjects: processedSubjects, teachers: processedTeachers }
      })(),
      
      // Fetch Notifications
      (async () => {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('section_id')
          .eq('student_id', currentStudentId.value)
          .eq('status', 'active')
        
        if (!enrollments || enrollments.length === 0) {
          return []
        }
        
        const sectionIds = enrollments.map(e => e.section_id)
        
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .in('section_id', sectionIds)
          .eq('message_type', 'announcement')
          .is('recipient_id', null)
          .order('sent_at', { ascending: false })
        
        if (error || !messages || messages.length === 0) {
          return []
        }
        
        const messageIds = messages.map(m => m.id)
        let attachmentsMap: Record<string, any[]> = {}
        
        try {
          const { data: attachments } = await supabase
            .from('message_attachments')
            .select('*')
            .in('message_id', messageIds)
          
          if (attachments) {
            attachments.forEach(att => {
              if (!attachmentsMap[att.message_id]) {
                attachmentsMap[att.message_id] = []
              }
              attachmentsMap[att.message_id].push({
                name: att.file_name,
                url: att.file_url,
                type: att.file_type,
                size: att.file_size || 'Unknown size',
                path: att.file_path,
                mimeType: att.mime_type
              })
            })
          }
        } catch (attachError) {
          console.warn('Error loading attachments:', attachError)
        }
        
        const { data: sections } = await supabase
          .from('sections')
          .select('id, name, subject_id')
          .in('id', sectionIds)
        
        const sectionMap = new Map(sections?.map(s => [s.id, s]) || [])
        
        const subjectIds = [...new Set(sections?.map(s => s.subject_id) || [])]
        const { data: subjects } = await supabase
          .from('subjects')
          .select('id, name')
          .in('id', subjectIds)
        
        const subjectMap = new Map(subjects?.map(s => [s.id, s]) || [])
        
        const senderIds = [...new Set(messages.map(m => m.sender_id))]
        const { data: senders } = await supabase
          .from('teachers')
          .select('id, full_name')
          .in('id', senderIds)
        
        const senderMap = new Map(senders?.map(s => [s.id, s]) || [])
        
        const { data: messageReads } = await supabase
          .from('message_reads')
          .select('message_id, read_at')
          .eq('reader_id', currentStudentId.value)
          .in('message_id', messageIds)
        
        const readMap = new Map(messageReads?.map(mr => [mr.message_id, mr.read_at]) || [])
        
        return messages.map(msg => {
          const section = sectionMap.get(msg.section_id)
          const subject = section ? subjectMap.get(section.subject_id) : null
          const sender = senderMap.get(msg.sender_id)
          const messageAttachments = attachmentsMap[msg.id] || []
          const isRead = readMap.has(msg.id)
          
          return {
            notification_id: msg.id,
            title: 'Class Announcement',
            body: msg.message_text,
            created_at: msg.sent_at,
            is_read: isRead,
            read_at: readMap.get(msg.id),
            notification_type: 'announcement',
            teacher_name: sender?.full_name || 'Unknown Teacher',
            subject_name: subject?.name || 'Unknown Subject',
            section_name: section?.name || 'Unknown Section',
            section_id: msg.section_id,
            has_attachments: messageAttachments.length > 0,
            attachments: messageAttachments
          }
        })
      })()
    ])
    
    // Update state
    enrolledSubjects.value = teachersData.subjects
    enrolledTeachers.value = teachersData.teachers
    notifications.value = notificationsData
    
    console.log('✓ Messages loaded:', {
      subjects: teachersData.subjects.length,
      teachers: teachersData.teachers.length,
      notifications: notificationsData.length
    })
    
  } catch (error) {
    console.error('❌ Error fetching messages:', error)
  } finally {
    isLoading.value = false
  }
}

// Keep these for backward compatibility (they now just call fetchMessages)
const loadEnrolledSubjectsAndTeachers = async () => {
  await fetchMessages()
}

const loadNotifications = async () => {
  // This now just calls fetchMessages() which loads everything
  await fetchMessages()
}

// ================================
// CHAT METHODS
// ================================

const startChatWithTeacher = async (teacher) => {
  console.log('Starting chat with teacher:', teacher)
  
  activeTeacher.value = {
    ...teacher,
    id: teacher.id,
    teacher_name: teacher.teacher_name,
    subject_name: teacher.subject_name,
    section_id: teacher.section_id
  }
  
  isModalOpen.value = true
  await nextTick()
  
  await loadConversationMessages(teacher.id, teacher.section_id)
  
  await nextTick()
  scrollToBottom()
}

const loadConversationMessages = async (teacherId, sectionId) => {
  try {
    if (!currentStudentId.value) return
    
    console.log('Loading messages between student and teacher:', { 
      studentId: currentStudentId.value, 
      teacherId, 
      sectionId 
    })
    
    isLoadingMessages.value = true
    currentMessages.value = []
    
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('section_id', sectionId)
      .eq('message_type', 'direct')
      .or(`and(sender_id.eq.${currentStudentId.value},recipient_id.eq.${teacherId}),and(sender_id.eq.${teacherId},recipient_id.eq.${currentStudentId.value})`)
      .order('sent_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching messages:', error)
      throw error
    }
    
    console.log('Raw messages from database:', messages)
    
    if (!messages || messages.length === 0) {
      console.log('No messages found in database')
      currentMessages.value = []
      isLoadingMessages.value = false
      return
    }
    
    const messageIds = messages.map(m => m.id)
    const { data: attachments } = await supabase
      .from('message_attachments')
      .select('*')
      .in('message_id', messageIds)
    
    const attachmentsMap = {}
    if (attachments) {
      attachments.forEach(att => {
        if (!attachmentsMap[att.message_id]) {
          attachmentsMap[att.message_id] = []
        }
        attachmentsMap[att.message_id].push({
          name: att.file_name,
          url: att.file_url,
          type: att.file_type,
          size: att.file_size,
          path: att.file_path
        })
      })
    }
    
    currentMessages.value = messages.map(msg => ({
      id: msg.id,
      sender_id: msg.sender_id,
      recipient_id: msg.recipient_id,
      content: msg.message_text,
      sent_at: msg.sent_at,
      is_read: msg.is_read,
      read_at: msg.read_at,
      message_type: 'direct',
      attachments: attachmentsMap[msg.id] || []
    }))
    
    console.log('Processed messages with attachments:', currentMessages.value)
    
    await nextTick()
    await markMessagesAsRead(teacherId, sectionId)
    
  } catch (error) {
    console.error('Error loading conversation messages:', error)
    currentMessages.value = []
  } finally {
    isLoadingMessages.value = false
  }
}

// ================================
// SEND MESSAGE FUNCTION (FIXED)
// ================================

const sendMessage = async () => {
  // Validate input
  if ((!newMessage.value.trim() && !selectedFile.value) || !activeTeacher.value || !currentStudentId.value) {
    return
  }
  
  if (isSendingMessage.value) {
    console.warn('Already sending message, please wait...')
    return
  }

  const messageText = newMessage.value.trim()
  const fileToUpload = selectedFile.value

  try {
    isSendingMessage.value = true
    
    // Create temporary UI message
    const tempMessage = {
      id: 'temp-' + Date.now(),
      sender_id: currentStudentId.value,
      recipient_id: activeTeacher.value.id,
      content: messageText || '📎 Attachment',
      sent_at: new Date().toISOString(),
      is_read: false,
      read_at: null,
      message_type: 'direct',
      attachments: []
    }
    
    currentMessages.value.push(tempMessage)
    newMessage.value = ''
    
    // Clear file input immediately
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    removeFile()
    
    await nextTick()
    scrollToBottom()

    let uploadedAttachment: Attachment | null = null
    
    // Step 1: Upload file if present
    if (fileToUpload) {
      try {
        console.log('Starting file upload...')
        uploadedAttachment = await uploadFileToStorage(fileToUpload)
        console.log('File uploaded successfully')
      } catch (uploadError) {
        console.error('File upload failed:', uploadError)
        // Remove temp message on upload failure
        const tempIndex = currentMessages.value.findIndex(m => m.id === tempMessage.id)
        if (tempIndex !== -1) {
          currentMessages.value.splice(tempIndex, 1)
        }
        throw new Error(`Failed to upload file: ${uploadError.message}`)
      }
    }

    // Step 2: Save message to database
    console.log('Saving message to database...')
    const { data: newMsg, error: sendError } = await supabase
      .from('messages')
      .insert({
        section_id: activeTeacher.value.section_id,
        sender_id: currentStudentId.value,
        recipient_id: activeTeacher.value.id,
        message_text: messageText || '📎 Attachment',
        message_type: 'direct',
        is_read: false
      })
      .select()
      .single()

    if (sendError) {
      throw sendError
    }

    console.log('Message saved:', newMsg)

    // Step 3: Save attachments to database if file was uploaded
    if (uploadedAttachment) {
      try {
        console.log('Saving attachment to database...')
        await saveMessageAttachments(newMsg.id, [uploadedAttachment])
      } catch (attachError) {
        console.error('Warning: Attachment data not saved:', attachError)
        // Message was sent, but attachment record failed
        // This is acceptable - the file is still accessible via URL
      }
    }

    // Step 4: Update UI with real message
    const tempIndex = currentMessages.value.findIndex(m => m.id === tempMessage.id)
    if (tempIndex !== -1) {
      currentMessages.value[tempIndex] = {
        id: newMsg.id,
        sender_id: newMsg.sender_id,
        recipient_id: newMsg.recipient_id,
        content: newMsg.message_text,
        sent_at: newMsg.sent_at,
        is_read: newMsg.is_read,
        read_at: newMsg.read_at,
        message_type: newMsg.message_type,
        attachments: uploadedAttachment ? [{
          name: uploadedAttachment.name,
          url: uploadedAttachment.url,
          type: uploadedAttachment.type,
          size: uploadedAttachment.size,
          path: uploadedAttachment.path,
          mimeType: uploadedAttachment.mimeType
        }] : []
      }
    }

    console.log('Message sent successfully!')
    
    // Refresh teacher list
    await loadEnrolledSubjectsAndTeachers()

  } catch (error) {
    console.error('Failed to send message:', error)
    
    // Remove temp message on error
    const tempIndex = currentMessages.value.findIndex(m => m.id === 'temp-' + Date.now())
    if (tempIndex !== -1) {
      currentMessages.value.splice(tempIndex, 1)
    }
    
    // Show user-friendly error
    const errorMsg = error instanceof Error ? error.message : 'Failed to send message'
    alert(`Error: ${errorMsg}\n\nPlease try again.`)
  } finally {
    isSendingMessage.value = false
    console.log('Send message completed, isSendingMessage set to false')
  }
}

const markMessagesAsRead = async (teacherId, sectionId) => {
  try {
    if (!currentStudentId.value) return
    
    console.log('Marking messages as read:', { teacherId, sectionId })
    
    const { data: updatedMessages, error } = await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('section_id', sectionId)
      .eq('sender_id', teacherId)
      .eq('recipient_id', currentStudentId.value)
      .eq('message_type', 'direct')
      .eq('is_read', false)
      .select()
    
    if (error) throw error
    
    console.log('Database updated, affected rows:', updatedMessages?.length || 0)
    
    currentMessages.value.forEach(m => {
      if (m.sender_id === teacherId && !m.is_read) {
        m.is_read = true
        m.read_at = new Date().toISOString()
      }
    })
    
    const teacherIndex = enrolledTeachers.value.findIndex(t => 
      t.id === teacherId && t.section_id === sectionId
    )
    if (teacherIndex !== -1) {
      enrolledTeachers.value = enrolledTeachers.value.map((teacher, index) => {
        if (index === teacherIndex) {
          console.log(`Immediately reset unread count to 0 for teacher ${teacher.teacher_name}`)
          return { ...teacher, unread_count: 0 }
        }
        return teacher
      })
    }
    
    console.log('Messages marked as read and UI updated')
    
  } catch (error) {
    console.error('Error marking messages as read:', error)
  }
}

const closeModal = () => {
  isModalOpen.value = false
  activeTeacher.value = null
  currentMessages.value = []
  removeFile()
}

const clearNotifications = async () => {
  try {
    if (!currentStudentId.value) return
    
    console.log('Marking all notifications as read')
    
    const unreadIds = notifications.value
      .filter(n => !n.is_read)
      .map(n => n.notification_id)
    
    if (unreadIds.length === 0) return
    
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .in('id', unreadIds)
    
    if (error) throw error
    
    notifications.value.forEach(n => {
      n.is_read = true
    })
    
  } catch (error) {
    console.error('Error clearing notifications:', error)
  }
}

// ================================
// REAL-TIME METHODS
// ================================

const setupRealTimeSubscriptions = () => {
  if (!currentStudentId.value) return
  
  console.log('🔔 Setting up real-time subscriptions for student messages')
  
  messageChannel = supabase
    .channel('student-messages-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      async (payload) => {
        console.log('📨 New message received:', payload.new)
        
        const newMessageData = payload.new
        
        // If it's an announcement, refresh all messages
        if (newMessageData.message_type === 'announcement') {
          console.log('📢 New announcement - refreshing...')
          setTimeout(async () => await fetchMessages(), 500)
          return
        }
        
        // If it's a direct message to this student
        if (newMessageData.recipient_id === currentStudentId.value && 
            newMessageData.message_type === 'direct') {
          
          // Refresh the messages list to update unread counts
          setTimeout(async () => await fetchMessages(), 500)
          
          if (isModalOpen.value && 
              activeTeacher.value && 
              newMessageData.section_id === activeTeacher.value.section_id &&
              newMessageData.sender_id === activeTeacher.value.id) {
            
            const { data: attachments } = await supabase
              .from('message_attachments')
              .select('*')
              .eq('message_id', newMessageData.id)
            
            const processedAttachments = attachments ? attachments.map(att => ({
              name: att.file_name,
              url: att.file_url,
              type: att.file_type,
              size: att.file_size,
              path: att.file_path
            })) : []
            
            console.log('Loaded attachments for new message:', processedAttachments)
            
            currentMessages.value.push({
              id: newMessageData.id,
              sender_id: newMessageData.sender_id,
              recipient_id: newMessageData.recipient_id,
              content: newMessageData.message_text,
              sent_at: newMessageData.sent_at,
              is_read: newMessageData.is_read,
              read_at: newMessageData.read_at,
              message_type: newMessageData.message_type,
              attachments: processedAttachments
            })
            
            console.log('Message added with attachments:', processedAttachments)
            
            await nextTick()
            scrollToBottom()
            
            await markMessagesAsRead(newMessageData.sender_id, newMessageData.section_id)
          }
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages'
      },
      async (payload) => {
        console.log('Message updated:', payload.new)
        
        if (isModalOpen.value && activeTeacher.value) {
          const messageIndex = currentMessages.value.findIndex(m => m.id === payload.new.id)
          if (messageIndex !== -1) {
            currentMessages.value[messageIndex].is_read = payload.new.is_read
            currentMessages.value[messageIndex].read_at = payload.new.read_at
          }
        }
        
        // Refresh messages to update unread counts
        setTimeout(async () => await fetchMessages(), 500)
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'messages'
      },
      async (payload) => {
        console.log('🗑️ Message deleted:', payload.old)
        
        // If a message was deleted, refresh the message list
        setTimeout(async () => await fetchMessages(), 500)
        
        // If viewing the conversation, remove the message from current view
        if (isModalOpen.value && activeTeacher.value) {
          const messageIndex = currentMessages.value.findIndex(m => m.id === payload.old.id)
          if (messageIndex !== -1) {
            currentMessages.value.splice(messageIndex, 1)
          }
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'message_attachments'
      },
      async (payload) => {
        console.log('New attachment received:', payload.new)
        
        if (isModalOpen.value && activeTeacher.value) {
          const messageIndex = currentMessages.value.findIndex(m => m.id === payload.new.message_id)
          if (messageIndex !== -1) {
            const newAttachment = {
              name: payload.new.file_name,
              url: payload.new.file_url,
              type: payload.new.file_type,
              size: payload.new.file_size,
              path: payload.new.file_path
            }
            
            if (!currentMessages.value[messageIndex].attachments) {
              currentMessages.value[messageIndex].attachments = []
            }
            
            currentMessages.value[messageIndex].attachments.push(newAttachment)
            console.log('Attachment added to message:', newAttachment)
          }
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'message_reads'
      },
      async (payload) => {
        console.log('📖 Message marked as read:', payload.new)
        
        // Refresh to update unread counts
        setTimeout(async () => await fetchMessages(), 500)
      }
    )
    .subscribe()

  // ================================
  // ENROLLMENT SUBSCRIPTION
  // ================================
  
  console.log('🔔 Setting up enrollment subscription for Messages')
  enrollmentChannel = supabase
    .channel('student-messages-enrollment')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'enrollments',
        filter: `student_id=eq.${currentStudentId.value}`
      }, 
      async (payload) => {
        console.log('📢 Messages: Enrollment change detected:', payload)
        
        const { eventType, new: newRecord, old: oldRecord } = payload
        
        if (eventType === 'DELETE' || 
           (eventType === 'UPDATE' && newRecord?.status !== 'active') ||
           (eventType === 'UPDATE' && oldRecord?.status === 'active' && newRecord?.status !== 'active')) {
          
          console.log('👋 Messages: Student was unenrolled, refreshing available teachers...')
          
          // Close any open conversations if they're no longer available
          if (activeTeacher.value && isModalOpen.value) {
            // Check if the conversation is still valid
            setTimeout(async () => {
              const stillEnrolled = await checkIfStillEnrolled(activeTeacher.value.id, activeTeacher.value.section_id)
              if (!stillEnrolled) {
                console.log('🚪 Closing conversation - no longer enrolled')
                closeModal()
              }
            }, 500)
          }
          
          // Refresh the teacher/subject list
          setTimeout(async () => {
            await fetchMessages()
          }, 500)
          
        } else if (eventType === 'INSERT' && newRecord?.status === 'active') {
          console.log('🎉 Messages: New enrollment detected, refreshing available teachers...')
          
          setTimeout(async () => {
            await fetchMessages()
          }, 500)
        }
      }
    )
    .subscribe()
}

const cleanupRealTimeSubscriptions = () => {
  if (messageChannel) {
    messageChannel.unsubscribe()
    messageChannel = null
  }
  if (enrollmentChannel) {
    enrollmentChannel.unsubscribe()
    enrollmentChannel = null
  }
}

// ================================
// ENROLLMENT CHECK HELPER
// ================================

const checkIfStillEnrolled = async (teacherId, sectionId) => {
  if (!currentStudentId.value) return false
  
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', currentStudentId.value)
      .eq('section_id', sectionId)
      .eq('status', 'active')
      .limit(1)

    if (error) {
      console.error('❌ Error checking enrollment:', error)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error('❌ Error in checkIfStillEnrolled:', error)
    return false
  }
}

// ================================
// UTILITY METHODS
// ================================

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

// ================================
// PRESENCE STATUS METHODS
// ================================

const getPresenceStatus = (teacherId) => {
  const presence = teacherPresence.value[teacherId]
  if (!presence || !presence.last_seen) return 'Offline'
  
  if (presence.is_online) {
    return 'Online now'
  }
  
  const now = new Date()
  const lastSeen = new Date(presence.last_seen)
  const diffMs = now.getTime() - lastSeen.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) {
    return 'Online now'
  } else if (diffMinutes < 60) {
    return `Offline for ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
  } else if (diffHours < 24) {
    return `Offline for ${diffHours} hour${diffHours > 1 ? 's' : ''}`
  } else if (diffDays === 1) {
    return 'Offline for a day'
  } else if (diffDays < 7) {
    return `Offline for ${diffDays} days`
  } else {
    return 'Offline for a while'
  }
}

const setupPresenceTracking = async () => {
  if (!currentStudentId.value) return
  
  const teacherIds = [...new Set(enrolledTeachers.value.map(t => t.id))]
  
  if (teacherIds.length === 0) return
  
  const { data: presenceData, error } = await supabase
    .from('user_presence')
    .select('*')
    .in('user_id', teacherIds)
  
  if (error) {
    console.error('Error fetching teacher presence:', error)
    return
  }
  
  if (presenceData) {
    presenceData.forEach(p => {
      teacherPresence.value[p.user_id] = {
        is_online: p.is_online,
        last_seen: p.last_seen
      }
    })
  }
  
  presenceChannel = supabase
    .channel('teacher-presence-tracking')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_presence',
        filter: `user_id=in.(${teacherIds.join(',')})`
      },
      (payload) => {
        console.log('Presence update received:', payload)
        
        const userId = (payload.new as { user_id?: string })?.user_id || (payload.old as { user_id?: string })?.user_id
        
        if (payload.eventType === 'DELETE') {
          if (userId && teacherPresence.value[userId]) {
            teacherPresence.value[userId].is_online = false
          }
        } else if (payload.new && userId) {
          teacherPresence.value[userId] = {
            is_online: payload.new.is_online,
            last_seen: payload.new.last_seen
          }
        }
      }
    )
    .subscribe()
  
  console.log('Presence tracking setup complete for', teacherIds.length, 'teachers')
}

const updateStudentPresence = async (isOnline) => {
  if (!currentUser.value) return
  
  try {
    const { error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: currentUser.value.id,
        is_online: isOnline,
        last_seen: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating student presence:', error)
  }
}

// ================================
// REFRESH FUNCTIONS
// ================================

const refreshConversation = async () => {
  if (!activeTeacher.value || isRefreshingConversation.value) return
  
  try {
    isRefreshingConversation.value = true
    console.log('Refreshing conversation with teacher:', activeTeacher.value.teacher_name)
    
    // Reload the conversation messages
    await loadConversationMessages(activeTeacher.value.id, activeTeacher.value.section_id)
    
    console.log('Conversation refreshed successfully')
  } catch (error) {
    console.error('Error refreshing conversation:', error)
  } finally {
    isRefreshingConversation.value = false
  }
}

// ================================
// LIFECYCLE
// ================================

onMounted(async () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🚀 MESSAGES COMPONENT MOUNTED')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  document.addEventListener('click', handleClickOutside)
  
  try {
    const userData = await getCurrentUser()
    if (!userData) {
      console.error('❌ Authentication failed or user is not a student')
      isLoading.value = false
      await router.push('/login')
      return
    }
    
    console.log('✓ Student authenticated:', userData.profile.full_name)
    
    // Fetch all messages data
    await fetchMessages()
    
    // Setup real-time subscriptions
    setupRealTimeSubscriptions()
    await setupPresenceTracking()
    await updateStudentPresence(true)
    
    console.log('✅ INITIALIZATION COMPLETE')
    
  } catch (error) {
    console.error('❌ MOUNT ERROR:', error)
    isLoading.value = false
    await router.push('/login')
  }
})

onUnmounted(() => {
  cleanupRealTimeSubscriptions()
  if (presenceChannel) {
    presenceChannel.unsubscribe()
    presenceChannel = null
  }
  updateStudentPresence(false)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Main Container */
.messages-container {
  min-height: 100vh;
  height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  padding: 1.5rem 2rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  overflow-y: auto;
}
.dark .messages-container {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%);
}

/* Custom Scrollbar */
.messages-container::-webkit-scrollbar {
  width: 12px;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

/* Header Section (Premium Card Style) */
.section-header-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.6);
  width: 100%;
  max-width: none;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3D8D7A, #2d6a5a, #3D8D7A);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.dark .section-header-card {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.section-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.3);
  animation: pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 20px rgba(61, 141, 122, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 30px rgba(61, 141, 122, 0.4);
  }
}

.dark .section-header-icon {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}

.section-header-title {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.35rem;
  letter-spacing: -0.5px;
  line-height: 1.25;
}
.dark .section-header-title {
  background: linear-gradient(135deg, #e2e8f0, #A3D1C6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-header-sub {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.5;
}
.dark .section-header-sub {
  color: #94a3b8;
}

/* Controls Section */
.controls-section {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}
.dark .search-box svg {
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  color: #1e293b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 4px 16px rgba(61, 141, 122, 0.15);
  background: rgba(255, 255, 255, 1);
}

.search-input::placeholder {
  color: #94a3b8;
  font-weight: 500;
}

.dark .search-input {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.3);
  color: #e2e8f0;
}

.dark .search-input:focus {
  border-color: #3D8D7A;
  background: rgba(35, 39, 43, 1);
  box-shadow: 0 4px 16px rgba(61, 141, 122, 0.15);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  background: rgba(241, 245, 249, 0.5);
  padding: 0.25rem;
  border-radius: 10px;
  border: 2px solid rgba(226, 232, 240, 0.8);
}

.dark .filter-tabs {
  background: rgba(51, 65, 85, 0.3);
  border-color: rgba(61, 141, 122, 0.3);
}

.filter-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.filter-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.filter-tab:hover::before {
  left: 100%;
}

.dark .filter-tab {
  color: #94a3b8;
}

.filter-tab:hover {
  background: rgba(61, 141, 122, 0.1);
  color: #3D8D7A;
}

.dark .filter-tab:hover {
  color: #A3D1C6;
}

.filter-tab.active {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.dark .filter-tab.active {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}

/* Archive Indicator */
.archive-indicator {
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  margin-left: 0.5rem;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: pulse-archive 2s infinite;
}

@keyframes pulse-archive {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.dark .archive-indicator {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Notification Badge */
.notification-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 10px;
  margin-left: 0.5rem;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Content Area */
.content-area {
  min-height: 400px;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.tab-content {
  width: 100%;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px dashed rgba(226, 232, 240, 0.8);
}
.dark .empty-state {
  color: #94a3b8;
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.3);
}

.empty-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #3D8D7A;
}
.dark .empty-icon {
  color: #A3D1C6;
}

.empty-state p {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .empty-state p {
  color: #e2e8f0;
}

.empty-subtext {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .empty-subtext {
  color: #94a3b8;
}

.deleted-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px dashed rgba(226, 232, 240, 0.8);
}

.dark .deleted-state {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.3);
}

.deleted-icon {
  margin-bottom: 1.5rem;
  color: #3D8D7A;
}
.dark .deleted-icon {
  color: #A3D1C6;
}

.show-teachers-btn {
  margin-top: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
  position: relative;
  overflow: hidden;
}

.show-teachers-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.show-teachers-btn:hover::before {
  left: 100%;
}

.dark .show-teachers-btn {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}

.show-teachers-btn:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.35);
}
.dark .show-teachers-btn:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

/* Teachers Grid */
.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.subject-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  height: fit-content;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.dark .subject-section {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.subject-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: rgba(61, 141, 122, 0.5);
}

.dark .subject-section:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.subject-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(241, 245, 249, 0.8);
}
.dark .subject-section-header {
  border-bottom-color: rgba(61, 141, 122, 0.2);
}

.subject-section-name {
  font-size: 1.15rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.3px;
}
.dark .subject-section-name {
  background: linear-gradient(135deg, #e2e8f0, #A3D1C6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subject-section-code {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.25);
}
.dark .subject-section-code {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}

.teachers-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.teacher-card {
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transform: translateY(0);
  overflow: hidden;
}

.teacher-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.teacher-card:hover::before {
  opacity: 1;
}

.dark .teacher-card {
  background: rgba(42, 48, 56, 0.8);
  border-color: rgba(61, 141, 122, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.teacher-card:hover {
  border-color: rgba(61, 141, 122, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.15);
  background: rgba(255, 255, 255, 0.95);
}
.dark .teacher-card:hover {
  border-color: rgba(61, 141, 122, 0.7);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.25);
  background: rgba(55, 65, 81, 0.9);
}

.teacher-card.has-unread {
  border-color: rgba(61, 141, 122, 0.6);
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.08), rgba(45, 106, 90, 0.05));
}

.teacher-card.has-unread::before {
  opacity: 1;
}

.dark .teacher-card.has-unread {
  border-color: rgba(61, 141, 122, 0.7);
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.15), rgba(45, 106, 90, 0.1));
}

.teacher-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.teacher-card-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.teacher-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
}

.dark .teacher-avatar {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}

.online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
  animation: pulse-online 2s infinite;
}

@keyframes pulse-online {
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  }
}

.dark .online-indicator {
  border-color: rgba(35, 39, 43, 0.9);
}

.options-btn-dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.simple-options-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  min-width: 140px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dark .simple-options-dropdown {
  background: rgba(35, 39, 43, 0.98);
  border-color: rgba(61, 141, 122, 0.4);
}

.teacher-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.2px;
}
.dark .teacher-name {
  color: #e2e8f0;
}

.teacher-email {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .teacher-email {
  color: #94a3b8;
}

.presence-status {
  font-size: 0.75rem;
  color: #10b981;
  margin: 0.25rem 0 0 0;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .presence-status {
  color: #10b981;
}

.teacher-card-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.unread-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  min-width: 20px;
  text-align: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.unread-indicator {
  position: relative;
}

.unread-count {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  min-width: 20px;
  text-align: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.teacher-card-right {
  position: relative;
}

.options-btn {
  width: 32px;
  height: 32px;
  background: rgba(241, 245, 249, 0.8);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.dark .options-btn {
  background: rgba(51, 65, 85, 0.5);
  border-color: rgba(61, 141, 122, 0.3);
  color: #94a3b8;
}

.options-btn:hover {
  background: rgba(226, 232, 240, 0.9);
  border-color: rgba(61, 141, 122, 0.5);
  color: #3D8D7A;
  transform: scale(1.05);
}
.dark .options-btn:hover {
  background: rgba(61, 141, 122, 0.3);
  color: #A3D1C6;
}

.teacher-card-body {
  margin-top: 0.5rem;
}

.last-message {
  font-size: 0.85rem;
  color: #64748b;
  font-style: italic;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .last-message {
  color: #94a3b8;
}

.options-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 150px;
  overflow: hidden;
  animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dark .options-dropdown {
  background: rgba(35, 39, 43, 0.98);
  border-color: rgba(61, 141, 122, 0.4);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dark .dropdown-item {
  color: #ffffff;
}

.dropdown-item:hover {
  background: #f8f9fa;
}
.dark .dropdown-item:hover {
  background: #495057;
}

.dropdown-item.delete-option {
  color: #dc3545;
}
.dropdown-item.delete-option:hover {
  background: #fee;
}
.dark .dropdown-item.delete-option:hover {
  background: rgba(220, 53, 69, 0.1);
}

.teacher-card-body {
  margin-top: 1rem;
}

.teacher-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}
.dark .teacher-name {
  color: #ffffff;
}

.teacher-email {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}
.dark .teacher-email {
  color: #adb5bd;
}

.last-message {
  font-size: 0.875rem;
  color: #495057;
  font-style: italic;
}
.dark .last-message {
  color: #ced4da;
}

/* Notifications */
.notifications-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}
.dark .notifications-actions {
  background: #23272b;
  border-color: #495057;
}

.notification-filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e9ecef;
  background: white;
  color: #6c757d;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dark .filter-btn {
  background: #2c3135;
  border-color: #495057;
  color: #adb5bd;
}

.filter-btn:hover {
  border-color: #20c997;
}
.dark .filter-btn:hover {
  border-color: #20c997;
}

.filter-btn.active {
  background: #20c997;
  border-color: #20c997;
  color: white;
}
.dark .filter-btn.active {
  background: #20c997;
  border-color: #20c997;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #20c997;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dark .action-btn {
  background: #20c997;
}

.action-btn:hover {
  background: #20c997;
}
.dark .action-btn:hover {
  background: #3D8D7A;
}

.notifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

.notification-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}
.dark .notification-card {
  background: #23272b;
  border-color: #495057;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.notification-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #20c997 0%, #3D8D7A 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.dark .notification-card::before {
  background: linear-gradient(90deg, #20c997 0%, #3D8D7A 100%);
}

.notification-card:hover {
  border-color: #20c997;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.25);
}
.dark .notification-card:hover {
  border-color: #20c997;
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.25);
}

.notification-card:hover::before {
  transform: scaleX(1);
}

.notification-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.notification-left {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  flex: 1;
  min-width: 0;
}

.notification-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}
.dark .notification-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}

.notification-info {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dark .notification-title {
  color: #ffffff;
}

.notification-section {
  font-size: 0.875rem;
  color: #20c997;
  margin: 0;
  font-weight: 500;
}
.dark .notification-section {
  color: #20c997;
}

.notification-card-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.notification-count {
  background: #20c997;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  min-width: 24px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.3);
}
.dark .notification-count {
  background: #20c997;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.3);
}

.unread-dot {
  width: 10px;
  height: 10px;
  background: #dc3545;
  border-radius: 50%;
  animation: pulse-unread 2s infinite;
}

@keyframes pulse-unread {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
  }
}

.notification-card-body {
  margin-top: 0.75rem;
}

.notification-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notification-teacher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #20c997;
  font-weight: 500;
}
.dark .notification-teacher {
  color: #20c997;
}

.notification-teacher svg {
  color: #20c997;
  flex-shrink: 0;
}
.dark .notification-teacher svg {
  color: #20c997;
}

.announcement-count {
  font-size: 0.8rem;
  color: #20c997;
  font-weight: 600;
  background: rgba(32, 201, 151, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  display: inline-block;
}
.dark .announcement-count {
  color: #20c997;
  background: rgba(32, 201, 151, 0.1);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 1rem;
  box-sizing: border-box;
}

.modal-overlay * {
  box-sizing: border-box;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}
.dark .modal-content {
  background: #23272b;
  border: 1px solid #495057;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
}
.dark .modal-header {
  background: #2c3135;
  border-bottom-color: #495057;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.teacher-avatar-chat {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}
.dark .teacher-avatar-chat {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
}

.header-details {
  display: flex;
  flex-direction: column;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}
.dark .modal-title {
  color: #ffffff;
}

.subject-info {
  font-size: 0.875rem;
  color: #6c757d;
}
.dark .subject-info {
  color: #adb5bd;
}

.close-btn {
  width: 36px;
  height: 36px;
  background: #e9ecef;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s ease;
}
.dark .close-btn {
  background: #495057;
  color: #adb5bd;
}

.close-btn:hover {
  background: #dc3545;
  color: white;
}

.modal-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.message-bubble {
  max-width: 80%;
  padding: 0.875rem 1.125rem;
  border-radius: 16px;
  word-wrap: break-word;
}

.message-bubble.received {
  align-self: flex-start;
  background: #e9ecef;
  color: #495057;
  border-bottom-left-radius: 4px;
}
.dark .message-bubble.received {
  background: #495057;
  color: #ffffff;
}

.message-bubble.sent {
  align-self: flex-end;
  background: #20c997;
  color: white;
  border-bottom-right-radius: 4px;
}
.dark .message-bubble.sent {
  background: #20c997;
}

.message-text {
  font-size: 0.9rem;
  line-height: 1.4;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
  text-align: right;
}

.message-bubble.sent .message-time {
  text-align: left;
}

/* Message Attachments */
.message-attachments {
  margin-bottom: 0.5rem;
}

.attachment {
  margin-bottom: 0.5rem;
}

.attachment-image {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  cursor: pointer;
  object-fit: cover;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.attachment-image:hover {
  transform: scale(1.02);
}

.attachment-file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #495057;
  max-width: 250px;
}
.dark .attachment-file {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.attachment-file:hover {
  background: rgba(0, 0, 0, 0.1);
}
.dark .attachment-file:hover {
  background: rgba(255, 255, 255, 0.15);
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}
.dark .modal-footer {
  background: #2c3135;
  border-top-color: #495057;
}

.message-input-area {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.attach-btn {
  width: 40px;
  height: 40px;
  background: #e9ecef;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s ease;
}
.dark .attach-btn {
  background: #495057;
  color: #adb5bd;
}

.attach-btn:hover {
  background: #20c997;
  color: white;
}
.dark .attach-btn:hover {
  background: #20c997;
}

.attach-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.3);
}
.dark .attach-btn:focus {
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.3);
}

.message-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 0.9rem;
  resize: none;
  min-height: 40px;
  max-height: 120px;
}
.dark .message-input {
  background: #2c3135;
  border-color: #495057;
  color: #ffffff;
}

.message-input:focus {
  outline: none;
  border-color: #20c997;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1);
}
.dark .message-input:focus {
  border-color: #20c997;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1);
}

.send-btn {
  width: 40px;
  height: 40px;
  background: #20c997;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}
.dark .send-btn {
  background: #20c997;
}

.send-btn:hover {
  background: #3D8D7A;
  transform: scale(1.05);
}
.dark .send-btn:hover {
  background: #3D8D7A;
}

.send-btn:disabled {
  background: #e9ecef;
  cursor: not-allowed;
  transform: none;
}
.dark .send-btn:disabled {
  background: #495057;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .teachers-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .notifications-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .messages-container {
    padding: 0;
    min-height: calc(100vh - 150px);
  }
  
  /* Header mobile optimization */
  .section-header-card {
    margin: 0.5rem;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 12px;
    width: calc(100vw - 1rem);
    max-width: 100vw;
    box-sizing: border-box;
  }
  
  .section-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-header-left {
    gap: 0.75rem;
  }
  
  .section-header-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
  }
  
  .section-header-title {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
  
  .section-header-sub {
    font-size: 0.9rem;
  }
  
  /* Controls section mobile optimization */
  .controls-section {
    margin: 0.5rem;
    margin-bottom: 1rem;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 12px;
    width: calc(100vw - 1rem);
    max-width: 100vw;
    box-sizing: border-box;
  }
  
  .search-box {
    min-width: 120px;
    width: 45%;
    flex: 1 1 45%;
  }
  
  .search-input {
    padding: 0.875rem 1rem 0.875rem 2.5rem;
    font-size: 1rem;
    border-radius: 12px;
  }
  
  .filter-tabs {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.25rem;
    width: 55%;
    flex: 1 1 55%;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    flex-wrap: nowrap;
  }
  .filter-tab {
    height: 48px;
    display: flex;
    align-items: center;
  }
  
  .filter-tab {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    border-radius: 10px;
    white-space: nowrap;
    min-width: auto;
  }
  
  /* Content area mobile optimization */
  .content-area {
    margin: 0 1rem;
  }
  
  .teachers-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .notifications-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .notification-card {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .notification-left {
    gap: 0.75rem;
  }
  
  .notification-icon {
    width: 40px;
    height: 40px;
  }
  
  .notification-title {
    font-size: 1rem;
    white-space: normal;
    overflow: visible;
    text-overflow: initial;
  }
  
  .notification-meta {
    gap: 0.375rem;
  }
  
  .notification-teacher {
    font-size: 0.8rem;
  }
  
  .announcement-count {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
  }
  
  /* Subject sections mobile layout */
  .subject-section {
    margin-bottom: 0.25rem;
    border-radius: 12px;
    padding: 0.75rem;
  }
  
  .subject-section-header {
    padding: 1rem 0 0.75rem 0;
    margin-bottom: 0.75rem;
  }
  
  .subject-section-name {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  
  .subject-section-code {
    font-size: 0.8rem;
    padding: 0.35rem 0.75rem;
    border-radius: 8px;
  }
  
  .teachers-cards {
    gap: 0.5rem;
  }
  
  /* Teacher card mobile optimization */
  .teacher-card {
    padding: 0.75rem;
    border-radius: 12px;
    position: relative;
  }
  
  .teacher-info {
    gap: 0.75rem;
  }
  
  .teacher-avatar {
    width: 50px;
    height: 50px;
    border-radius: 12px;
  }
  
  .teacher-name {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  .teacher-email {
    font-size: 0.8rem;
  }
  
  .teacher-status {
    gap: 0.75rem;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .unread-count {
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 8px;
    min-width: 24px;
    height: 24px;
  }
  
  .teacher-options {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  
  .teacher-options-menu {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    top: auto;
    transform: none;
    border-radius: 16px;
    max-height: 50vh;
    overflow-y: auto;
  }
  
  .teacher-option {
    padding: 1rem;
    font-size: 0.95rem;
    min-height: 56px;
    border-radius: 12px;
  }
  
  /* Notification cards mobile optimization */
  .notification-card {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .notification-header {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .notification-sender {
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }
  
  .notification-subject {
    font-size: 0.8rem;
  }
  
  .notification-preview {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }
  
  .notification-time {
    font-size: 0.75rem;
  }
  
  /* Empty states mobile optimization */
  .empty-state {
    padding: 2rem 1rem;
    margin: 1rem;
    border-radius: 16px;
  }
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 1rem;
  }
  
  .empty-state p {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .empty-subtext {
    font-size: 0.8rem;
  }
  
  .deleted-state {
    margin: 1rem;
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }
  
  .show-teachers-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }
  
  /* Modal mobile optimization */
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-content {
    width: 100%;
    max-width: none;
    margin: 0;
    border-radius: 16px;
    max-height: 85vh;
    overflow-y: auto;
  }
  
  .modal-header {
    padding: 1.25rem;
    border-radius: 16px 16px 0 0;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .modal-close {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  
  .modal-body {
    padding: 1.25rem;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .chat-header {
    padding: 1rem;
    border-radius: 12px 12px 0 0;
  }
  
  .chat-teacher-info {
    gap: 0.75rem;
  }
  
  .chat-teacher-avatar {
    width: 45px;
    height: 45px;
    border-radius: 10px;
  }
  
  .chat-teacher-name {
    font-size: 1rem;
  }
  
  .chat-teacher-status {
    font-size: 0.8rem;
  }
  
  .messages-area {
    height: 300px;
    padding: 1rem;
  }
  
  .message-bubble {
    max-width: 85%;
    padding: 0.875rem 1rem;
    border-radius: 16px;
    margin-bottom: 0.75rem;
  }
  
  .message-text {
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .message-time {
    font-size: 0.7rem;
    margin-top: 0.25rem;
  }
  
  .message-input-area {
    padding: 1rem;
    border-radius: 0 0 12px 12px;
  }
  
  .message-input-container {
    gap: 0.75rem;
  }
  
  .message-input {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
    border-radius: 12px;
  }
  
  .send-btn,
  .attach-btn {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }
  
  /* Broadcast modal mobile optimization */
  .broadcast-modal {
    border-radius: 16px;
  }
  
  .broadcast-header {
    padding: 1.25rem;
    border-radius: 16px 16px 0 0;
  }
  
  .broadcast-group-name {
    font-size: 1.1rem;
  }
  
  .broadcast-announcements {
    padding: 1rem;
    max-height: 50vh;
    overflow-y: auto;
  }
  
  .announcement-item {
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 0.875rem;
  }
  
  .announcement-header {
    margin-bottom: 0.75rem;
  }
  
  .announcement-title {
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }
  
  .announcement-date {
    font-size: 0.75rem;
  }
  
  .announcement-content {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }
  
  .announcement-actions {
    gap: 0.5rem;
  }
  
  .view-details-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.8rem;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  /* Extra small mobile optimizations */
  .section-header-card {
    margin: 0.75rem;
    padding: 0.875rem;
  }
  
  .section-header-content {
    gap: 0.75rem;
  }
  
  .section-header-icon {
    width: 45px;
    height: 45px;
  }
  
  .section-header-title {
    font-size: 1.125rem;
  }
  
  .controls-section {
    margin: 0 0.75rem 1.25rem 0.75rem;
    padding: 0.875rem;
  }
  
  .content-area {
    margin: 0 0.75rem;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
    gap: 0.375rem;
  }
  
  .filter-tab {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }
  
  .teacher-card {
    padding: 0.875rem;
  }
  
  .teacher-avatar {
    width: 45px;
    height: 45px;
  }
  
  .teacher-name {
    font-size: 0.95rem;
  }
  
  .teacher-email {
    font-size: 0.75rem;
  }
  
  .notification-card {
    padding: 0.875rem;
    border-radius: 12px;
  }
  
  .notification-card-header {
    margin-bottom: 0.75rem;
  }
  
  .notification-left {
    gap: 0.625rem;
  }
  
  .notification-icon {
    width: 36px;
    height: 36px;
  }
  
  .notification-title {
    font-size: 0.95rem;
    line-height: 1.25;
  }
  
  .notification-section {
    font-size: 0.8rem;
  }
  
  .notification-count {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    min-width: 20px;
  }
  
  .notification-meta {
    gap: 0.375rem;
  }
  
  .notification-teacher {
    font-size: 0.75rem;
    gap: 0.375rem;
  }
  
  .notification-teacher svg {
    width: 14px;
    height: 14px;
  }
  
  .announcement-count {
    font-size: 0.7rem;
    padding: 0.2rem 0.375rem;
  }
  
  .empty-state {
    margin: 0.75rem;
    padding: 1.5rem 0.875rem;
  }
  
  .empty-icon {
    width: 70px;
    height: 70px;
  }
  
  .modal-header,
  .modal-body,
  .chat-header,
  .messages-area,
  .message-input-area {
    padding: 1rem;
  }
  
  .message-bubble {
    max-width: 90%;
    padding: 0.75rem 0.875rem;
  }
  
  .broadcast-header,
  .broadcast-announcements {
    padding: 1rem;
  }
  
  .announcement-item {
    padding: 0.875rem;
  }
  
  /* Touch optimization for small screens */
  .teacher-options,
  .modal-close,
  .send-btn,
  .attach-btn {
    width: 44px;
    height: 44px;
  }
  
  .unread-count {
    min-width: 22px;
    height: 22px;
    font-size: 0.7rem;
  }
}

/* iPhone 12 Pro specific optimizations */
@media (max-width: 390px) {
  .section-header-card {
    margin: 0.5rem;
  }
  
  .controls-section {
    margin: 0 0.5rem 1rem 0.5rem;
  }
  
  .content-area {
    margin: 0 0.5rem;
  }
  
  .empty-state,
  .deleted-state {
    margin: 0.5rem;
  }
  
  .teacher-options-menu {
    left: 0.5rem;
    right: 0.5rem;
  }
  
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .message-bubble {
    max-width: 95%;
  }
}

/* ADD THESE STYLES TO YOUR EXISTING <style scoped> SECTION */

/* Loading Overlay (uniform with Subjects.vue) */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(251, 255, 228, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}
.dark .loading-overlay {
  background: rgba(24, 28, 32, 0.95);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-content {
  background: white;
  padding: 3rem 4rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(61, 141, 122, 0.15);
  border: 2px solid #a3d1c6;
  animation: slideUp 0.4s ease;
}
.dark .loading-content {
  background: #23272b;
  border-color: #20c997;
  color: #A3D1C6;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 5px solid rgba(61, 141, 122, 0.1);
  border-left: 5px solid #3d8d7a;
  border-top: 5px solid #20c997;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(61, 141, 122, 0.1);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #181c20;
  margin: 0 0 0.5rem 0;
  font-family: 'Inter', sans-serif;
}
.dark .loading-text {
  color: #A3D1C6;
}

.loading-subtext {
  font-size: 0.95rem;
  font-weight: 500;
  color: #3d8d7a;
  margin: 0;
  font-family: 'Inter', sans-serif;
}
.dark .loading-subtext {
  color: #A3D1C6;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3d8d7a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-state p {
  font-size: 1rem;
  color: #495057;
}
.dark .loading-state p {
  color: #ced4da;
}

.loading-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 300px;
}

.loading-messages p {
  margin-top: 1rem;
  font-size: 1rem;
  color: #6c757d;
}
.dark .loading-messages p {
  color: #adb5bd;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Notification Badge */
.notification-badge {
  background: #dc3545;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  margin-left: 0.25rem;
}

/* Last Message Time */
.last-message-time {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
  font-style: normal;
}
.dark .last-message-time {
  color: #adb5bd;
}

/* ================================
   BROADCAST & ANNOUNCEMENT MODALS
   ================================ */

/* Simple Announcement Detail Modal */
.simple-announcement-detail-modal {
  max-width: 600px;
  max-height: 90vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.simple-announcement-header {
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  color: white;
  padding: 1.5rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dark .simple-announcement-header {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
}

.simple-announcement-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.simple-header-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.simple-header-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.simple-subject-info {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}
.dark .simple-subject-info {
  background: #2c3135;
  border-bottom-color: #495057;
}

.simple-subject-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
}
.dark .simple-subject-item {
  color: #adb5bd;
}

.simple-subject-item svg {
  color: #20c997;
}
.dark .simple-subject-item svg {
  color: #20c997;
}

.simple-announcement-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.simple-announcement-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
}
.dark .simple-announcement-title {
  color: #ffffff;
}

.simple-meta-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.simple-meta-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.dark .simple-meta-card {
  background: #23272b;
  border-color: #495057;
}

.simple-meta-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
.dark .simple-meta-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
}

.simple-meta-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.simple-meta-label {
  font-size: 0.7rem;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.dark .simple-meta-label {
  color: #adb5bd;
}

.simple-meta-value {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 600;
}
.dark .simple-meta-value {
  color: #ffffff;
}

.simple-content-section {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.dark .simple-content-section {
  background: #23272b;
  border-color: #495057;
}

.simple-content-header {
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
}
.dark .simple-content-header {
  background: #2c3135;
  border-bottom-color: #495057;
  color: #adb5bd;
}

.simple-content-header svg {
  color: #20c997;
}
.dark .simple-content-header svg {
  color: #20c997;
}

.simple-content-body {
  padding: 1rem;
}

.simple-content-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.75rem 0;
}
.dark .simple-content-title {
  color: #ffffff;
}

.simple-content-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #495057;
  margin: 0;
  white-space: pre-wrap;
}
.dark .simple-content-text {
  color: #adb5bd;
}

.simple-attachments-section {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.dark .simple-attachments-section {
  background: #23272b;
  border-color: #495057;
}

.simple-attachments-header {
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
}
.dark .simple-attachments-header {
  background: #2c3135;
  border-bottom-color: #495057;
  color: #adb5bd;
}

.simple-attachments-header svg {
  color: #20c997;
}
.dark .simple-attachments-header svg {
  color: #20c997;
}

.simple-attachments-grid {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.simple-attachment-item {
  border-radius: 8px;
  overflow: hidden;
}

.simple-attachment-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  cursor: pointer;
}

.simple-attachment-file {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dark .simple-attachment-file {
  background: #2c3135;
  border-color: #495057;
}

.simple-attachment-file:hover {
  border-color: #20c997;
}
.dark .simple-attachment-file:hover {
  border-color: #20c997;
}

.simple-file-icon {
  color: #20c997;
}
.dark .simple-file-icon {
  color: #20c997;
}

.simple-file-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.simple-file-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
}
.dark .simple-file-name {
  color: #ffffff;
}

.simple-file-size {
  font-size: 0.75rem;
  color: #6c757d;
}
.dark .simple-file-size {
  color: #adb5bd;
}

.simple-announcement-footer {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  text-align: center;
}
.dark .simple-announcement-footer {
  background: #2c3135;
  border-top-color: #495057;
}

.simple-close-announcement-btn {
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dark .simple-close-announcement-btn {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
}

.simple-close-announcement-btn:hover {
  background: linear-gradient(135deg, #20c997 0%, #6fb3a8 100%);
  transform: translateY(-1px);
}
.dark .simple-close-announcement-btn:hover {
  background: linear-gradient(135deg, #3D8D7A 0%, #138a73 100%);
}

/* Enhanced Modal Base */
.broadcast-modal .modal-content {
  max-width: 800px;
  max-height: 90vh;
}

/* Enhanced Simple Broadcast Modal - Compact Spacing */
.enhanced-simple-broadcast-modal {
  max-width: 650px;
  max-height: 85vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border: 2px solid #e9ecef;
}
.dark .enhanced-simple-broadcast-modal {
  border-color: #495057;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.enhanced-simple-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid #e9ecef;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}
.dark .enhanced-simple-modal-header {
  background: linear-gradient(135deg, #23272b 0%, #2c3135 100%);
  border-bottom-color: #495057;
}

.enhanced-simple-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.enhanced-simple-subject-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}
.dark .enhanced-simple-subject-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}

.enhanced-simple-modal-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}
.dark .enhanced-simple-modal-title {
  color: #ffffff;
}

.enhanced-simple-teacher-info {
  display: flex;
  gap: 0.75rem;
}

.enhanced-teacher-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
  background: rgba(32, 201, 151, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}
.dark .enhanced-teacher-item {
  color: #adb5bd;
  background: rgba(32, 201, 151, 0.1);
}

.enhanced-teacher-item svg {
  color: #20c997;
}
.dark .enhanced-teacher-item svg {
  color: #20c997;
}

.enhanced-simple-close-btn {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  color: #6c757d;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dark .enhanced-simple-close-btn {
  background: #2c3135;
  border-color: #495057;
  color: #adb5bd;
}

.enhanced-simple-close-btn:hover {
  background: #e9ecef;
  color: #495057;
  transform: rotate(90deg);
}
.dark .enhanced-simple-close-btn:hover {
  background: #495057;
  color: #ffffff;
}

.enhanced-simple-modal-body {
  padding: 1.25rem 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.enhanced-simple-announcement-count {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 2px solid #e9ecef;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.dark .enhanced-simple-announcement-count {
  background: linear-gradient(135deg, #2c3135 0%, #23272b 100%);
  border-color: #495057;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.enhanced-count-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3);
}
.dark .enhanced-count-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3);
}

.enhanced-simple-announcement-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.enhanced-simple-announcement-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.dark .enhanced-simple-announcement-item {
  background: linear-gradient(135deg, #23272b 0%, #2c3135 100%);
  border-color: #495057;
}

.enhanced-simple-announcement-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #20c997 0%, #20c997 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.dark .enhanced-simple-announcement-item::before {
  background: linear-gradient(90deg, #20c997 0%, #3D8D7A 100%);
}

.enhanced-simple-announcement-item.unread::before {
  transform: scaleX(1);
}

.enhanced-simple-announcement-item:hover {
  border-color: #20c997;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.2);
}
.dark .enhanced-simple-announcement-item:hover {
  border-color: #20c997;
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.2);
}

.enhanced-simple-announcement-item:hover::before {
  transform: scaleX(1);
}

.enhanced-simple-announcement-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}
.dark .enhanced-simple-announcement-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}

.enhanced-simple-announcement-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.enhanced-announcement-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.enhanced-announcement-title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.enhanced-simple-announcement-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}
.dark .enhanced-simple-announcement-title {
  color: #ffffff;
}

.enhanced-new-badge {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
}

.enhanced-announcement-subtitle {
  font-size: 0.85rem;
  color: #495057;
  line-height: 1.3;
  font-weight: 500;
}
.dark .enhanced-announcement-subtitle {
  color: #adb5bd;
}

.enhanced-simple-announcement-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.enhanced-simple-announcement-date {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 600;
}
.dark .enhanced-simple-announcement-date {
  color: #adb5bd;
}

.enhanced-simple-announcement-date svg {
  color: #20c997;
}
.dark .enhanced-simple-announcement-date svg {
  color: #20c997;
}

.enhanced-attachment-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(32, 201, 151, 0.1);
  color: #20c997;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}
.dark .enhanced-attachment-indicator {
  background: rgba(32, 201, 151, 0.1);
  color: #20c997;
}

/* Simple Broadcast Modal */
.simple-broadcast-modal {
  max-width: 600px;
  max-height: 85vh;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.simple-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #ffffff;
}
.dark .simple-modal-header {
  background: #23272b;
  border-bottom-color: #495057;
}

.simple-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.simple-subject-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
.dark .simple-subject-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
}

.simple-modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}
.dark .simple-modal-title {
  color: #ffffff;
}

.simple-teacher-label {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

[data-theme="dark"] .simple-teacher-label {
  color: rgba(232, 245, 232, 0.8);
}

.simple-teacher-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6c757d;
}
.dark .simple-teacher-info {
  color: #adb5bd;
}

.simple-teacher-info svg {
  color: #20c997;
}
.dark .simple-teacher-info svg {
  color: #20c997;
}

.simple-close-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #6c757d;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dark .simple-close-btn {
  background: #2c3135;
  border-color: #495057;
  color: #adb5bd;
}

.simple-close-btn:hover {
  background: #e9ecef;
  color: #495057;
}
.dark .simple-close-btn:hover {
  background: #495057;
  color: #ffffff;
}

.simple-modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.simple-announcement-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
}
.dark .simple-announcement-count {
  background: #2c3135;
  color: #adb5bd;
}

.simple-announcement-count svg {
  color: #20c997;
}
.dark .simple-announcement-count svg {
  color: #20c997;
}

.simple-announcement-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.simple-announcement-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dark .simple-announcement-item {
  background: #23272b;
  border-color: #495057;
}

.simple-announcement-item:hover {
  border-color: #20c997;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.15);
}
.dark .simple-announcement-item:hover {
  border-color: #20c997;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.15);
}

.simple-announcement-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
.dark .simple-announcement-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
}

.simple-announcement-content {
  flex: 1;
}

.simple-announcement-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}
.dark .simple-announcement-title {
  color: #ffffff;
}

.simple-announcement-subtitle {
  font-size: 0.9rem;
  color: #495057;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}
.dark .simple-announcement-subtitle {
  color: #adb5bd;
}

.simple-announcement-date {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: #6c757d;
}
.dark .simple-announcement-date {
  color: #adb5bd;
}

.simple-announcement-date svg {
  color: #20c997;
}
.dark .simple-announcement-date svg {
  color: #20c997;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}
.dark .modal-header {
  border-bottom-color: #495057;
  background: linear-gradient(135deg, #2c3135 0%, #23272b 100%);
}

.header-info {
  display: flex;
  align-items: center;
  flex: 1;
}

/* Enhanced Header Icons */
.broadcast-icon-large {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(32, 201, 151, 0.4);
  margin-right: 1.25rem;
  border: 3px solid rgba(255, 255, 255, 0.2);
}
.dark .broadcast-icon-large {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 8px 20px rgba(32, 201, 151, 0.4);
}

/* Enhanced Modal Subtitle */
.modal-subtitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #6c757d;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}
.dark .modal-subtitle {
  color: #adb5bd;
}

.modal-subtitle svg {
  color: #20c997;
  flex-shrink: 0;
}
.dark .modal-subtitle svg {
  color: #20c997;
}

.section-text, .teacher-text {
  font-weight: 600;
  color: #2c3e50;
}
.dark .section-text, .dark .teacher-text {
  color: #ffffff;
}

/* Enhanced Close Button */
.close-btn {
  width: 44px;
  height: 44px;
  background: rgba(220, 53, 69, 0.1);
  border: 2px solid rgba(220, 53, 69, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #dc3545;
  transition: all 0.3s ease;
}
.dark .close-btn {
  background: rgba(220, 53, 69, 0.15);
  border-color: rgba(220, 53, 69, 0.3);
}

.close-btn:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* Announcement Count Header */
.announcement-count-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(32, 201, 151, 0.1);
  border: 2px solid rgba(32, 201, 151, 0.2);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}
.dark .announcement-count-header {
  background: rgba(32, 201, 151, 0.1);
  border-color: rgba(32, 201, 151, 0.2);
  color: #ffffff;
}

.announcement-count-header svg {
  color: #20c997;
}
.dark .announcement-count-header svg {
  color: #20c997;
}

/* Enhanced Broadcast List */
.broadcast-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 55vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Enhanced Broadcast Items */
.broadcast-item {
  display: flex;
  gap: 1rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.dark .broadcast-item {
  background: #2c3135;
  border-color: #495057;
}

.broadcast-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: #e9ecef;
  transition: all 0.3s ease;
}
.dark .broadcast-item::before {
  background: #495057;
}

.broadcast-item.unread::before {
  background: linear-gradient(180deg, #20c997 0%, #20c997 100%);
  width: 8px;
  box-shadow: 0 0 10px rgba(32, 201, 151, 0.5);
}
.dark .broadcast-item.unread::before {
  background: linear-gradient(180deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 0 10px rgba(32, 201, 151, 0.5);
}

.broadcast-item:hover {
  border-color: #20c997;
  transform: translateX(12px);
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.25);
}
.dark .broadcast-item:hover {
  border-color: #20c997;
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.25);
}

/* Broadcast Item Icon */
.broadcast-item-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}
.dark .broadcast-item-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}

/* Broadcast Item Content */
.broadcast-item-content {
  flex: 1;
  min-width: 0;
}

.broadcast-item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.broadcast-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}
.dark .broadcast-item-title {
  color: #ffffff;
}

/* Enhanced Unread Label */
.unread-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: pulse-new 2s infinite;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
  white-space: nowrap;
}

.unread-label svg {
  color: white;
}

@keyframes pulse-new {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3), 0 0 0 0 rgba(220, 53, 69, 0.4);
  }
  50% {
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3), 0 0 0 6px rgba(220, 53, 69, 0.1);
  }
}

.broadcast-item-body {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dark .broadcast-item-body {
  color: #adb5bd;
}

/* Enhanced Footer */
.broadcast-item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.time-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.85rem;
  font-weight: 500;
}
.dark .time-section {
  color: #adb5bd;
}

.time-section svg {
  color: #20c997;
}
.dark .time-section svg {
  color: #20c997;
}

/* Enhanced Attachment Indicator */
.attachment-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #20c997;
  font-weight: 600;
  background: rgba(32, 201, 151, 0.15);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(32, 201, 151, 0.3);
  font-size: 0.8rem;
}
.dark .attachment-indicator {
  color: #20c997;
  background: rgba(32, 201, 151, 0.15);
  border-color: rgba(32, 201, 151, 0.3);
}

/* Announcement Detail Modal */
.announcement-detail-modal .modal-content {
  max-width: 750px;
  max-height: 90vh;
}

.announcement-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(32, 201, 151, 0.4);
  margin-right: 1.25rem;
  border: 3px solid rgba(255, 255, 255, 0.2);
}
.dark .announcement-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 8px 20px rgba(32, 201, 151, 0.4);
}

/* Enhanced Modal Title with Icon */
.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}
.dark .modal-title {
  color: #ffffff;
}

.modal-title svg {
  color: #20c997;
}
.dark .modal-title svg {
  color: #20c997;
}

/* Enhanced Subject Info */
.subject-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #6c757d;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}
.dark .subject-info {
  color: #adb5bd;
}

.subject-info svg {
  color: #20c997;
  flex-shrink: 0;
}
.dark .subject-info svg {
  color: #20c997;
}

.subject-info span {
  font-weight: 600;
  color: #20c997;
}
.dark .subject-info span {
  color: #20c997;
}

.announcement-detail-body {
  padding: 2rem;
  max-height: 65vh;
  overflow-y: auto;
}

.announcement-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.announcement-header {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 1.5rem;
  background: rgba(32, 201, 151, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid rgba(32, 201, 151, 0.1);
}
.dark .announcement-header {
  border-bottom-color: #495057;
  background: rgba(32, 201, 151, 0.05);
  border-color: rgba(32, 201, 151, 0.1);
}

.announcement-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 1.25rem 0;
  line-height: 1.3;
}
.dark .announcement-title {
  color: #ffffff;
}

.announcement-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.teacher-info .teacher-name {
  font-size: 1.1rem;
  color: #20c997;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.dark .teacher-info .teacher-name {
  color: #20c997;
}

.teacher-info .teacher-name::before {
  content: '';
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3e%3ccircle cx='12' cy='7' r='4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
}
.dark .teacher-info .teacher-name::before {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
}

.announcement-date {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6c757d;
  font-size: 1rem;
  font-weight: 600;
  background: rgba(108, 117, 125, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border-left: 4px solid #20c997;
}
.dark .announcement-date {
  color: #adb5bd;
  background: rgba(173, 181, 189, 0.1);
  border-left-color: #20c997;
}

.announcement-date svg {
  color: #20c997;
  background: white;
  padding: 4px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.2);
}
.dark .announcement-date svg {
  color: #20c997;
  background: #2c3135;
}

.announcement-body {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid #e9ecef;
  border-left: 6px solid #20c997;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.dark .announcement-body {
  background: linear-gradient(135deg, #23272b 0%, #2c3135 100%);
  border-color: #495057;
  border-left-color: #20c997;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.announcement-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #2c3e50;
  margin: 0;
  white-space: pre-wrap;
}
.dark .announcement-text {
  color: #ffffff;
}

.announcement-attachments {
  border-top: 3px solid #e9ecef;
  padding-top: 2rem;
  background: rgba(248, 249, 250, 0.5);
  border-radius: 12px;
  padding: 2rem;
}
.dark .announcement-attachments {
  border-top-color: #495057;
  background: rgba(35, 39, 43, 0.5);
}

.attachments-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e9ecef;
}
.dark .attachments-title {
  color: #ffffff;
  border-bottom-color: #495057;
}

.attachments-title svg {
  color: #20c997;
  background: rgba(32, 201, 151, 0.1);
  padding: 8px;
  border-radius: 8px;
}
.dark .attachments-title svg {
  color: #20c997;
  background: rgba(32, 201, 151, 0.1);
}

/* Enhanced Close Button */
.close-detail-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}
.dark .close-detail-btn {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}

.close-detail-btn:hover {
  background: linear-gradient(135deg, #20c997 0%, #6fb3a8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
}
.dark .close-detail-btn:hover {
  background: linear-gradient(135deg, #3D8D7A 0%, #138a73 100%);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
}

.close-detail-btn svg {
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}

.close-detail-btn:hover svg {
  transform: rotate(180deg);
}

/* Enhanced Attachments Grid */
.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.attachment-item {
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.dark .attachment-item {
  border-color: #495057;
  background: #2c3135;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.attachment-item:hover {
  border-color: #20c997;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.25);
}
.dark .attachment-item:hover {
  border-color: #20c997;
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.25);
}

.attachment-image-container {
  position: relative;
  overflow: hidden;
}

.attachment-image-large {
  width: 100%;
  height: 220px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.attachment-image-large:hover {
  transform: scale(1.08);
}

.attachment-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  display: flex;
  gap: 0.75rem;
  padding: 1.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  justify-content: center;
}

.attachment-image-container:hover .attachment-overlay {
  opacity: 1;
}

.view-btn, .download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.view-btn:hover, .download-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

.attachment-file-large {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dark .attachment-file-large {
  background: #2c3135;
}

.attachment-file-large:hover {
  background: rgba(32, 201, 151, 0.08);
  transform: translateX(4px);
}
.dark .attachment-file-large:hover {
  background: rgba(32, 201, 151, 0.08);
}

.file-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}
.dark .file-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  display: block;
  font-weight: 700;
  font-size: 1.05rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dark .file-name {
  color: #ffffff;
}

.file-size {
  display: block;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}
.dark .file-size {
  color: #adb5bd;
}

.download-file-btn {
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3);
}
.dark .download-file-btn {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3);
}

.download-file-btn:hover {
  background: linear-gradient(135deg, #20c997 0%, #6fb3a8 100%);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.4);
}
.dark .download-file-btn:hover {
  background: linear-gradient(135deg, #3D8D7A 0%, #138a73 100%);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.4);
}

/* Enhanced Announcement Detail Modal Styles */

/* Enhanced Modal Overlay */
.enhanced-modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

/* Enhanced Modal Content */
.enhanced-announcement-modal {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 2px solid #e9ecef;
  max-width: 800px;
  max-height: 92vh;
  overflow: hidden;
  animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.dark .enhanced-announcement-modal {
  background: linear-gradient(135deg, #23272b 0%, #2c3135 100%);
  border-color: #495057;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from { 
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Enhanced Header */
.enhanced-header {
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}
.dark .enhanced-header {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
}

.enhanced-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.announcement-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.subject-section-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.subject-badge, .section-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.enhanced-close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.enhanced-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg) scale(1.1);
}

/* Enhanced Body */
.enhanced-announcement-body {
  padding: 2rem;
  max-height: 65vh;
  overflow-y: auto;
}

.enhanced-announcement-body::-webkit-scrollbar {
  width: 8px;
}

.enhanced-announcement-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.dark .enhanced-announcement-body::-webkit-scrollbar-track {
  background: #2c3135;
}

.enhanced-announcement-body::-webkit-scrollbar-thumb {
  background: #20c997;
  border-radius: 10px;
}
.dark .enhanced-announcement-body::-webkit-scrollbar-thumb {
  background: #20c997;
}

/* Enhanced Title Section */
.announcement-title-section {
  margin-bottom: 2rem;
}

.enhanced-announcement-title {
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0;
  line-height: 1.2;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.dark .enhanced-announcement-title {
  background: linear-gradient(135deg, #ffffff 0%, #e9ecef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced Meta Cards */
.announcement-meta-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.meta-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.dark .meta-card {
  background: #23272b;
  border-color: #495057;
}

.meta-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #20c997 0%, #20c997 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.dark .meta-card::before {
  background: linear-gradient(90deg, #20c997 0%, #3D8D7A 100%);
}

.meta-card:hover {
  border-color: #20c997;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.2);
}
.dark .meta-card:hover {
  border-color: #20c997;
  box-shadow: 0 8px 25px rgba(32, 201, 151, 0.2);
}

.meta-card:hover::before {
  transform: scaleX(1);
}

.meta-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}
.dark .meta-icon {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}

.meta-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.dark .meta-label {
  color: #adb5bd;
}

.meta-value {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 700;
}
.dark .meta-value {
  color: #ffffff;
}

/* Enhanced Content Card */
.announcement-content-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.dark .announcement-content-card {
  background: #23272b;
  border-color: #495057;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.content-header {
  background: rgba(32, 201, 151, 0.1);
  padding: 1rem 1.5rem;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  color: #2c3e50;
}
.dark .content-header {
  background: rgba(32, 201, 151, 0.1);
  border-bottom-color: #495057;
  color: #ffffff;
}

.content-header svg {
  color: #20c997;
}
.dark .content-header svg {
  color: #20c997;
}

.announcement-body {
  padding: 2rem;
}

.announcement-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
  margin: 0;
  white-space: pre-wrap;
}
.dark .announcement-text {
  color: #ffffff;
}

/* Enhanced Attachments */
.announcement-attachments {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.dark .announcement-attachments {
  background: #23272b;
  border-color: #495057;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.attachments-header {
  background: rgba(32, 201, 151, 0.1);
  padding: 1rem 1.5rem;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dark .attachments-header {
  background: rgba(32, 201, 151, 0.1);
  border-bottom-color: #495057;
}

.attachments-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}
.dark .attachments-title {
  color: #ffffff;
}

.attachments-title svg {
  color: #20c997;
}
.dark .attachments-title svg {
  color: #20c997;
}

.attachments-count {
  background: #20c997;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3);
}
.dark .attachments-count {
  background: #20c997;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3);
}

/* Enhanced Footer */
.enhanced-footer {
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 2px solid #e9ecef;
  text-align: center;
}
.dark .enhanced-footer {
  background: #2c3135;
  border-top-color: #495057;
}

.enhanced-close-detail-btn {
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}
.dark .enhanced-close-detail-btn {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
}

.enhanced-close-detail-btn:hover {
  background: linear-gradient(135deg, #20c997 0%, #6fb3a8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
}
.dark .enhanced-close-detail-btn:hover {
  background: linear-gradient(135deg, #3D8D7A 0%, #138a73 100%);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
}

.enhanced-close-detail-btn svg {
  transition: transform 0.3s ease;
}

.enhanced-close-detail-btn:hover svg {
  transform: translateY(2px);
}

/* Mobile Responsive Enhancements */
@media (max-width: 768px) {
  .announcement-detail-modal .modal-content {
    margin: 1rem;
    max-height: 90vh;
  }
  
  .broadcast-icon-large, .announcement-icon {
    width: 48px;
    height: 48px;
  }
  
  .announcement-title {
    font-size: 1.25rem;
  }
  
  .attachments-grid {
    grid-template-columns: 1fr;
  }
  
  .attachment-image-large {
    height: 150px;
  }
  
  .broadcast-item {
    padding: 1rem;
  }
  
  .broadcast-item:hover {
    transform: translateX(4px);
  }
  
  .announcement-meta {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .broadcast-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .unread-label {
    align-self: flex-start;
  }
  
  .broadcast-item-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .announcement-body {
    padding: 1rem;
  }
  
  .announcement-detail-body {
    padding: 1rem;
  }
}

/* ================================
   CLEAN PROFESSIONAL TEACHER CARDS
   ================================ */

.simple-teacher-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  position: relative;
  margin-bottom: 0.875rem;
  overflow: visible;
  z-index: 1;
}

.simple-teacher-card:hover {
  z-index: 2;
}

.simple-teacher-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #20c997 0%, #20c997 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.simple-teacher-card:hover::before {
  opacity: 1;
}
.dark .simple-teacher-card {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.simple-teacher-card:hover {
  border-color: #20c997;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.08);
  transform: translateY(-1px);
}
.dark .simple-teacher-card:hover {
  border-color: #20c997;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.08);
}

.simple-teacher-card.has-unread {
  border-left: 3px solid #dc3545;
  background: #fefefe;
}
.dark .simple-teacher-card.has-unread {
  border-left: 3px solid #dc3545;
  background: #1f2937;
}

.simple-teacher-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.simple-teacher-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.simple-teacher-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.2);
}
.dark .simple-teacher-avatar {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.2);
}

.simple-teacher-info {
  flex: 1;
  min-width: 0;
}

.simple-teacher-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.125rem 0;
  line-height: 1.4;
}
.dark .simple-teacher-name {
  color: #f8fafc;
}

.simple-teacher-email {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dark .simple-teacher-email {
  color: #94a3b8;
}

.simple-presence-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: #059669;
  font-weight: 500;
}
.dark .simple-presence-status {
  color: #10b981;
}

.simple-online-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.simple-teacher-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.simple-unread-badge {
  background: #dc3545;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(220, 53, 69, 0.2);
}

.simple-options-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  z-index: 10;
}
.dark .simple-options-btn {
  border-color: #334155;
  color: #94a3b8;
}

.simple-options-btn:hover {
  background: #f8fafc;
  border-color: #20c997;
  color: #20c997;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.dark .simple-options-btn:hover {
  background: #334155;
  border-color: #20c997;
  color: #20c997;
}

.simple-options-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  min-width: 140px;
  overflow: hidden;
  transform-origin: top right;
  animation: dropdownSlideIn 0.2s ease-out;
  will-change: transform, opacity;
}

.dark .simple-options-dropdown {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2);
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
    visibility: hidden;
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    visibility: visible;
  }
}

/* Position dropdown upward if it would go below viewport */
.simple-options-dropdown.position-up {
  top: auto;
  bottom: calc(100% + 0.5rem);
  transform-origin: bottom right;
}

.dark .simple-options-dropdown {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2), 0 3px 10px rgba(0, 0, 0, 0.1);
}

.simple-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}

.simple-dropdown-item:last-child {
  border-bottom: none;
}

.dark .simple-dropdown-item {
  color: #d1d5db;
  border-bottom-color: #334155;
}

.simple-dropdown-item:hover {
  background: #f8fafc;
  color: #1e293b;
  transform: translateX(4px);
  padding-left: 1.125rem;
}
.dark .simple-dropdown-item:hover {
  background: #334155;
  color: #f8fafc;
}

.simple-dropdown-item.delete-option:hover {
  background: #fef2f2;
  color: #dc2626;
  transform: translateX(4px);
  padding-left: 1.125rem;
}
.dark .simple-dropdown-item.delete-option:hover {
  background: #7f1d1d;
  color: #fca5a5;
}

.simple-dropdown-item svg {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.simple-dropdown-item:hover svg {
  opacity: 1;
}

.simple-teacher-body {
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}
.dark .simple-teacher-body {
  border-top-color: #334155;
}

.simple-last-message {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dark .simple-last-message {
  color: #94a3b8;
}

.simple-message-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.simple-message-time {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}
.dark .simple-message-time {
  color: #64748b;
}

.simple-chat-icon {
  color: #20c997;
  width: 16px;
  height: 16px;
  opacity: 0.7;
}
.dark .simple-chat-icon {
  color: #20c997;
}

/* ================================
   CLEAN PROFESSIONAL CHAT MODAL
   ================================ */

.simple-modal-content {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 650px;
  height: 85vh;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin: auto;
}
.dark .simple-modal-content {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.modal-overlay .simple-modal-content .simple-modal-header {
  background: #20c997 !important;
  background: linear-gradient(135deg, #20c997 0%, #40916c 100%) !important;
  color: white !important;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.modal-overlay .simple-modal-content .simple-modal-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #20c997;
  background: linear-gradient(135deg, #20c997 0%, #40916c 100%);
  z-index: -2;
}

.modal-overlay .simple-modal-content .simple-modal-header * {
  background: transparent !important;
  color: white !important;
}

.simple-modal-header input,
.simple-modal-header textarea,
.simple-modal-header .input,
.simple-modal-header .search-input,
.simple-modal-header [class*="input"],
.simple-modal-header [class*="subject"] {
  background: transparent !important;
  color: white !important;
  border: none !important;
  box-shadow: none !important;
}

.simple-modal-header {
  background: #20c997 !important;
  background: linear-gradient(135deg, #20c997 0%, #40916c 100%) !important;
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.simple-modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #20c997;
  background: linear-gradient(135deg, #20c997 0%, #40916c 100%);
  z-index: -1;
}

.dark .simple-modal-header {
  background: #20c997 !important;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%) !important;
}

.dark .simple-modal-header::before {
  background: #20c997;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
}

.simple-header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  background: transparent;
  position: relative;
  z-index: 1;
}

.simple-teacher-avatar-chat {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.3rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.simple-header-details {
  flex: 1;
  background: transparent;
  position: relative;
  z-index: 1;
}

.simple-modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.simple-subject-info {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.simple-close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.simple-close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.simple-modal-body {
  flex: 1;
  padding: 1rem 1.5rem;
  overflow-y: auto;
  background: #fafbfc;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.dark .simple-modal-body {
  background: #0f172a;
}

.simple-modal-body::-webkit-scrollbar {
  width: 6px;
}

.simple-modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.simple-modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.dark .simple-modal-body::-webkit-scrollbar-thumb {
  background: #475569;
}

.simple-modal-body::-webkit-scrollbar-thumb:hover {
  background: #20c997;
}
.dark .simple-modal-body::-webkit-scrollbar-thumb:hover {
  background: #20c997;
}

.simple-loading-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1rem;
  color: #64748b;
  min-height: 200px;
}
.dark .simple-loading-messages {
  color: #94a3b8;
}

.simple-loading-spinner {
  position: relative;
}

.simple-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #20c997;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.dark .simple-spinner {
  border-color: #334155;
  border-top-color: #20c997;
}

.simple-messages-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-height: 0;
  padding-bottom: 1rem;
}

.simple-message-bubble {
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  word-wrap: break-word;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: all 0.15s ease;
}

.simple-message-bubble:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.simple-message-bubble.sent {
  align-self: flex-end;
  background: linear-gradient(135deg, #20c997 0%, #40916c 100%);
  color: white;
  border-bottom-right-radius: 6px;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.25);
}
.dark .simple-message-bubble.sent {
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.25);
}

.simple-message-bubble.received {
  align-self: flex-start;
  background: #ffffff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}
.dark .simple-message-bubble.received {
  background: #334155;
  color: #f8fafc;
  border-color: #475569;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.simple-message-attachments {
  margin-bottom: 0.75rem;
}

.simple-attachment {
  margin-bottom: 0.5rem;
}

.simple-attachment-image-container {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.15s ease;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}
.dark .simple-attachment-image-container {
  background: #0f172a;
  border-color: #334155;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.simple-attachment-image-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.dark .simple-attachment-image-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.simple-attachment-image {
  max-width: 100%;
  max-height: 300px;
  min-height: 120px;
  border-radius: 8px;
  cursor: pointer;
  display: block;
  object-fit: cover;
  transition: all 0.2s ease;
}

.simple-attachment-image:hover {
  opacity: 0.95;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Image overlay for better interaction feedback */
.simple-attachment-image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(32, 201, 151, 0) 0%, rgba(32, 201, 151, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
  border-radius: 8px;
}

.simple-attachment-image-container:hover::before {
  opacity: 1;
}
.dark .simple-attachment-image-container::before {
  background: linear-gradient(45deg, rgba(32, 201, 151, 0) 0%, rgba(32, 201, 151, 0.1) 100%);
}

.simple-attachment-file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.simple-attachment-file:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.simple-message-text {
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}

.simple-message-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.625rem;
  gap: 0.5rem;
}

.simple-message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 500;
}

.simple-message-status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0.7;
}

.simple-no-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1rem;
  color: #64748b;
  text-align: center;
  min-height: 200px;
}
.dark .simple-no-messages {
  color: #94a3b8;
}

.simple-no-messages-icon {
  color: #20c997;
  opacity: 0.6;
}
.dark .simple-no-messages-icon {
  color: #20c997;
}

.simple-modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
  flex-shrink: 0;
}
.dark .simple-modal-footer {
  border-top-color: #334155;
  background: #1e293b;
}

.simple-file-preview {
  margin-bottom: 1rem;
}

.simple-preview-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem;
  position: relative;
}
.dark .simple-preview-content {
  background: #0f172a;
  border-color: #334155;
}

.simple-preview-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.15s ease;
}
.dark .simple-preview-image {
  border-color: #334155;
}

.simple-preview-image:hover {
  border-color: #20c997;
  transform: scale(1.05);
}
.dark .simple-preview-image:hover {
  border-color: #20c997;
}

.simple-preview-file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  font-size: 0.875rem;
}
.dark .simple-preview-file {
  color: #cbd5e1;
}

.simple-remove-file-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(220, 53, 69, 0.2);
}

.simple-remove-file-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

.simple-message-input-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.875rem;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.dark .simple-message-input-area {
  background: #0f172a;
  border-color: #334155;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.simple-message-input-area:focus-within {
  border-color: #20c997;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1), 0 1px 3px rgba(0, 0, 0, 0.04);
  background: #ffffff;
}
.dark .simple-message-input-area:focus-within {
  border-color: #20c997;
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
  background: #1e293b;
}

.simple-attach-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}
.dark .simple-attach-btn {
  border-color: #334155;
  color: #94a3b8;
}

.simple-attach-btn:hover:not(:disabled) {
  background: #20c997;
  border-color: #20c997;
  color: white;
  transform: scale(1.05);
}
.dark .simple-attach-btn:hover:not(:disabled) {
  background: #20c997;
  border-color: #20c997;
}

.simple-attach-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.simple-message-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: #1e293b;
  padding: 0.625rem;
  line-height: 1.4;
  font-family: inherit;
}
.dark .simple-message-input {
  color: #f8fafc;
}

.simple-message-input::placeholder {
  color: #64748b;
}
.dark .simple-message-input::placeholder {
  color: #94a3b8;
}

.simple-send-btn {
  background: linear-gradient(135deg, #20c997 0%, #40916c 100%);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.2);
}
.dark .simple-send-btn {
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.2);
}

.simple-send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.3);
}
.dark .simple-send-btn:hover:not(:disabled) {
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.3);
}

.simple-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.simple-button-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Mobile Responsive for Simple Design */
@media (min-width: 1024px) {
  .simple-modal-content {
    max-width: 750px;
    height: 90vh;
    min-height: 600px;
  }
  
  .simple-modal-header {
    padding: 1.25rem 2rem;
  }
  
  .simple-modal-body {
    padding: 1.5rem 2rem;
  }
  
  .simple-modal-footer {
    padding: 1.25rem 2rem;
  }
  
  .simple-message-bubble {
    max-width: 65%;
  }
  
  .simple-messages-container {
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .simple-modal-content {
    height: 95vh;
    min-height: 400px;
    border-radius: 8px;
  }
  
  .simple-teacher-card {
    padding: 0.875rem;
  }
  
  .simple-teacher-left {
    gap: 0.625rem;
  }
  
  .simple-teacher-avatar {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
  
  .simple-modal-content {
    margin: 0.5rem;
    max-height: 90vh;
  }
  
  .simple-modal-header {
    padding: 1rem 1.25rem;
  }
  
  .simple-modal-body {
    padding: 1rem;
  }
  
  .simple-modal-footer {
    padding: 1rem;
  }
  
  .simple-message-bubble {
    max-width: 85%;
  }
}

@media (max-width: 480px) {
  .simple-teacher-card {
    padding: 1rem;
    margin-bottom: 0.75rem;
    border-radius: 8px;
  }
  
  .simple-teacher-name {
    font-size: 0.95rem;
  }
  
  .simple-teacher-email {
    font-size: 0.8rem;
  }
  
  .simple-options-dropdown {
    min-width: 130px;
    right: 0;
    top: calc(100% + 0.25rem);
  }
  
  .simple-dropdown-item {
    padding: 0.75rem 0.875rem;
    font-size: 0.875rem;
    gap: 0.5rem;
  }
  
  .simple-dropdown-item:hover {
    transform: translateX(2px);
  }
  
  .simple-teacher-avatar-chat {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .simple-attachment-image {
    max-height: 200px;
    min-height: 100px;
  }
  
  .simple-attachment-image-container {
    margin: 0.5rem 0;
  }
  
  .simple-preview-image {
    width: 45px;
    height: 45px;
  }
  
  .simple-modal-title {
    font-size: 1.1rem;
  }
}

/* Additional Dark Mode Coverage for Modal Header */
[data-theme="dark"] .modal-overlay .simple-modal-content .simple-modal-header {
  background: #20c997 !important;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%) !important;
  color: #E8F5E8 !important;
}

[data-theme="dark"] .modal-overlay .simple-modal-content .simple-modal-header::after {
  background: #20c997;
  background: linear-gradient(135deg, #20c997 0%, #20c997 100%);
}

[data-theme="dark"] .modal-overlay .simple-modal-content .simple-modal-header * {
  background: transparent !important;
  color: #E8F5E8 !important;
}

[data-theme="dark"] .simple-modal-header input,
[data-theme="dark"] .simple-modal-header textarea,
[data-theme="dark"] .simple-modal-header .input,
[data-theme="dark"] .simple-modal-header .search-input,
[data-theme="dark"] .simple-modal-header [class*="input"],
[data-theme="dark"] .simple-modal-header [class*="subject"] {
  background: transparent !important;
  color: #E8F5E8 !important;
  border: none !important;
  box-shadow: none !important;
}

/* Attachment indicators */
.notification-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.attachment-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.375rem;
  background: #e1f5fe;
  color: #0277bd;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.attachment-indicator svg {
  width: 12px;
  height: 12px;
  opacity: 0.8;
}

[data-theme="dark"] .attachment-indicator {
  background: #0d47a1;
  color: #bbdefb;
}

.enhanced-attachment-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.75rem;
}

.enhanced-attachment-indicator svg {
  width: 12px;
  height: 12px;
  opacity: 0.7;
}

[data-theme="dark"] .enhanced-attachment-indicator {
  color: #999;
}

/* ================================
   REFRESH BUTTON STYLES
   ================================ */

/* Header Actions */
.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

/* Page Refresh Button */

/* Modal Header Actions */
.simple-header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Modal Refresh Button */
.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #20c997, #17a085);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 6px rgba(32, 201, 151, 0.2);
}

.refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #17a085, #138a72);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.35);
}

.refresh-btn:active:not(:disabled) {
  transform: translateY(0px);
  box-shadow: 0 2px 6px rgba(32, 201, 151, 0.2);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 6px rgba(32, 201, 151, 0.1);
  background: linear-gradient(135deg, #20c997, #17a085);
}

.refresh-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

/* Spin Animation */
.refresh-btn svg.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Dark Mode Support */
.dark .refresh-btn {
  background: linear-gradient(135deg, #20c997, #17a085);
  color: white;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3);
}

.dark .refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #17a085, #138a72);
  box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
}

.dark .refresh-btn:disabled {
  background: linear-gradient(135deg, #20c997, #17a085);
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.2);
}
</style>
