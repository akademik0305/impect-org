<script setup>
// definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

// async function handleLogin() {
//   if (!email.value || !password.value) {
//     error.value = 'Email va parolni kiriting'
//     return
//   }
//   loading.value = true
//   error.value = ''
//   // TODO: Supabase auth
//   // const { error: err } = await supabase.auth.signInWithPassword({ email, password })
//   await new Promise(r => setTimeout(r, 1200))
//   loading.value = false
//   // navigateTo('/admin')
// }

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Email va parolni kiriting'
    return
  }
  loading.value = true
  error.value = ''

  const supabase = useSupabaseClient()
  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (err) {
    error.value = 'Email yoki parol noto\'g\'ri'
    loading.value = false
    return
  }

  navigateTo('/admin')
}
</script>

<template>
  <div class="admin-login-root">
    <div class="login-bg">
      <div class="login-mesh" />
      <div class="login-grid" />
      <div class="shape s1" /><div class="shape s2" /><div class="shape s3" />
    </div>

    <div class="login-wrap">
      <!-- Logo -->
      <div class="login-logo">
        <div class="logo-mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <p class="logo-title">TARAQQIYOT</p>
          <p class="logo-sub">Admin Panel</p>
        </div>
      </div>

      <!-- Card -->
      <div class="login-card">
        <div class="card-header">
          <h1 class="card-title">Kirish</h1>
          <p class="card-desc">Faqat vakolatli xodimlar uchun</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="field">
            <label class="field-label">Email</label>
            <div class="field-wrap">
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <input
                v-model="email"
                type="email"
                placeholder="admin@taraqqiyot.uz"
                class="field-input"
                autocomplete="email"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="field">
            <label class="field-label">Parol</label>
            <div class="field-wrap">
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                class="field-input"
                autocomplete="current-password"
              />
              <button type="button" class="pass-toggle" @click="showPass = !showPass">
                <svg v-if="!showPass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <Transition name="err">
            <div v-if="error" class="error-msg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ error }}
            </div>
          </Transition>

          <!-- Button -->
          <button type="submit" class="login-btn" :class="{ loading }" :disabled="loading">
            <span v-if="!loading">Kirish</span>
            <span v-else class="btn-spinner" />
          </button>
        </form>

        <p class="login-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Xavfsiz SSL ulanish orqali
        </p>
      </div>

      <p class="login-footer">© 2025 TARAQQIYOT · UNDEF loyihasi</p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;900&display=swap');

.admin-login-root {
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  background: #05080f;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.login-bg { position: absolute; inset: 0; pointer-events: none; }
.login-mesh {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 15% 40%, rgba(26,86,219,.4) 0%, transparent 60%),
    radial-gradient(ellipse 50% 70% at 85% 60%, rgba(99,102,241,.2) 0%, transparent 60%);
}
.login-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
  background-size: 60px 60px;
}
.shape { position: absolute; border-radius: 50%; filter: blur(70px); }
.s1 { width:350px;height:350px;top:-80px;left:-80px;background:rgba(26,86,219,.2);animation:fl1 9s ease-in-out infinite; }
.s2 { width:250px;height:250px;bottom:10%;right:-60px;background:rgba(99,102,241,.15);animation:fl2 11s ease-in-out infinite; }
.s3 { width:180px;height:180px;top:40%;left:60%;background:rgba(96,165,250,.1);animation:fl1 13s ease-in-out infinite reverse; }
@keyframes fl1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,-25px) scale(1.05)} }
@keyframes fl2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,20px)} }

.login-wrap {
  position: relative; z-index: 10;
  width: 100%; max-width: 420px;
  display: flex; flex-direction: column; align-items: center; gap: 2rem;
}

.login-logo { display:flex;align-items:center;gap:.75rem; }
.logo-mark {
  width:44px;height:44px;border-radius:14px;
  background:linear-gradient(135deg,#1a56db,#7c3aed);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 8px 24px rgba(26,86,219,.4);
}
.logo-title { color:#fff;font-weight:900;font-size:1.1rem;letter-spacing:.05em;line-height:1; }
.logo-sub { color:#4a6fa5;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.2em;margin-top:2px; }

.login-card {
  width:100%;
  background:rgba(255,255,255,.04);
  backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,.1);
  border-radius:28px;
  padding:2.5rem;
  box-shadow:0 32px 80px rgba(0,0,0,.4);
}

.card-header { margin-bottom:2rem; }
.card-title { color:#fff;font-size:1.75rem;font-weight:900;letter-spacing:-.03em;margin-bottom:.375rem; }
.card-desc { color:#4a6fa5;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.15em; }

.login-form { display:flex;flex-direction:column;gap:1.25rem; }

.field { display:flex;flex-direction:column;gap:.5rem; }
.field-label { color:#94a3b8;font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.15em; }
.field-wrap { position:relative; }
.field-icon {
  position:absolute;left:14px;top:50%;transform:translateY(-50%);
  width:16px;height:16px;color:#4a6fa5;pointer-events:none;
}
.field-input {
  width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
  border-radius:14px;padding:.85rem 2.75rem .85rem 2.75rem;
  color:#fff;font-size:.9rem;font-family:inherit;outline:none;
  transition:border-color .2s,background .2s;box-sizing:border-box;
}
.field-input::placeholder { color:#334155; }
.field-input:focus { border-color:rgba(26,86,219,.7);background:rgba(26,86,219,.08); }
.pass-toggle {
  position:absolute;right:14px;top:50%;transform:translateY(-50%);
  background:none;border:none;cursor:pointer;color:#4a6fa5;padding:0;
  width:18px;height:18px;display:flex;align-items:center;
}
.pass-toggle svg { width:16px;height:16px; }
.pass-toggle:hover { color:#94a3b8; }

.error-msg {
  display:flex;align-items:center;gap:.5rem;
  background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.25);
  border-radius:12px;padding:.75rem 1rem;
  color:#fca5a5;font-size:.8rem;font-weight:600;
}
.error-msg svg { width:15px;height:15px;flex-shrink:0; }
.err-enter-active,.err-leave-active { transition:all .3s; }
.err-enter-from,.err-leave-to { opacity:0;transform:translateY(-8px); }

.login-btn {
  width:100%;padding:1rem;border-radius:14px;border:none;cursor:pointer;
  background:linear-gradient(135deg,#1a56db,#1e40af);
  color:#fff;font-size:.8rem;font-weight:900;text-transform:uppercase;
  letter-spacing:.15em;font-family:inherit;
  box-shadow:0 8px 24px rgba(26,86,219,.35);
  transition:transform .2s,box-shadow .2s,opacity .2s;
  display:flex;align-items:center;justify-content:center;min-height:52px;
}
.login-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 12px 32px rgba(26,86,219,.45); }
.login-btn:active:not(:disabled) { transform:translateY(0); }
.login-btn.loading,.login-btn:disabled { opacity:.7;cursor:not-allowed; }
.btn-spinner {
  width:18px;height:18px;border:2px solid rgba(255,255,255,.3);
  border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;
}
@keyframes spin { to { transform:rotate(360deg) } }

.login-note {
  display:flex;align-items:center;justify-content:center;gap:.4rem;
  color:#334155;font-size:.7rem;font-weight:600;margin-top:1.25rem;
}
.login-note svg { width:12px;height:12px; }

.login-footer { color:#1e293b;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.15em; }
</style>