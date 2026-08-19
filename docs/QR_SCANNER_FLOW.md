# 📱 QrScanner Component — Flow Chi Tiết

> Tài liệu mô tả chi tiết luồng hoạt động của component `QrScanner` trong chức năng đăng nhập bằng mã QR.

---

## 📁 Các file liên quan

| File | Vai trò |
|---|---|
| `src/components/QrScanner.tsx` | Component quét QR — quản lý camera, xử lý quét, dừng scanner |
| `src/app/login/page.tsx` | Trang đăng nhập — render `QrScanner`, xử lý kết quả quét |
| `src/hooks/useQrLogin.ts` | Gọi API `/auth/qr-login` với mã phòng |
| `src/hooks/useAuth.ts` | Lưu token + user vào localStorage/cookie, điều hướng |

---

## 🔄 Tổng quan luồng (Workflow)

```
┌─────────────────────────────────────────────────────────────────┐
│  src/app/login/page.tsx (LoginPage)                             │
│                                                                 │
│  Người dùng nhấn "Nhấn để quét mã QR"                           │
│  → setShowScanner(true)                                         │
│  → Render <QrScanner> overlay                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/components/QrScanner.tsx                                   │
│                                                                 │
│  1. useEffect → startScanner()                                  │
│     - Thử camera sau (environment)                              │
│     - Fallback camera trước (user)                              │
│     - Fallback từng camera có sẵn                               │
│                                                                 │
│  2. Quét được QR → callback onScan(decodedText)                 │
│     - Gọi stopScanner() để dừng camera                          │
│     - Gọi onScanRef.current(decodedText)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/app/login/page.tsx (handleScan)                            │
│                                                                 │
│  setShowScanner(false)  → unmount QrScanner                     │
│  handleLogin(roomCode)                                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/hooks/useQrLogin.ts (login)                                │
│                                                                 │
│  POST /auth/qr-login { roomCode }                               │
│  → Trả về { accessToken, user }                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  src/hooks/useAuth.ts (login)                                   │
│                                                                 │
│  - Lưu accessToken vào localStorage + cookie                    │
│  - Lưu user vào localStorage                                    │
│  - router.push("/home") → vào trang chủ                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Chi tiết từng phần của QrScanner

### 1. Khởi tạo State & Refs

```tsx
const scannerRef = useRef<Html5Qrcode | null>(null);   // Giữ instance scanner
const onScanRef = useRef(onScan);                       // Giữ callback onScan mới nhất
const stoppingRef = useRef(false);                      // Cờ chống gọi stop() 2 lần
const [error, setError] = useState<string | null>(null); // Lỗi camera
const [retryCount, setRetryCount] = useState(0);         // Đếm số lần thử lại
```

| Biến | Mục đích |
|---|---|
| `scannerRef` | Lưu instance `Html5Qrcode` — đối tượng thư viện quản lý camera. Dùng `useRef` vì instance cần tồn tại xuyên suốt vòng đời mà không gây re-render. |
| `onScanRef` | Lưu callback `onScan` mới nhất từ cha. Dùng ref thay vì closure trực tiếp để tránh phải restart scanner khi callback thay đổi. |
| `stoppingRef` | Cờ boolean ngăn chặn 2 lần gọi `stop()` đồng thời — **đây chính là fix cho bug race condition**. |
| `error` | Hiển thị lỗi khi không truy cập được camera. |
| `retryCount` | Khi tăng giá trị này, `useEffect` khởi động sẽ chạy lại → khởi động lại scanner. |

---

### 2. Effect đồng bộ `onScan` mới nhất

```tsx
useEffect(() => {
  onScanRef.current = onScan;
}, [onScan]);
```

**Vì sao cần ref này?**

Khi `QrScanner` được mount, nó tạo scanner và truyền callback `onScan` vào `scanner.start()`. Callback này là một **closure** — nó "bắt giữ" giá trị `onScan` tại thời điểm scanner được tạo.

Nếu component cha re-render và truyền `onScan` mới (ví dụ: `handleScan` thay đổi vì `handleLogin` thay đổi), scanner vẫn đang chạy với closure cũ. Nếu ta **restart scanner** để cập nhật callback mới thì sẽ tốn tài nguyên và có thể gây lỗi.

**Giải pháp:** Dùng `onScanRef` — callback trong scanner chỉ cần gọi `onScanRef.current(decodedText)`, và effect này luôn cập nhật `onScanRef.current` với giá trị mới nhất. Scanner không cần restart.

---

### 3. Hàm `stopScanner` — Dừng scanner an toàn

```tsx
const stopScanner = useCallback(async () => {
  const scanner = scannerRef.current;
  if (!scanner || stoppingRef.current) return;  // (a) Kiểm tra tồn tại + cờ chống trùng

  const state = scanner.getState();              // (b) Kiểm tra trạng thái
  if (state !== Html5QrcodeScannerState.SCANNING && state !== Html5QrcodeScannerState.PAUSED) {
    return;
  }

  stoppingRef.current = true;                    // (c) Bật cờ
  try {
    await scanner.stop();                        // (d) Dừng camera
    await scanner.clear();                       // (e) Xóa DOM element
  } catch {
    // Bỏ qua lỗi nếu scanner đã dừng
  } finally {
    stoppingRef.current = false;                 // (f) Tắt cờ
  }
}, []);
```

**Từng bước:**

- **(a)** Nếu chưa có scanner (`scannerRef.current` là null) hoặc đang trong quá trình dừng (`stoppingRef.current === true`) → return ngay, không làm gì.
- **(b)** Gọi `scanner.getState()` để kiểm tra trạng thái hiện tại. Thư viện `html5-qrcode` có các trạng thái: `NOT_STARTED`, `SCANNING`, `PAUSED`, `STOPPED`. Chỉ khi scanner đang `SCANNING` hoặc `PAUSED` mới cần gọi `stop()`. Nếu đã `STOPPED` hoặc `NOT_STARTED` → return, tránh lỗi "Cannot stop, scanner is not running or paused".
- **(c)** Bật cờ `stoppingRef.current = true` — nếu có lời gọi `stopScanner()` thứ 2 chạy vào lúc này, nó sẽ bị chặn ở bước (a).
- **(d)** `await scanner.stop()` — dừng camera và giải phóng tài nguyên.
- **(e)** `await scanner.clear()` — xóa DOM element `#qr-reader` mà thư viện đã render vào.
- **(f)** Tắt cờ trong `finally` — đảm bảo cờ luôn được reset dù thành công hay thất bại.

---

### 4. Hàm `startScannerWithConfig` — Khởi động scanner với cấu hình

```tsx
const startScannerWithConfig = useCallback(
  (config: { facingMode?: string; deviceId?: { exact: string } }) => {
    const scanner = new Html5Qrcode("qr-reader");   // (a) Tạo instance mới
    scannerRef.current = scanner;                    // (b) Lưu vào ref

    return scanner.start(                            // (c) Bắt đầu quét
      config,                                        //     Cấu hình camera
      { fps: 10, qrbox: { width: 250, height: 250 } }, // 10 khung/giây, khung quét 250x250
      (decodedText) => {                             // (d) Callback khi quét được QR
        stopScanner();                               //     Dừng camera
        onScanRef.current(decodedText);              //     Gọi callback onScan mới nhất
      },
      () => { /* ignore per-frame errors */ },       // (e) Callback lỗi mỗi khung hình
    );
  },
  [stopScanner],
);
```

**Từng bước:**

- **(a)** Tạo instance `Html5Qrcode` mới, truyền vào `"qr-reader"` — đây là **ID của DOM element** mà thư viện sẽ render video camera vào. Element này nằm trong JSX (`<div id="qr-reader" />`).
- **(b)** Lưu instance vào `scannerRef` để các hàm khác (như `stopScanner`) có thể truy cập.
- **(c)** Gọi `scanner.start()` với 3 tham số:
  - **`config`**: Cấu hình camera — `{ facingMode: "environment" }` (camera sau), `{ facingMode: "user" }` (camera trước), hoặc `{ deviceId: { exact: "..." } }` (camera cụ thể).
  - **`{ fps: 10, qrbox: { width: 250, height: 250 } }`**: Quét 10 khung hình mỗi giây, khung quét QR 250x250 pixel.
  - **Callback quét thành công**: Khi phát hiện QR code:
    1. Gọi `stopScanner()` — dừng camera ngay để tránh quét lặp lại cùng một mã QR.
    2. Gọi `onScanRef.current(decodedText)` — truyền mã QR đã giải mã lên component cha.
  - **Callback lỗi mỗi khung**: Bỏ qua các lỗi nhỏ trong quá trình xử lý từng khung hình (khung mờ, thiếu sáng) — không ảnh hưởng đến luồng chính.

---

### 5. Hàm `startScanner` — Chiến lược chọn camera

```tsx
const startScanner = useCallback(async () => {
  setError(null);  // Reset lỗi trước khi thử

  // 1. Ưu tiên camera sau (environment) — đúng cho điện thoại
  try {
    await startScannerWithConfig({ facingMode: "environment" });
    return;
  } catch {
    // 2. Fallback: camera trước (user) — cho laptop
    try {
      await startScannerWithConfig({ facingMode: "user" });
      return;
    } catch {
      // 3. Cuối cùng: thử từng camera có sẵn
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices?.length) {
          await startScannerWithConfig({ deviceId: { exact: devices[0].id } });
          return;
        }
        throw new Error("no camera");
      } catch (err) {
        const message = ...;  // Xác định thông báo lỗi
        setError(message);
      }
    }
  }
}, [startScannerWithConfig]);
```

**Chiến lược 3 lớp (fallback chain):**

1. **Camera sau (`environment`)**: Ưu tiên nhất vì đây là camera chính trên điện thoại — người dùng thường quét QR bằng camera sau.
2. **Camera trước (`user`)**: Nếu camera sau không khả dụng (ví dụ: laptop chỉ có webcam), thử camera trước.
3. **Camera cụ thể (`deviceId`)**: Nếu cả 2 cách trên thất bại, liệt kê tất cả camera có sẵn bằng `Html5Qrcode.getCameras()` và thử camera đầu tiên.

Nếu tất cả đều thất bại:
- Lỗi `NotAllowedError` (người dùng từ chối quyền camera) → "Bạn đã từ chối quyền truy cập camera. Vui lòng cho phép camera trong trình duyệt!"
- Ngược lại → "Không thể truy cập camera. Vui lòng kiểm tra lại!"

---

### 6. Effect khởi động scanner

```tsx
useEffect(() => {
  startScanner();
}, [startScanner, retryCount]);
```

- Khi component **mount** → effect chạy lần đầu → gọi `startScanner()`.
- Khi `retryCount` **thay đổi** (người dùng nhấn "Thử lại") → effect chạy lại → gọi `startScanner()` lần nữa.
- `startScanner` được bọc trong `useCallback` với dependency `[startScannerWithConfig]` — nên nó chỉ thay đổi khi `startScannerWithConfig` thay đổi (mà hàm này lại phụ thuộc `[stopScanner]` — một hàm ổn định). Điều này đảm bảo effect không chạy lại vô ích.

---

### 7. Effect cleanup khi unmount

```tsx
useEffect(() => {
  return () => {
    stopScanner();
  };
}, [stopScanner]);
```

- Khi component bị **unmount** (ví dụ: `setShowScanner(false)` trong trang login, hoặc quét QR thành công), React chạy hàm cleanup này.
- Hàm cleanup gọi `stopScanner()` để dừng camera và giải phóng tài nguyên — tránh rò rỉ camera (camera vẫn sáng đèn sau khi đóng overlay).

---

### 8. Render UI

```tsx
return (
  <div className="fixed inset-0 z-50 bg-black/90 ...">  {/* Overlay toàn màn hình */}
    ...
    {error ? (
      // Hiển thị lỗi + nút "Thử lại"
    ) : (
      <>
        <div id="qr-reader" className="..." />  {/* Nơi thư viện render video camera */}
        <p>Đưa mã QR vào khung để quét</p>
      </>
    )}
  </div>
);
```

- **Overlay**: `fixed inset-0 z-50 bg-black/90` — phủ toàn màn hình, nền đen mờ 90%, nằm trên tất cả nội dung khác (z-index 50).
- **Nút đóng (X)**: Gọi `onClose` — component cha sẽ `setShowScanner(false)` để unmount.
- **Khi có lỗi**: Hiển thị thông báo lỗi + nút "Thử lại" (gọi `handleRetry` → tăng `retryCount` → effect khởi động lại scanner).
- **Khi bình thường**: Render `<div id="qr-reader">` — nơi thư viện `html5-qrcode` chèn video camera vào. **Lưu ý:** ID này phải **khớp chính xác** với chuỗi `"qr-reader"` truyền vào `new Html5Qrcode("qr-reader")`.

---

## 🐛 Bug "Cannot stop, scanner is not running or paused" — Nguyên nhân & Fix

### Nguyên nhân gốc: Race condition khi gọi `stop()` 2 lần

**Bước 1 — Quét được QR:**
- Callback `onScan` trong `QrScanner.tsx` gọi `scannerRef.current?.stop()` (bất đồng bộ) rồi **ngay lập tức** gọi `onScanRef.current(decodedText)`.

**Bước 2 — Unmount component:**
- `onScanRef.current` chính là `handleScan` trong `login/page.tsx`, hàm này gọi `setShowScanner(false)` → `QrScanner` bị unmount.
- Khi unmount, React chạy **cleanup effect** (useEffect return) — cleanup này cũng gọi `scannerRef.current?.stop()` **lần thứ 2** trên cùng scanner.

**Bước 3 — Race condition xảy ra:**
- Vì `stop()` là bất đồng bộ, cả 2 lần gọi chạy song song.
- Lần gọi thứ 2 chạy khi scanner đã bị dừng bởi lần gọi thứ 1 → ném lỗi **"Cannot stop, scanner is not running or paused"**.
- Lỗi này chỉ xuất hiện trong console, không chặn luồng chính → app vẫn điều hướng sang `/home` bình thường.

### Cách khắc phục

Trong `src/components/QrScanner.tsx`:

1. **Tạo hàm `stopScanner()` dùng chung** — cả callback quét QR lẫn cleanup unmount đều gọi hàm này thay vì gọi `stop()` trực tiếp.
2. **Thêm cờ `stoppingRef`** — ngăn chặn 2 lần gọi `stop()` chạy đồng thời. Nếu đang trong quá trình dừng, lần gọi thứ 2 sẽ bị bỏ qua.
3. **Kiểm tra trạng thái scanner trước khi dừng** — dùng `scanner.getState()` để chỉ gọi `stop()` khi scanner đang ở trạng thái `SCANNING` hoặc `PAUSED`. Nếu scanner đã dừng (state `NOT_STARTED` hoặc `STOPPED`), hàm sẽ return sớm mà không gọi `stop()`.
4. **Bọc try/catch** — mọi lỗi phát sinh trong quá trình dừng đều bị bỏ qua an toàn.

---

## 🔄 Vòng đời component (Lifecycle)

```
MOUNT
  │
  ├─ useEffect (đồng bộ onScan): onScanRef.current = onScan
  ├─ useEffect (khởi động): startScanner()
  │     ├─ Thử camera environment → thành công? → DỪNG
  │     ├─ Thất bại → Thử camera user → thành công? → DỪNG
  │     └─ Thất bại → Thử camera đầu tiên → thành công? → DỪNG
  │                       └─ Thất bại → setError(message)
  │
  ├─ Scanner chạy, quét từng khung hình (10fps)
  │
  │   QUÉT ĐƯỢC QR:
  │     ├─ stopScanner() → dừng camera, xóa DOM
  │     └─ onScanRef.current(decodedText) → cha xử lý đăng nhập
  │
  │   NGƯỜI DÙNG ĐÓNG (X):
  │     └─ onClose() → cha setShowScanner(false) → UNMOUNT
  │
UNMOUNT
  │
  └─ useEffect cleanup: stopScanner()
        ├─ Kiểm tra scanner tồn tại? Không → return
        ├─ Kiểm tra stoppingRef? Đang dừng → return
        ├─ Kiểm tra state? Không phải SCANNING/PAUSED → return
        └─ stop() + clear() → giải phóng camera
```

**Điểm mấu chốt của fix bug:** Trước đây, khi quét được QR, callback gọi `stop()` trực tiếp rồi unmount → cleanup gọi `stop()` lần 2 → lỗi race condition. Giờ đây, cả 2 nơi đều gọi chung hàm `stopScanner()` có 3 lớp bảo vệ: cờ `stoppingRef`, kiểm tra state, và try/catch — đảm bảo `stop()` chỉ được gọi đúng 1 lần trên scanner đang chạy.

---

## ⚠️ Lưu ý quan trọng

1. **ID `qr-reader` phải khớp** — ID trong `new Html5Qrcode("qr-reader")` phải giống hệt ID của `<div>` trong JSX. Nếu đổi một trong hai, scanner sẽ không render được.
2. **Không gọi `stop()` trực tiếp** — Luôn dùng hàm `stopScanner()` để đảm bảo an toàn, tránh race condition.
3. **Camera cần HTTPS hoặc localhost** — Trình duyệt chỉ cho phép truy cập camera trên HTTPS hoặc localhost. Nếu deploy lên HTTP, camera sẽ không hoạt động.
4. **Quyền camera** — Người dùng phải cho phép quyền truy cập camera. Nếu từ chối, component sẽ hiển thị thông báo lỗi tương ứng.