/**
 * EcoLink Portal Core Controller (app.js)
 * Handles Auth Sessions, KYC Modals, Mobile Drawers & Shared Utilities
 */

const EcoLink = {
  TOKEN_KEY: 'ecolink_token',
  USER_KEY: 'ecolink_user',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  setSession(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  },

  clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  },

  getUser() {
    const saved = localStorage.getItem(this.USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const token = this.getToken();
    if (token) return this.parseJwt(token);
    return null;
  },

  /**
   * Require login on portal pages
   */
  requireAuth() {
    const token = this.getToken();
    if (!token) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  /**
   * Initialize Top Header and User Badges
   */
  async initHeader() {
    const token = this.getToken();
    if (!token) return;

    let user = this.getUser();

    // Optionally fetch latest from API
    try {
      const res = await fetch('/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        user = data.user;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    } catch (e) {}

    if (user) {
      const nameEl = document.getElementById('header-user-name');
      const roleEl = document.getElementById('header-user-role');
      const avatarEl = document.getElementById('header-user-avatar');
      const kycBadgeEl = document.getElementById('header-kyc-badge');
      const bannerGreeting = document.getElementById('banner-greeting');

      const displayName = user.firstname ? `${user.firstname} ${user.lastname || ''}` : user.email?.split('@')[0];
      const companyOrRole = user.company || user.role || 'โรงงานอุตสาหกรรม';

      if (nameEl) nameEl.innerText = displayName;
      if (roleEl) roleEl.innerText = companyOrRole;
      if (avatarEl) avatarEl.innerText = (user.firstname || user.email || 'E')[0].toUpperCase();
      if (bannerGreeting) {
        bannerGreeting.innerText = `ยินดีต้อนรับ, ${displayName} – ${user.company || 'EcoLink'}`;
      }

      if (kycBadgeEl) {
        const kyc = user.kycStatus || 'รอการยืนยัน';
        let badgeClass = 'badge-warning';
        let badgeIcon = '⏳';

        if (kyc === 'ผ่านการยืนยัน') {
          badgeClass = 'badge-verified';
          badgeIcon = '🛡️';
        } else if (kyc === 'อยู่ระหว่างตรวจสอบ') {
          badgeClass = 'badge-warning';
          badgeIcon = '📋';
        }

        kycBadgeEl.className = `badge ${badgeClass}`;
        kycBadgeEl.innerHTML = `${badgeIcon} <b>${kyc}</b>`;
      }
    }
  },

  /**
   * Mobile Sidebar Drawer Toggle
   */
  initMobileDrawer() {
    const toggleBtn = document.getElementById('btn-menu-toggle');
    const sidebar = document.querySelector('.portal-sidebar');
    let backdrop = document.querySelector('.portal-backdrop');

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'portal-backdrop';
      document.body.appendChild(backdrop);
    }

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('show');
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('show');
      });
    }
  },

  /**
   * Logout with SweetAlert confirmation
   */
  handleLogout() {
    Swal.fire({
      title: 'ต้องการออกจากระบบ?',
      text: 'คุณจะต้องเข้าสู่ระบบใหม่เพื่อเข้าถึงข้อมูลโรงงานของคุณ',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clearSession();
        window.location.href = 'login.html';
      }
    });
  },

  /**
   * KYC Verification Modal
   */
  verifyKYC() {
    Swal.fire({
      title: 'ยืนยันตัวตนโรงงาน (KYC)',
      html: `
        <div style="text-align: left; font-size: 13.5px; color: #475569; margin-bottom: 16px;">
          <p style="margin-bottom: 8px;">อัปโหลดสำเนา <b>ใบอนุญาตประกอบกิจการโรงงาน (ร.ง.4)</b> หรือหนังสือรับรองนิติบุคคล เพื่อรับป้าย <b>Verified Member 🛡️</b> และสิทธิประโยชน์:</p>
          <ul style="padding-left: 20px; font-size: 12.5px; color: #16a34a; line-height: 1.6;">
            <li>ความน่าเชื่อถือระดับสูงสุดใน B2B Marketplace</li>
            <li>ได้รับการแนะนำโรงงานด้วย AI Matching เป็นลำดับแรก</li>
            <li>วงเงินคุ้มครองธุรกรรมผ่าน Escrow สูงสุด</li>
          </ul>
        </div>
        <input type="file" id="swal-kyc-file" accept=".pdf,.png,.jpg,.jpeg" class="swal2-input" style="padding:10px; width:88%; font-size: 13px;">
      `,
      confirmButtonText: 'อัปโหลดเอกสารยืนยัน',
      confirmButtonColor: '#1a6b3c',
      showCancelButton: true,
      cancelButtonText: 'ไว้คราวหลัง',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const fileInput = document.getElementById('swal-kyc-file');
        const file = fileInput?.files[0];
        if (!file) {
          Swal.showValidationMessage('กรุณาเลือกไฟล์เอกสาร (PDF หรือ รูปภาพ)');
          return false;
        }

        const token = this.getToken();
        const formData = new FormData();
        formData.append('kycDocument', file);

        try {
          const res = await fetch('/api/v1/users/kyc', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'อัปโหลดไม่สำเร็จ');
          return data;
        } catch (error) {
          Swal.showValidationMessage(`ข้อผิดพลาด: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          icon: 'success',
          title: 'อัปโหลดสำเร็จ!',
          text: result.value.message || 'เจ้าหน้าที่จะทำการตรวจสอบข้อมูลภายใน 1-2 วันทำการ',
          confirmButtonColor: '#1a6b3c'
        }).then(() => {
          this.initHeader();
        });
      }
    });
  }
};

// Global shorthand
window.EcoLink = EcoLink;
window.handleLogout = () => EcoLink.handleLogout();
window.verifyKYC = () => EcoLink.verifyKYC();
