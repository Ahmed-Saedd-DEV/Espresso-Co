/**
 * @swagger
 * /admin/products:
 *   post:
 *     summary: Create a product as an admin
 *     tags:
 *       - Admin Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - stock
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               price:
 *                 type: number
 *                 minimum: 0
 *               categoryId:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 stock:
 *                   type: integer
 *                 price:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 categoryId:
 *                   type: integer
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Admin role required.
 *       404:
 *         description: Category not found.
 * /admin/products/{id}:
 *   patch:
 *     summary: Update a product as an admin
 *     tags:
 *       - Admin Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               price:
 *                 type: number
 *                 minimum: 0
 *               categoryId:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 stock:
 *                   type: integer
 *                 price:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 categoryId:
 *                   type: integer
 *                   nullable: true
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Admin role required.
 *       404:
 *         description: Product not found.
 *   delete:
 *     summary: Delete a product as an admin
 *     tags:
 *       - Admin Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       204:
 *         description: Product deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Admin role required.
 *       404:
 *         description: Product not found.
 * /admin/products/{id}/images:
 *   post:
 *     summary: Upload product images as an admin
 *     tags:
 *       - Admin Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product images uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   productId:
 *                     type: integer
 *                   url:
 *                     type: string
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Admin role required.
 *       404:
 *         description: Product not found.
 *       409:
 *         description: Duplicate image or maximum image limit reached.
 * /admin/products/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete a product image as an admin
 *     tags:
 *       - Admin Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       204:
 *         description: Product image deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Admin role required.
 *       404:
 *         description: Image not found.
 */
module.exports = {};
