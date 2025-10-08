<template>
  <div class="pwa-handler">
    <!-- PWA Update Prompt -->
    <PwaUpdatePrompt />
    
    <!-- PWA Install Prompt -->
    <PwaInstallPrompt 
      v-if="showInstallPrompt"
      @install="handleInstall"
      @dismiss="handleDismiss"
    />
    
    <!-- Offline Notification -->
    <OfflineNotification />
    
    <!-- Developer testing button in development mode only -->
    <div v-if="isDev" class="fixed bottom-4 left-4 z-40">
      <button 
        @click="showDevPrompt"
        class="bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
      >
        Test Install Prompt
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useNuxtApp } from '#app';
import PwaUpdatePrompt from '~/components/ui/PwaUpdatePrompt.vue';
import PwaInstallPrompt from '~/components/ui/PwaInstallPrompt.vue';
import OfflineNotification from '~/components/ui/OfflineNotification.vue';

// Get PWA module 
const { $pwa } = useNuxtApp();
const showInstallPrompt = ref(false);

// Check if we're in development mode
const isDev = computed(() => process.dev);

// Track whether deferredPrompt was triggered
const deferredPromptTriggered = ref(false);
const deferredPrompt = ref<any>(null);

// Check if PWA installation has been dismissed before
const checkDismissedStatus = () => {
  if (typeof window === 'undefined') return false;
  
  const dismissedTime = localStorage.getItem('pwa_install_dismissed');
  if (!dismissedTime) return false;
  
  // Check if it's been at least 7 days since dismissal (in milliseconds)
  const now = new Date().getTime();
  const dismissedDate = parseInt(dismissedTime, 10);
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  
  return now - dismissedDate < sevenDays;
};

// Handle PWA installation
const handleInstall = async () => {
  
  try {
    // First, try to use the stored deferredPrompt if available
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      const userChoice = await deferredPrompt.value.userChoice;
      deferredPrompt.value = null;
    } 
    // Otherwise, use the PWA module
    else if ($pwa && $pwa.install) {
      await $pwa.install();
    }
  } catch (error) {
    console.error('Error during PWA installation:', error);
  } finally {
    showInstallPrompt.value = false;
  }
};

// Handle prompt dismissal
const handleDismiss = () => {
  showInstallPrompt.value = false;
  
  // Store dismissal timestamp in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('pwa_install_dismissed', new Date().getTime().toString());
  }
  
  // Try to use the official cancel method if available
  if ($pwa && $pwa.cancelInstall) {
    $pwa.cancelInstall();
  }
};

// Function for developers to test the prompt
const showDevPrompt = () => {
  showInstallPrompt.value = true;
};

// Watch the PWA module's showInstallPrompt property
watch(() => $pwa?.showInstallPrompt, (newVal) => {
  // Check if prompt has been dismissed recently
  const recentlyDismissed = checkDismissedStatus();
  
  if (newVal !== undefined && !recentlyDismissed) {
    showInstallPrompt.value = newVal;
  }
}, { immediate: true });

onMounted(() => {
  // Check if the browser supports PWA installation
  if (typeof window !== 'undefined') {
    // Don't show prompt if it was recently dismissed
    const recentlyDismissed = checkDismissedStatus();
    
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the default browser mini-infobar
      e.preventDefault();
      // Store the event for later use
      deferredPrompt.value = e;
      deferredPromptTriggered.value = true;
      
      // Only show prompt if not recently dismissed
      if (!recentlyDismissed) {
        showInstallPrompt.value = true;
      }
    });
    
    window.addEventListener('appinstalled', () => {
      showInstallPrompt.value = false;
      deferredPrompt.value = null;
      
      // Store installation status
      localStorage.setItem('pwa_installed', 'true');
    });
  }
});
</script>
