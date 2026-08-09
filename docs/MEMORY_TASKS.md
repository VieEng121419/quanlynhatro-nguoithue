# 📝 MEMORY TASKS

> File ghi nhớ công việc. **Đọc file này trước khi bắt đầu bất kỳ task nào** để nắm được context dự án, việc đã làm và việc kế tiếp.

---

## 🏠 Tổng quan dự án (Project Overview)

- **Tên dự án:** Quản lý nhà trọ - Người thuê (quanlynhatro-nguoithue)
- **Mô tả:** Ứng dụng PWA dành cho người thuê trọ, giúp:
  - Quét mã QR để truy cập thông tin phòng
  - Xem hoá đơn
  - Xem dịch vụ
  - Quản lý thông tin cá nhân
  - Thanh toán bằng cách quét mã QR
- **Giao diện:** Mobile-first (tối đa 390px), theme màu chủ đạo **#A73414** (đỏ cam), nền **#FFF8F6**
- **Ngôn ngữ UI:** Tiếng Việt

---

## 🧰 Tech Stack

| Công nghệ | Phiên bản |
|---|---|
| [Next.js](https://nextjs.org/) (App Router) | 14.2.35 |
| React | ^18 |
| TypeScript | ^5 |
| Tailwind CSS | ^3.4.1 |
| next-pwa | ^5.6.0 (PWA + manifest) |
| lucide-react | ^1.27.0 (icons) |
| Radix UI | Avatar, Dialog, Tabs, Toast |
| class-variance-authority + tailwind-merge + clsx | UI utilities |

### Cấu trúc thư mục chính

```
src/
├── app/
│   ├── layout.tsx        # Root layout (Providers + BottomNav)
│   ├── page.tsx          # Trang chủ (redirect)
│   ├── home/             # Trang chủ
│   ├── invoices/         # Hoá đơn
│   ├── services/         # Dịch vụ
│   ├── profile/          # Cá nhân
│   └── login/            # Đăng nhập (quét QR)
├── components/
│   ├── ui/               # shadcn-style UI components
│   ├── BottomNav.tsx     # Bottom navigation
│   └── Providers.tsx     # Providers wrapper
├── hooks/
│   ├── useAuth.ts        # Auth hook (tạm thời isLoggedIn = false)
│   └── use-toast.ts      # Toast hook
├── lib/
│   └── utils.ts          # cn() utility
└── middleware.ts
```

### Quy ước code

- Dùng `"use client"` cho component dùng hooks (next/navigation, etc.)
- UI components dùng pattern `React.forwardRef` + `cn()` từ `@/lib/utils`
- Import alias: `@/` → `src/`
- Chạy dev: `npm run dev` (port **3002**)
- Lint: `npm run lint` / `npx next lint`

---

## ✅ Checklist đã làm (Completed)

- [x] **Refactor Warning Alert → CardAlert component**
  - Tạo component dùng lại: `src/components/ui/card-alert.tsx`
  - Props: `children` (nội dung message) + `className` (tuỳ chỉnh)
  - Nhận `@/lib/utils` `cn()`, export `{ CardAlert }`
  - Đã thay thế Warning Alert trong `src/app/login/page.tsx` dùng `<CardAlert>`
  - Lint pass: `✔ No ESLint warnings or errors`
  - Lưu ý: `npx tsc --noEmit` lỗi sẵn do môi trường (`Cannot find type definition file for 'minimatch'`) — **không liên quan** đến code thay đổi

- [x] Dựng sẵn các trang: home, invoices, services, profile, login
- [x] Bottom navigation (`BottomNav.tsx`) — ẩn trên `/login`
- [x] Cấu hình PWA (manifest, service worker)
- [x] UI components cơ bản: button, card, badge, dialog, tabs, avatar, skeleton, toast, input, sheet

---

## 🚀 Next Steps

- [ ] **Login flow thật:** tích hợp camera quét mã QR (`navigator.mediaDevices` / thư viện) thay cho nút "Nhấn để quét mã QR" giả
- [ ] **Nhập mã thủ công:** xử lý action cho nút "Nhập mã thủ công" (nhập mã phòng → tra cứu thông tin)
- [ ] **Auth:** hoàn thiện `useAuth` / xử lý đăng nhập, lưu token, middleware bảo vệ route
- [ ] **Kết nối API:** tích hợp backend để lấy dữ liệu thật cho hoá đơn, dịch vụ, thông tin phòng
- [ ] **Chi tiết trang:** hoàn thiện nội dung các trang home/invoices/services/profile
- [ ] Kiểm tra toàn bộ app bằng `npm run build` sau khi fix lỗi type `minimatch` trong môi trường

---

## 📌 Ghi chú

- Nếu bắt đầu task mới: **đọc file này trước**, cập nhật lại checklist sau khi hoàn thành.
- Mọi quyết định lớn (kiến trúc, thư viện mới) nên ghi lại ở đây để lần sau làm việc nhanh hơn.