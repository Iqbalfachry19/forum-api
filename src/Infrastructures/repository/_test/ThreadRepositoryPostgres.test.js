const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');

describe('ThreadRepositoryPostgres', () => {
  it('should be an instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should create new thread and return added thread correctly', async () => {
        // arrange

        /* arranging for add pe-existing */
        await UsersTableTestHelper.addUser({
          id: 'user-123',
          username: 'dicoding',
          password: 'secret_password',
          fullname: 'Dicoding Indonesia',
        });

        /* arranging for mocks and stubs for thread repository */
        const fakeThreadIdGenerator = (x = 10) => '123';

        /* arranging for thread repository */
        const addThread = new AddThread({
          title: 'lorem ipsum',
          body: 'dolor sit amet',
          owner: 'user-123',
        });

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeThreadIdGenerator,
        );

        // action
        const addedThread = await threadRepositoryPostgres.addThread(addThread);

        // assert
        const threads = await ThreadsTableTestHelper.findThreadById(
          addedThread.id,
        );
        expect(addedThread).toStrictEqual(
          new AddedThread({
            id: `thread-${fakeThreadIdGenerator()}`,
            title: 'lorem ipsum',
            owner: 'user-123',
          }),
        );
        expect(threads).toBeDefined();
      });
    });

    describe('verifyThreadAvaibility function', () => {
      it('should return NotFoundError when thread is not found', async () => {
        // arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });

        // action & assert
        await expect(
          threadRepositoryPostgres.verifyThreadAvaibility('thread-x'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should return thread when thread is found', async () => {
        // arrange
        const newThread = {
          id: 'thread-123',
          title: 'lorem ipsum',
          body: 'dolor sit amet',
          owner: 'user-123',
        };

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({
          id: 'user-123',
          username: 'John Doe',
        });
        const date = await ThreadsTableTestHelper.addThread(newThread);
        const expectedThread = {
          id: 'thread-123',
          title: 'lorem ipsum',
          date: date,
          username: 'John Doe',
          body: 'dolor sit amet',
        };
        // action
        const acquiredThread =
          await threadRepositoryPostgres.verifyThreadAvaibility('thread-123');

        // assert
        expect(acquiredThread).toStrictEqual(expectedThread);
      });
    });
    describe('getThreadById function', () => {
      it('should return NotFoundError when thread is not found', async () => {
        // arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });

        // action & assert
        await expect(
          threadRepositoryPostgres.getThreadById('thread-x'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should return thread when thread is found', async () => {
        // arrange
        const newThread = {
          id: 'thread-123',
          title: 'lorem ipsum',
          body: 'dolor sit amet',
          owner: 'user-123',
        };

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({
          id: 'user-123',
          username: 'John Doe',
        });
        const date = await ThreadsTableTestHelper.addThread(newThread);
        const expectedThread = {
          id: 'thread-123',
          title: 'lorem ipsum',
          date: date,
          username: 'John Doe',
          body: 'dolor sit amet',
        };
        // action
        const acquiredThread = await threadRepositoryPostgres.getThreadById(
          'thread-123',
        );

        // assert
        expect(acquiredThread).toStrictEqual(expectedThread);
      });
    });
  });
});
