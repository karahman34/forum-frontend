import { http } from '@/plugins/httpPlugin'

export default {
  sendVerifyEmail() {
    return http.post('/send-verify-email')
  }
}
