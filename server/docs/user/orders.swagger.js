/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       minimum: 1
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 total:
 *                   type: string
 *                   example: "99.90"
 *                 status:
 *                   type: string
 *                   enum: [PENDING]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       orderId:
 *                         type: integer
 *                       productId:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: string
 *       400:
 *         description: Invalid order payload or invalid order items.
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: One or more products not found.
 *       409:
 *         description: Insufficient stock for at least one product.
 *   get:
 *     summary: List orders for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [id, total, status, createdAt, updatedAt]
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, CANCELLED]
 *     responses:
 *       200:
 *         description: Orders listed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalRecords:
 *                       type: integer
 *       401:
 *         description: Authentication required.
 * /orders/{orderId}:
 *   get:
 *     summary: Get an order by ID for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Order details returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 total:
 *                   type: string
 *                 status:
 *                   type: string
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Order not found for this user.
 *   patch:
 *     summary: Cancel an order for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CANCELLED]
 *     responses:
 *       200:
 *         description: Order cancelled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 total:
 *                   type: string
 *                 status:
 *                   type: string
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Only cancellation is allowed for users.
 *       404:
 *         description: Order not found for this user.
 *       409:
 *         description: Only pending orders can be cancelled.
 */
module.exports = {};
