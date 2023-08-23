<template>
  <footer class="bg-background-secondary min-h-[21rem] relative text-white">
    <div class="flex flex-col md:flex-row h-full mx-4 md:mx-8 lg:mx-14 xl:mx-22 2xl:mx-32 py-10 items-center ">
      <div class="max-w-[20rem] flex flex-col justify-between gap-4 text-center md:text-left">
        <img src="/logo.png" alt="" class="rounded-sm w-[90px] h-[90px] mx-auto md:mx-0">
        <ul class="list-disc list-inside text-sm marker:text-primary">
          <li>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni, illo?</li>
        </ul>
        <div class="flex items-center gap-5 text-white mb-4 mx-auto md:mx-0">
          <v-icon name="fa-facebook" class="w-6 h-6" />
          <v-icon name="fa-instagram" class="w-6 h-6" />
          <v-icon name="fa-skype" class="w-6 h-6" />
          <v-icon name="fa-twitter" class="w-6 h-6" />
        </div>
      </div>
      <section class="flex-1 grid md:grid-cols-2 xl:grid-cols-4 gap-8 py-8 text-center md:text-left">
        <div>
          <h2 class="text-2xl font-regular mb-4 md:mb-7">Explore</h2>
          <ul class="list-disc list-inside text-sm marker:text-primary">  
            <li>Home</li>
            <li>Movies</li>
            <li>Tw Shows</li>
            <li>Music</li>
            <li>Audiosbooks</li>
          </ul>
        </div>
        <div>
          <h2 class="text-2xl font-regular mb-4 md:mb-7">Company</h2>
          <ul class="list-disc list-inside text-sm marker:text-primary">
            <li>Terms Of Use</li>
            <li>Contact Us</li>
            <li>Out Team</li>
          </ul>
        </div>
        <div>
          <h2 class="text-2xl font-regular mb-4 md:mb-7">Help</h2>
          <ul class="list-disc list-inside text-sm marker:text-primary">
            <li>Privacy Policy</li>
            <li>Help Center</li>
            <li>Subscribe</li>
            <li>Faq</li>
          </ul>
        </div>
        <div class="max-w-xs">
          <h2 class="text-2xl font-regular mb-4 md:mb-7">Download App</h2>
          <ul class="list-disc list-inside text-sm marker:text-primary">
            <li>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni, illo?</li>
          </ul>
          <div class="grid grid-cols-2 gap-2 mt-4">
            <img src="/app-store.png" alt="" class="rounded-sm scale-75 sm:scale-90 xl:scale-100 mx-auto">
            <img src="/play-store.png" alt="" class="rounded-sm scale-75 sm:scale-90 xl:scale-100 mx-auto">
          </div>
        </div>
      </section>
    </div>
    <div class="h-16 bg-primary w-full flex items-center justify-center">
      <p class="text-sm">Copyright 2023 Company All Rights Reserved.</p>
    </div>
    <button class="absolute bottom-20 right-6" @click="scrollToTop">
      <v-icon name="md-keyboardarrowup" class="w-7 h-7 bg-primary p-1" />
    </button>
  </footer>
</template>

<script setup>

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Hace el desplazamiento suave
  });
};
</script>
