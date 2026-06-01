# Shopping CMS - E-commerce Product Portal

Dự án này là một phân hệ cổng thông tin sản phẩm E-commerce (Product CMS Portal) được phát triển bằng **Next.js (App Router)** kết hợp với **Redux Toolkit** và **Redux-Observable (RxJS)** để quản lý side-effects nâng cao.

Dự án áp dụng các thực hành lập trình tốt nhất theo yêu cầu của Leader, bao gồm việc đóng gói custom hooks, phân tách component chặt chẽ, tối ưu luồng gọi API và kiểm thử tự động toàn diện.

---

## 🚀 Công nghệ & Kiến trúc áp dụng

### 1. Kiến trúc luồng gọi API Reactive (RxJS & Redux-Observable)
Thay vì sử dụng Promise (`fetch` / `axios` kết hợp `async/await`), toàn bộ luồng xử lý không đồng bộ của phần **Product API** đã được refactor hoàn toàn sang RxJS Observables:
* **API Client (`product.api.ts`)**: Sử dụng `ajax.getJSON` từ thư viện `rxjs/ajax` trả về một `Observable<Post[]>`. Việc này biến API thành một nguồn dữ liệu "lười" (lazy stream), chỉ thực thi khi có subscription thực tế từ Epic.
* **Redux Epic (`product.epic.ts`)**: Lắng nghe action `fetchProducts` bằng `switchMap` kết hợp trực tiếp với API Observable mà không cần wrap qua `from()`.

#### 🛡️ Cơ chế Hủy Request (Network-Level Cancellation)
Ưu điểm vượt trội của kiến trúc này là khả năng tự động hủy yêu cầu mạng cũ khi có yêu cầu mới xuất hiện (ví dụ: chuyển trang liên tục hoặc tìm kiếm nhanh):
* Khi `switchMap` nhận được một action mới, nó sẽ tự động hủy subscription (unsubscribe) khỏi request cũ đang chạy dở.
* Do `ajax` của RxJS được xây dựng trực tiếp trên nền tảng XMLHttpRequest/fetch hủy được, việc unsubscribe này sẽ kích hoạt `xhr.abort()`, **chấm dứt ngay lập tức kết nối HTTP trên tầng trình duyệt (hiển thị trạng thái `(canceled)` trong DevTools)**. Điều này giúp tiết kiệm tối đa tài nguyên đường truyền của người dùng và giảm tải cho server.

---

## 🛠️ Danh sách các yêu cầu đã hoàn thiện

### ✅ Yêu cầu kỹ thuật (Bắt buộc)
* **Dùng React Hooks**: Đóng gói hoàn chỉnh trong Custom Hook `useProducts` (`product.hooks.ts`) và các React Hooks tiêu chuẩn trong Component (`useState`, `useEffect`, `useMemo`).
* **Gọi API chuẩn hóa**: Sử dụng `ajax` của RxJS đúng chuẩn cấu trúc Redux-Observable (thay thế an toàn và mạnh mẽ hơn cho `fetch` / `axios` truyền thống).
* **Tách Component hợp lý**: 
  * Tách riêng component hiển thị hàng sản phẩm: [product-row.tsx](file:///d:/shopping%20cms/features/product/components/product-row.tsx)
  * Tách riêng component hiển thị sao đánh giá: [rating-star.tsx](file:///d:/shopping%20cms/features/product/components/rating-star.tsx)
  * Giúp component tổng [shop-section.tsx](file:///d:/shopping%20cms/features/product/components/shop-section.tsx) vô cùng gọn gàng và dễ bảo trì.
* **Code Clean & Dễ đọc**: Code được tổ chức mô-đun hóa theo các thư mục tính năng (`features/product`, `features/search`, `features/cart`, `features/filter`...), tuân thủ đúng chuẩn đặt tên, khai báo kiểu dữ liệu TypeScript nghiêm ngặt.

### ✅ Phần Bonus
* **Pagination (Phân trang dạng click số trang)**: Chuyển đổi từ Infinite Scroll sang Phân trang dạng nút bấm (8 sản phẩm/trang) với thanh điều khiển mượt mà, tự động reset về Trang 1 khi thay đổi tìm kiếm hoặc bộ lọc.
* **Debounce Search**: Tích hợp sẵn cơ chế trì hoãn tìm kiếm 300ms thông qua `searchDebounceEpic` giúp tối ưu hóa hiệu năng render và hạn chế spam lọc dữ liệu.
* **Custom Hook gọi API**: Cung cấp hook `useProducts` để che giấu hoàn toàn sự phức tạp của Redux dispatch và selector bên dưới, giúp UI Component chỉ việc gọi hook và render.

---

## 🏃 Hướng dẫn chạy Dự án

### 📋 Yêu cầu hệ thống
* Node.js phiên bản 18+ trở lên.
* npm hoặc yarn.

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy ứng dụng ở môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập ứng dụng tại địa chỉ: `http://localhost:3000`

### 3. Chạy bộ kiểm thử tự động (Unit Tests)
Dự án được bao phủ kiểm thử toàn diện với **Vitest**. Tất cả 94 tests (bao gồm các test case cho API, Epic hủy request, Slice reducer, Hooks và Component) đều đã được cấu hình chạy thành công.
```bash
npm run test
```

---

## 📁 Cấu trúc thư mục mô-đun sản phẩm

```text
features/product/
├── components/
│   ├── product-row.tsx          # Component hiển thị hàng sản phẩm (Mới tách)
│   ├── rating-star.tsx          # Component hiển thị sao đánh giá (Mới tách)
│   ├── shop-section.tsx         # Component tổng hợp giao diện cửa hàng và Phân trang (Cập nhật)
│   └── shop-section.spec.tsx    # Unit tests cho component UI
└── store/
    ├── product.api.ts           # Gọi API trả về RxJS Observable (Cập nhật)
    ├── product.api.spec.ts      # Unit tests cho API
    ├── product.epic.ts          # Epic quản lý side-effect & cancel request (Cập nhật)
    ├── product.epic.spec.ts     # Unit tests cho Epic hủy request
    ├── product.hooks.ts         # Custom Hook gọi API và select state
    ├── product.slice.ts         # Redux Slice quản lý state sản phẩm
    └── product.types.ts         # TypeScript types
```
