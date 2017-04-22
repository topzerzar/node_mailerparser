 /**
 * @api {get} /v1/users Get all users
 * @apiName getUser
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiSuccess (success 200) {Integer} id id of user.
 * @apiSuccess (success 200) {String} username username of user.
 * @apiSuccess (success 200) {String} type type of user.
 *
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 200 OK
 *      [
 *          {
 *              "id": 1,
 *              "username": "test",
 *              "type": "resume"
 *          }
 *      ]
 *
 * @apiError (Error 500) IntenalServer Error about database.
 */
