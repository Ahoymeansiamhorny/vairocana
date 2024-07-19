import { http as rest } from 'msw'

export const handlers = [
  rest.post('/auth/login', (req, res, ctx) => {
    // Persist user's authentication in the session
    // sessionStorage.setItem("is-authenticated", "true");
    return res(
      // Respond with a 200 status code
      ctx.json({
        code: 1000,
        data: {
          access_token:
            'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzM1MTQ1NDMsImp0aSI6ImFkNGQxNmVhLWMwYWEtNGVhYS1iMTkwLTU5N2U2ZGIxYTNkZiIsImlhdCI6MTY3MzUxMzU0MywibmJmIjoxNjczNTEzNTQzLCJzdWIiOiI2LWhqYWRtaW4wMyJ9.1KVk0pQm7H9YbE3zsG8wYPP8qeBDUP8GsbzIW8WP1UiwFFlDw0Gx9oIb9p-ZPTBnVWncJ3fjNqtFVRM18rqRMg',
          refresh_token: 'refresh'
        }
      })
    )
  }),

  rest.get('/auth/setting', (req, res, ctx) => {
    // Persist user's authentication in the session
    // sessionStorage.setItem("is-authenticated", "true");
    return res(
      // Respond with a 200 status code
      ctx.json({
        code: 1000,
        data: {
          captcha: true
        }
      })
    )
  }),

  rest.get('/auth/info', (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = localStorage.getItem('access_token')

    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized'
        })
      )
    }

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        id: 2,
        account: 'hjadmin03',
        nick_name: '技術專用',
        mobile: '',
        login_ip: '122.116.139.135',
        email: '',
        level: 4,
        status: 1,
        created_at: '2023-03-14 19:32:48',
        login_at: '2023-03-31 16:26:25',
        role: [
          {
            id: 2,
            name: '本站最大權限'
          },
          {
            id: 1,
            name: 'root'
          }
        ],
        menu: [
          {
            id: 1,
            name: 'managerList'
          }
        ]
      })
    )
  }),

  rest.get('/api/v1/department/manager', (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        code: 1000,
        data: {
          list: [
            {
              id: 2,
              account: 'admin02',
              nick_name: '',
              mobile: '',
              login_ip: '49.157.13.4',
              email: '',
              level: 3,
              status: 1,
              created_at: '2022-08-29 11:05:49',
              login_at: '2022-11-18 05:12:08',
              role: [{ id: 2, name: '权限全开1' }]
            },
            {
              id: 3,
              account: 'admin03',
              nick_name: '',
              mobile: '',
              login_ip: '156.255.88.82',
              email: '',
              level: 3,
              status: 1,
              created_at: '2022-08-29 11:06:07',
              login_at: '2022-09-19 09:41:46',
              role: [{ id: 2, name: '权限全开1' }]
            },
            {
              id: 4,
              account: 'admin04',
              nick_name: '',
              mobile: '',
              login_ip: '60.53.35.178',
              email: '',
              level: 3,
              status: 1,
              created_at: '2022-08-29 12:26:07',
              login_at: '2022-08-29 12:26:40',
              role: [{ id: 2, name: '权限全开1' }]
            },
            {
              id: 5,
              account: 'hjadmin03',
              nick_name: '',
              mobile: '',
              login_ip: '61.220.20.16',
              email: '',
              level: 3,
              status: 1,
              created_at: '2022-08-29 12:37:25',
              login_at: '2022-12-06 11:28:54',
              role: [{ id: 2, name: '权限全开1' }]
            },
            {
              id: 6,
              account: 'megan888',
              nick_name: 'megan',
              mobile: '15666666666',
              login_ip: '61.220.20.16',
              email: '',
              level: 3,
              status: 1,
              created_at: '2022-09-01 04:46:10',
              login_at: '2022-11-30 01:54:16',
              role: [{ id: 2, name: '权限全开1' }]
            },
            {
              id: 7,
              account: 'carita888',
              nick_name: 'carita',
              mobile: '',
              login_ip: '122.116.139.135',
              email: '',
              level: 3,
              status: 1,
              created_at: '2022-09-06 06:39:27',
              login_at: '2022-12-26 03:40:06',
              role: [{ id: 2, name: '权限全开1' }]
            }
          ],
          total: 6
        }
      })
    )
  })
]
