# Minimap dạng sơ đồ + spot

Làm theo cách của dự án `hatinh_expo`: một ảnh sơ đồ làm nền, mỗi điểm chụp là một
`<layer>` con đặt theo toạ độ pixel trên ảnh. Click spot thì đổi scene. Điểm đang
đứng có pin đỏ và nón radar xoay theo hướng nhìn của pano.

Không dùng Google Maps, không API key, không gọi mạng — chạy offline hoàn toàn.

## File

| File | Vai trò |
|---|---|
| `skin/minimap.xml` | Toàn bộ minimap: khung, ảnh, 28 spot, nút, actions |
| `skin/minimap.jpg` | Ảnh sơ đồ nền (629 × 357) — bạn cung cấp |
| `plugins/radar.js` | Plugin radar chính thức của krpano |

`index.xml` thêm đúng một dòng `<include url="skin/minimap.xml" />`.
Toàn bộ phần Google Maps / tile XYZ đã gỡ sạch, `maps="false"` giữ nguyên.

## ⚠ Đọc trước khi cắm điểm

**Ảnh sơ đồ chỉ 629 × 357 px — toàn bộ chữ trên bản vẽ không đọc được.**
Đây là bản vẽ quy hoạch (phân khu màu, tên tuyến đường, số hiệu nút giao), rõ ràng
được xuất thu nhỏ từ file gốc vector. Phóng to hay làm nét bằng thuật toán đều vô ích —
chữ đã mất thì không tạo lại được.

Xin Ban QLDA / phòng QTTB file gốc rồi xuất lại ở **ít nhất 2500–3000 px chiều ngang**.
Thay **ngay bây giờ**, trước khi cắm 28 điểm — vì toạ độ spot tính bằng pixel của ảnh.
Nếu bản mới cùng tỉ lệ khung thì chỉ cần nhân toạ độ với `rộng_mới / 629`,
đưa mình file mới là mình quy đổi cho.

Hiện 28 spot xếp lưới ở giữa ảnh, chưa phải vị trí thật:
**mặt đất 6 × 3** (18 điểm), **trên cao 5 × 2** (10 điểm).

## Hai nhóm điểm: mặt đất / trên cao

10 pano drone khi chiếu xuống mặt bằng sẽ nằm chồng hoặc rất sát 18 điểm mặt đất,
hai pin đè nhau thì không bấm trúng cái nào. Nên **mỗi lúc chỉ hiện một nhóm**:

- Nút **"Mặt đất" / "Trên cao"** ở góc trái trên sơ đồ để đổi nhóm.
- Đổi sang scene thuộc nhóm kia thì sơ đồ **tự nhảy nhóm** theo (đọc thuộc tính
  `mmgroup` của spot), không phải bấm tay.
- Pin đỏ + nón radar chỉ hiện khi điểm đang đứng thuộc nhóm đang xem.
- Trong chế độ cắm điểm thì **hiện hết 28 điểm** để kéo được cả hai nhóm.

Nhóm của mỗi spot nằm ở thuộc tính `mmgroup="matdat"` / `mmgroup="trencao"`.

## Công cụ cắm điểm: `minimap-tool.html`

Mở `minimap-tool.html` bằng trình duyệt — double-click là chạy, không cần server,
vì ảnh sơ đồ đã nhúng sẵn trong file.

1. Chọn tab **Mặt đất** hoặc **Trên cao**.
2. Bấm một scene ở cột trái, rồi bấm lên sơ đồ tại đúng vị trí đã chụp.
3. Bật **"Tự sang điểm kế tiếp"** thì cắm xong một cái nó tự nhảy sang cái chưa cắm —
   cứ thế bấm liên tục cho nhanh.
4. Chỉnh tinh: kéo thả chấm, hoặc phím mũi tên dịch 1 px (giữ Shift = 10 px).
5. Xoay nón radar: thanh trượt **Hướng nón**, hoặc phím `[` `]` mỗi lần 5 độ.
6. Thu phóng tới 400% để cắm cho chính xác.
7. Bấm **Xuất XML**, bấm **Copy**, rồi dán **đè lên 28 dòng `<layer name="mmspot_...">`**
   trong `skin/minimap.xml`.

Định dạng xuất ra khớp từng ký tự với khối đang có trong file nên dán đè là chuẩn.

Tiến độ tự lưu vào trình duyệt (localStorage) — đóng tab mở lại vẫn còn.
Nút **Nhập XML** để nạp ngược khối đang có trong file vào công cụ mà sửa tiếp.

Chấm đỏ = mặt đất, vàng = trên cao, xanh = đang chọn, mờ = chưa cắm.

## Cắm điểm ngay trong tour (cách thay thế)

1. Mở tour. Sơ đồ nằm góc phải trên.
2. Nhấn **P** → sơ đồ tự phóng to, hiện các nút công cụ.
3. Bấm **"Cắm điểm: TẮT"** → chuyển **BẬT**. Lúc này click spot không đổi scene nữa,
   mà kéo thả được.
4. Kéo từng pin vào đúng chỗ trên sơ đồ. Rê chuột lên pin để xem tên điểm.
5. Muốn chỉnh hướng nón radar: vào scene đó, bấm **"Hướng -5"** / **"Hướng +5"**
   cho đến khi nón chỉ đúng hướng pano đang nhìn. Góc hiện ở đáy sơ đồ.
6. Bấm **"Xuất toạ độ"** → hiện khối XML bôi đen copy được.
7. Dán khối đó đè lên phần 28 `<layer name="mmspot_...">` trong `skin/minimap.xml`.

Toạ độ kéo lúc chạy chỉ nằm trong bộ nhớ, F5 là mất — phải xuất và dán vào file.

## Phím tắt & nút

- **M** — ẩn / hiện sơ đồ (ẩn rồi mở lại bằng nút "Sơ đồ")
- **P** — bật / tắt bộ công cụ cắm điểm
- **Phóng to / Thu nhỏ** — góc phải trên ⟷ giữa màn hình.
  Kích thước phóng to tự tính theo màn hình (92% ngang / 86% dọc, giữ đúng tỉ lệ ảnh)
  nên không tràn trên máy nhỏ hay điện thoại.

## Cách hoạt động

- `minimap_box` là khung **không** co giãn — nút bấm nằm trong đây nên chữ luôn giữ
  nguyên cỡ dù sơ đồ phóng to hay thu nhỏ.
- `minimap_img` là ảnh, có `scalechildren="true"` nên 28 spot co giãn theo ảnh.
- Spot dùng `x`/`y` tính từ **tâm ảnh**: x từ −314 đến +314, y từ −178 đến +178.
- `minimap_active` (pin đỏ) và `minimap_radar` (nón) là hai layer dùng chung; mỗi lần
  đổi scene, `minimap_update()` trỏ `parent` của chúng sang spot tương ứng —
  đúng thủ thuật của hatinh, đỡ phải nhân bản pin cho từng scene.
- `minimap_update()` được gọi từ **hai chỗ**: `onstart` của cả 28 `<scene>`
  (giống hatinh) và `<events onnewpano>` toàn cục. Gọi hai lần vô hại vì action chỉ
  gán lại parent/heading. Để cả hai cho chắc, phòng trường hợp một trong hai không kích hoạt.
- Khác hatinh một chỗ: hatinh chép nguyên phần thân `updateradar` vào trong từng
  `<scene>`; ở đây thân action nằm một chỗ trong `skin/minimap.xml`, mỗi scene chỉ
  gọi tên. Hành vi giống hệt, sửa một chỗ là 28 scene cùng đổi.
- Khi kéo spot, delta chuột được chia cho `layer[minimap_img].scale` vì spot là con
  của ảnh đã co giãn — không chia thì kéo bị lệch tỉ lệ.

### Click trên sơ đồ

| Trạng thái | Click vào ảnh | Click vào pin |
|---|---|---|
| Thu nhỏ ở góc | phóng to | **phóng to** (chưa đổi scene) |
| Đang phóng to | thu nhỏ | thu nhỏ + mờ dần → đổi scene → tải xong mới hiện lại |
| Chế độ cắm điểm | không làm gì | kéo thả, không đổi scene |

Khác hatinh một chỗ có chủ ý: hatinh cho đổi scene ngay cả khi sơ đồ đang thu nhỏ.
Ở đây sơ đồ thu nhỏ chỉ 264×150 mà chứa 28 pin (mỗi pin ~18×23 px) nên bấm rất dễ
trượt sang pin bên cạnh và nhảy nhầm scene. Vì vậy lúc thu nhỏ, click chỉ phóng to.

Nếu sau khi cắm xong thấy các pin nằm thưa, dễ bấm, thì đổi lại cho giống hatinh bằng
cách thay một dòng trong `minimap_goto` (đã ghi chú sẵn ngay tại chỗ đó):
`minimap_toggleexpand();` → `skin_loadscene(%1, get(skin_settings.loadscene_blend));`

### Điểm đang đứng

Icon thường tại chỗ đó bị `visible=false`, chỉ còn pin đỏ + nón radar. Rời sang scene
khác thì icon cũ hiện lại (nhớ qua biến `mm_prevspot`).

Vì thế pin đỏ và nón **không** làm con của spot mà làm con của ảnh, rồi chép `x`/`y`
của spot sang. Trong krpano ẩn layer cha thì con mất theo — gắn làm con của spot thì
vừa ẩn icon là pin đỏ biến mất luôn.

Trong chế độ cắm điểm, icon của điểm đang đứng được hiện lại để còn kéo được; tắt chế
độ đó thì ẩn lại.

## Còn thiếu

- **28 spot chưa đúng vị trí** (đang xếp lưới) và **heading toàn 0** — làm theo mục
  "Cách cắm điểm" ở trên.
- **Chưa chạy thử trên trình duyệt.** Đã kiểm: XML hợp lệ, 28/28 spot trỏ đúng tên
  scene, mọi `layer[]` và action được gọi đều đã khai báo.
