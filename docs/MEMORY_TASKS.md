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

- [x] **Tạo TopBar component (header toàn cục)**
  - Tạo component: `src/components/TopBar.tsx` dựa trên Figma (node `59-195`)
  - Cấu trúc: Avatar 40×40 (viền `#E0BFB7`) + tiêu đề "Chào, {tên}" + nút thông báo 44×44 với badge đỏ `#BA1A1A`
  - Nền `#FFF8F6`, bóng `0px 1px 2px rgba(0,0,0,0.05)`, cao 72px, `fixed top-0`, max-width 390px
  - Props: `userName`, `avatarUrl`, `unreadCount`, `onNotificationClick` — tự fallback lấy `user.fullName` từ `useAuth()`
  - **Cấu hình như header toàn cục** (giống `BottomNav` là footer): đặt trong `src/app/layout.tsx` `<TopBar />`, hiển thị mọi trang trừ `/login`
  - `main` trong layout được thêm `pt-[72px]` để bù chiều cao TopBar cố định
  - Lint pass: `✔ No ESLint warnings or errors`

- [x] **Tạo DebtAlert component (cảnh báo nợ cước)**
  - Tạo component: `src/components/ui/debt-alert.tsx` dựa trên Figma (node `59-100`)
  - Cấu trúc: Icon `TriangleAlert` 22×19 màu `#BA1A1A` + tiêu đề "Cảnh Báo Nợ Cước" (Semi Bold 16px) + message
  - Nền `#FFDAD6`, rounded-[20px], text màu `#93000A`
  - Props: `children` (nội dung message) + `className` (tuỳ chỉnh)
  - Nhận `@/lib/utils` `cn()`, export `{ DebtAlert }`
  - Đã tích hợp vào `src/app/home/page.tsx` — hiển thị khi hoá đơn có status `UNPAID` hoặc `OVERDUE`
  - Lint pass: `✔ No ESLint warnings or errors`

- [x] **Cập nhật font Mona Sans cho toàn bộ source**
  - Cài đặt package `@fontsource/mona-sans` (font của GitHub)
  - Import CSS `@fontsource/mona-sans/400|500|600|700.css` + `latin-ext-*` (hỗ trợ tiếng Việt) trong `src/app/layout.tsx`
  - Body dùng `font-sans` mặc định trong `src/app/globals.css`
  - Cấu hình `fontFamily.sans: ["'Mona Sans'", "system-ui", "sans-serif"]` trong `tailwind.config.ts`
  - Loại bỏ font `Inter` (Google Fonts) và `JetBrains_Mono` khỏi `layout.tsx`
  - Lint pass: `✔ No ESLint warnings or errors`

- [x] **Tạo UtilityInfo component (Điện & Nước)**
  - Tạo component: `src/components/UtilityInfo.tsx` dựa trên Figma (node `59-108`)
  - Cài đặt `chart.js`, `react-chartjs-2`, `react-day-picker`, `date-fns`
  - Cấu trúc: Tiêu đề "Điện & Nước tháng {tháng}" + button date picker chọn tháng
  - 2 bar chart: Điện `#A73414`, Nước `#0051D5`, background `#FFE9E4`
  - Label số điện (icon Zap) + số nước (icon Droplets)
  - "Chi phí dự kiến: ~{serviceAmount - 10000}đ"
  - Nền `#FFFFFF`, radius `20px`
  - Tích hợp vào `src/app/home/page.tsx` với data mẫu (`electricityUsage=120`, `waterUsage=8`)
  - Lint pass: `✔ No ESLint warnings or errors`

- [x] **Tạo TransactionHistory component (Lịch sử giao dịch)**
  - Tạo component: `src/components/TransactionHistory.tsx`
  - Cấu trúc Card: `rounded-t-[20px]`, box-shadow nhẹ, divider ngang
  - Header: "Lịch sử giao dịch gần đây" (Bold) + button "Xem tất cả"
  - Mỗi item 3 cột: Icon tròn (Receipt cho tiền phòng / Archive cho điện nước) + Title/Date + Amount/Status
  - Phân cách giữa các item bằng `divide-y`
  - Tích hợp vào `src/app/home/page.tsx` với data mẫu
  - **Status/Amount mapping**: `PAID` → "Đã thanh toán" (`-amount`), `PARTIAL` → "Chưa thanh toán đủ" (`~amount`), `UNPAID` → "Chưa thanh toán" (`+amount`)
  - Lint pass: `✔ No ESLint warnings or errors`
- [x] Dựng sẵn các trang: home, invoices, services, profile, login
- [x] Bottom navigation (`BottomNav.tsx`) — ẩn trên `/login`
- [x] Cấu hình PWA (manifest, service worker)
- [x] UI components cơ bản: button, card, badge, dialog, tabs, avatar, skeleton, toast, input, sheet

- [x] **Fix bug "Cannot stop, scanner is not running or paused" trong QrScanner**
  - **Nguyên nhân:** Race condition — khi quét được QR, callback gọi `stop()` (async) rồi unmount → cleanup gọi `stop()` lần 2 trên cùng scanner → lỗi
  - **Fix:** Tạo hàm `stopScanner()` dùng chung với 3 lớp bảo vệ:
    1. Cờ `stoppingRef` chống gọi `stop()` đồng thời
    2. Kiểm tra `scanner.getState()` — chỉ dừng khi `SCANNING`/`PAUSED`
    3. Bọc try/catch bỏ qua lỗi
  - Cả callback quét QR lẫn cleanup unmount đều gọi chung `stopScanner()`
  - `npx tsc --noEmit` pass (exit code 0)
  - **Tài liệu chi tiết:** `docs/QR_SCANNER_FLOW.md`
- [x] **Fix bug "Cannot stop, scanner is not running or paused" trong QrScanner**
  - **Nguyên nhân:** Race condition — khi quét được QR, callback gọi `stop()` (async) rồi unmount → cleanup gọi `stop()` lần 2 trên cùng scanner → lỗi
  - **Fix:** Tạo hàm `stopScanner()` dùng chung với 3 lớp bảo vệ:
    1. Cờ `stoppingRef` chống gọi `stop()` đồng thời
    2. Kiểm tra `scanner.getState()` — chỉ dừng khi `SCANNING`/`PAUSED`
    3. Bọc try/catch bỏ qua lỗi
  - Cả callback quét QR lẫn cleanup unmount đều gọi chung `stopScanner()`
  - `npx tsc --noEmit` pass (exit code 0)
  - **Tài liệu chi tiết:** `docs/QR_SCANNER_FLOW.md`

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