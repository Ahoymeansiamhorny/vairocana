<!--<script setup></script>-->

<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <SwitchDark class="dark" />
      <div class="login-left">
        <!-- <img class="login-left-img" src="@/assets/images/VVIPLOGO.png" alt="login" /> -->
      </div>
      <div class="login-form">
        <div class="login-logo">
          <!-- <img class="login-icon" src="@/assets/images/logo.svg" alt="" /> -->
          <h3 class="logo-text">Vairocana</h3>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup name="login">
import LoginForm from './components/LoginForm.vue'
import SwitchDark from '@/components/SwitchDark/index.vue'
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
