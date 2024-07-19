// Use this file only as a guide for first steps using routes. Delete it when you have added your own route files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/usage/routes

// users data
const USERS = [
  {
    id: 1,
    name: 'John Doe'
  },
  {
    id: 2,
    name: 'Jane Doe'
  }
]

const ALL_USERS = [
  ...USERS,
  {
    id: 3,
    name: 'Tommy'
  },
  {
    id: 4,
    name: 'Timmy'
  }
]

module.exports = [
  {
    id: 'get-users', // route id
    url: '/pub/auth/login', // url in express format
    method: 'POST', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: {
            code: 1000,
            data: {
              access_token:
                'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI2OTkxMDk3NjIsImp0aSI6IjAyYjU0YzEzLTEwZTctNGFhNy04NWQzLTNlMjM1Y2Q3ODFkNyIsImlhdCI6MTY5OTEwNjE2MiwibmJmIjoxNjk5MTA2MTYyLCJzdWIiOiIyLWhqYWRtaW4wMyJ9.Mxt10iv3zrXkEufZwDgegCpP188rzsFEGXYvICBCwWPWeAEvClC6v4Tb--Wepe5evs0XWSD0QqVs9E0uoTN7dw',
              refresh_token:
                'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkxMTMzNjIsImp0aSI6IjAyYjU0YzEzLTEwZTctNGFhNy04NWQzLTNlMjM1Y2Q3ODFkNyIsImlhdCI6MTY5OTEwNjE2MiwibmJmIjoxNjk5MTA2MTYyLCJzdWIiOiIyLWhqYWRtaW4wMyJ9.AWaeyxT_-9aNJL8gLPOcB2Y4inmzPK55gUmHqIDRa78b3TY2-aeOw8VKEFd8Rmg_uN293-1i3LTi4C3lqQy3rQ',
              timezone: ''
            }
          } // body to send
        }
      },
      {
        id: 'all', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: ALL_USERS // body to send
        }
      },
      {
        id: 'error', // variant id
        type: 'json', // variant handler id
        options: {
          status: 400, // status to send
          // body to send
          body: {
            message: 'Error'
          }
        }
      }
    ]
  },
  {
    id: 'get-user', // route id
    url: '/pub/auth/info', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: {
            code: 3006
          }
        }
      },
      {
        id: 'id-3', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: ALL_USERS[2] // body to send
        }
      }
      // {
      //   id: 'real', // variant id
      //   type: 'middleware', // variant handler id
      //   options: {
      //     // Express middleware to execute
      //     middleware: (req, res) => {
      //       const userId = req.params.id
      //       const user = USERS.find((userData) => userData.id === Number(userId))
      //       if (user) {
      //         res.status(200)
      //         res.send(user)
      //       } else {
      //         res.status(404)
      //         res.send({
      //           message: 'User not found'
      //         })
      //       }
      //     }
      //   }
      // }
    ]
  },
  {
    id: 'refresh-token', // route id
    url: '/pub/auth/refresh-token', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // variant id
        type: 'json', // variant handler id
        options: {
          status: 200, // status to send
          body: {
            code: 1000,
            data: {
              access_token:
                'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI2OTkxMDk3NjIsImp0aSI6IjAyYjU0YzEzLTEwZTctNGFhNy04NWQzLTNlMjM1Y2Q3ODFkNyIsImlhdCI6MTY5OTEwNjE2MiwibmJmIjoxNjk5MTA2MTYyLCJzdWIiOiIyLWhqYWRtaW4wMyJ9.Mxt10iv3zrXkEufZwDgegCpP188rzsFEGXYvICBCwWPWeAEvClC6v4Tb--Wepe5evs0XWSD0QqVs9E0uoTN7dw',
              refresh_token:
                'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkxMTMzNjIsImp0aSI6IjAyYjU0YzEzLTEwZTctNGFhNy04NWQzLTNlMjM1Y2Q3ODFkNyIsImlhdCI6MTY5OTEwNjE2MiwibmJmIjoxNjk5MTA2MTYyLCJzdWIiOiIyLWhqYWRtaW4wMyJ9.AWaeyxT_-9aNJL8gLPOcB2Y4inmzPK55gUmHqIDRa78b3TY2-aeOw8VKEFd8Rmg_uN293-1i3LTi4C3lqQy3rQ'
            }
          } // body to send
        }
      }
    ]
  }
]
