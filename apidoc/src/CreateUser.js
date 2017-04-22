/**
 * @api {get} /v1/users Create User
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 0.1.0
 *
 * @apiParam {string} username name of user.
 * @apiParam {string} password password of user.
 * @apiParam {string= "company", "resume"} type type of user.
 *
 * @apiSuccess (success 201) {Integer} id id of user.
 * @apiSuccess (success 201) {String} username username of user.
 * @apiSuccess (success 201) {String} type type of user.
 *
 * @apiSuccessExample {json} Success:
 *    HTTP/1.1 201 OK
 *     {
 *        "id": 1,
 *        "username": "test",
 *        "type": "resume",
 *     }
 *
 * @apiError (Error 422) UnprocessableEntity Create user is unsuccessful.
 *
 * @apiErrorExample {json} Error 422:
 *     HTTP/1.1 422 Forbidden
 *     [
 *          {
 *              "param": "password",
 *              "msg": "password is required."
 *          },
 *          {
 *              "param": "type",
 *              "msg": "type is required."
 *          }
 *      ]
 *
 * @apiError (Error 500) IntenalServer Error about database.
 */
