const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/commentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 401 when not authorize', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia',
        body: 'secret',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'lorem ipsum',
        body: 'dolor sit amet',
      };

      const server = await createServer(container);

      /* add user and gain access token */
      const { accessToken } =
        await ServerTestHelper.getAccessTokenAndUserIdHelper({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and success', async () => {
      const server = await createServer(container);

      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'JohnDoe',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'JaneDoe',
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId,
        owner: 'user-123',
        date: '2020',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        threadId,
        owner: 'user-123',
      });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
    });

    it('should respond with 404 if thread does not exist', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/xyz',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
