// User data-access service. Thin wrapper around Base44 auth today.

import { base44 } from "@/api/base44Client";

export const userService = {
  async me() {
    try {
      return await base44.auth.me();
    } catch {
      return null;
    }
  },

  async isAuthenticated() {
    try {
      return await base44.auth.isAuthenticated();
    } catch {
      return false;
    }
  },

  async updateMe(data) {
    return base44.auth.updateMe(data);
  },

  async logout(redirectUrl) {
    return base44.auth.logout(redirectUrl);
  },
};