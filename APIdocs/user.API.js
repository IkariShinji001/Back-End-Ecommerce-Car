/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           unique: true
 *         password:
 *           type: string
 *         email:
 *           type: string
 *           unique: true
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *         isVerified:
 *           type: boolean
 *           default: false
 *         verificationToken:
 *           type: string
 *           required: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */