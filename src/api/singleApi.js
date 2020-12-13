import { http } from '@/plugins/httpPlugin'

export default {
  sendVerifyEmail() {
    return http.post('/send-verify-email')
  },
  sendResetPasswordMail(payload) {
    return http.post('/reset-password', payload)
  }
}
