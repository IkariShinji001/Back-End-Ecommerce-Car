/**
 * @swagger
 * tags:
 *      name: User
 *      description: Quản lý User API - Cung cấp các endpoint liên quan đến người dùng.
 */

/**
 * @swagger
 * tags:
 *      name: Admin
 *      description: Quản lí User API
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Tên người dùng
 *           unique: true
 *         password:
 *           type: string
 *           description: Mật khẩu của người dùng
 *         email:
 *           type: string
 *           description: Địa chỉ email của người dùng
 *           unique: true
 *         firstName:
 *           type: string
 *           description: Tên của người dùng
 *         lastName:
 *           type: string
 *           description: Họ của người dùng
 *         phoneNumber:
 *           type: string
 *           description: Số điện thoại của người dùng
 *         role:
 *           type: string
 *           description: Vai trò của người dùng
 *         isVerified:
 *           type: boolean
 *           description: Trạng thái xác thực email của người dùng
 *           default: false
 *         verificationToken:
 *           type: string
 *           description: Mã xác thực email
 *           required: true
 *         createdAt:
 *           type: string
 *           description: Ngày tạo người dùng
 *           format: date-time
 * 
 *     
 */

/**
 * @swagger
 * /api/users:
 *      get: 
 *          summary: Lấy thông tin của tất cả user.
 *          tags: [Admin]
 *          description: Một mảng danh sách thông tin user.
 *          responses:
 *              200:
 *                  description: Successful.
 *                  schema:
 *                      type: array
 *                      items: 
 *                          $ref: "#/components/schemas/User"
 *              500:
 *                  description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/{id}:
 *      get: 
 *          summary: Lấy thông tin người dùng theo ID.
 *          tags: [User]
 *          description:  Lấy thông tin của một người dùng dựa trên ID.
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: ID của người dùng cần lấy thông tin.
 *              schema:
 *                type: string
 *          responses:
 *              200:
 *                  description: Successful.
 *                  schema:
 *                      type: object
 *                      items: 
 *                          $ref: "#/components/schemas/User"
 *              404:
 *                description: Không tìm thấy user.
 *          
 *              500:
 *                  description: Internal Server Error.
 */

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Tạo mới người dùng
 *     tags: [User]
 *     description: Tạo mới một người dùng trong hệ thống.
 *     requestBody:
 *       description: Thông tin người dùng mới.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *             example:
 *                username: duytran2003nobita
 *                password: meomeogaugau
 *                email: duytran@example.com
 *                firstName: Duy
 *                lastName: Trần
 *                phoneNumber: 0123456789
 *     responses:
 *       '201':
 *         description: Tài khoản người dùng đã được tạo thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Created
 *       '409':
 *         description: Tài khoản người dùng đã tồn tại.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Existed Account
 *       '500':
 *         description: Lỗi server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Đăng nhập.
 *     tags: [User]
 *     description: Xác thực người dùng và cấp token truy cập.
 *     requestBody:
 *       description: Thông tin đăng nhập.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: duytran2003nobita
 *               password: password123
 *     responses:
 *      '200':
 *        description: Đăng nhập thành công. Trả về token truy cập.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 * 
 *      '400':
 *        description: Sai tên người dùng hoặc mật khẩu.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *              example:
 *                error: Sai tên đăng nhập hoặc mật khẩu
 *        
 *      '401':
 *        description: Người dùng chưa xác thực email.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *              example:
 *                error: Chưa xác thực email
 *        
 *      '500':
 *        description: Lỗi server.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string        
 *    
 */


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [Admin]
 *     description: Xóa người dùng với ID cung cấp.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của người dùng cần xóa.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Người dùng đã được xóa thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Deleted
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Thông báo lỗi chi tiết.
 */


/**
 * @swagger
 * api/users/verify:
 *   get:
 *     summary: Xác thực người dùng
 *     tags: [User]
 *     description: Xác thực người dùng sử dụng mã xác thực được cung cấp trong query parameter.
 *     parameters:
 *       - name: token
 *         in: query
 *         description: Mã xác thực.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xác thực thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Xác thực thành công. Bạn có thể đăng nhập vào ứng dụng.
 *       404:
 *         description: Liên kết xác thực không hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Thông báo lỗi chi tiết.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Thông báo lỗi chi tiết.
 */