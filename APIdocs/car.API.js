/**
 * @swagger
 * components:
 *  schemas:
 *   Car:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       make:
 *         type: string
 *         description: Nhãn hiệu xe
 *       model:
 *         type: string
 *         description: Mô hình xe
 *       classification:
 *         type: string
 *         description: Phân loại xe
 *       year:
 *         type: integer
 *         description: Năm sản xuất
 *       price:
 *         type: number
 *         description: Giá xe
 *       description:
 *         type: object
 *         properties:
 *           transmission:
 *             type: string
 *             description: Hộp số xe
 *           fuelType:
 *             type: string
 *             description: Loại nhiên liệu
 *           color:
 *             type: array
 *             items:
 *               type: string
 *             description: Màu sắc (mảng các chuỗi)
 *           seats:
 *             type: integer
 *             description: Số ghế
 *           features:
 *             type: array
 *             items:
 *               type: string
 *             description: Các tính năng xe (mảng các chuỗi)
 *           dimensions:
 *             type: object
 *             properties:
 *               length:
 *                 type: number
 *                 description: Chiều dài (mm)
 *               width:
 *                 type: number
 *                 description: Chiều rộng (mm)
 *               height:
 *                 type: number
 *                 description: Chiều cao (mm)
 *           wheelbase:
 *             type: number
 *             description: Chiều dài cơ sở (mm)
 *           engineSpecs:
 *             type: object
 *             properties:
 *               engineType:
 *                 type: string
 *                 description: Loại động cơ
 *               displacement:
 *                 type: number
 *                 description: Dung tích công tác (cc)
 *               maxPower:
 *                 type: string
 *                 description: Công suất cực đại (kW)
 *               maxTorque:
 *                 type: string
 *                 description: Mô-men xoắn cực đại (Nm)
 *           driveType:
 *             type: string
 *             description: Dẫn động
 *           acceleration:
 *             type: number
 *             description: Thời gian tăng tốc 0-100km/h (giây)
 *           topSpeed:
 *             type: number
 *             description: Vận tốc tối đa (km/h)
 *       images:
 *         type: array
 *         items:
 *           type: string
 *         description: Mảng chứa các URL hình ảnh
 *       createdAt:
 *         type: string
 *         format: date-time
 *         description: Ngày tạo bản ghi
 */