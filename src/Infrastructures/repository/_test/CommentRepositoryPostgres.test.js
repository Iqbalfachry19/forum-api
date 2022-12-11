const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'SomeUser' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    });
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addComment function', () => {
      it('addComment function should add database entry for said comment', async () => {
        // arrange
        const addComment = new AddComment({
          content: 'some content',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        // action
        const addedComment = await commentRepositoryPostgres.addComment(
          addComment,
        );
        const comments = await CommentsTableTestHelper.findCommentById(
          addedComment.id,
        );

        // assert
        expect(addedComment).toStrictEqual(
          new AddedComment({
            id: 'comment-123',
            content: addComment.content,
            owner: addComment.owner,
          }),
        );
        expect(comments).toBeDefined();
      });
    });

    describe('deleteCommentById', () => {
      it('should not be able to delete added comment by id', async () => {
        // arrange
        const addedComment = {
          id: 'comment-123',
          threadId: 'thread-123',
        };

        await CommentsTableTestHelper.addComment({
          id: addedComment.id,
          threadId: addedComment.threadId,
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        // action
        await commentRepositoryPostgres.deleteComment(addedComment.id);
        const comment = await CommentsTableTestHelper.findCommentById(
          'comment-123',
        );

        // assert
        expect(comment.is_deleted).toEqual(false);
      });
      it('should be able to delete added comment by id', async () => {
        // arrange
        const addedComment = {
          commentId: 'comment-123',
          threadId: 'thread-123',
        };

        await CommentsTableTestHelper.addComment({
          id: addedComment.commentId,
          thread_id: addedComment.threadId,
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        // action
        await commentRepositoryPostgres.deleteComment(addedComment);
        const comment = await CommentsTableTestHelper.findCommentById(
          'comment-123',
        );

        // assert
        expect(comment.is_deleted).toEqual(true);
      });
    });

    describe('getCommentByThreadId', () => {
      it('should rejects if comment not exists', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        const commentDetails =
          commentRepositoryPostgres.getCommentByThreadId('thread-123');

        await expect(commentDetails).rejects.toThrowError(
          'comment tidak ditemukan',
        );
      });
      it('should resolve if comment exists', async () => {
        const date = await CommentsTableTestHelper.addComment({
          id: 'comment-123',
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );
        const commentDetails =
          commentRepositoryPostgres.getCommentByThreadId('thread-123');

        await expect(commentDetails).resolves.not.toThrowError();
        expect(await commentDetails).toEqual([
          {
            id: 'comment-123',
            content: 'some content',
            date: date,
            username: 'SomeUser',
            is_deleted: false,
          },
        ]);
      });
    });

    describe('checkCommentIsExist', () => {
      it('should resolve if comment exists', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        await expect(
          commentRepositoryPostgres.checkCommentIsExist({
            threadId: 'thread-123',
            commentId: 'comment-123',
          }),
        ).resolves.not.toThrowError();
      });

      it('should reject if comment does not exist', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        await expect(
          commentRepositoryPostgres.checkCommentIsExist({
            threadId: 'thread-123',
            commentId: 'comment-456',
          }),
        ).rejects.toThrowError('comment tidak ada');
      });

      it('should reject if comment is already deleted', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          isDeleted: true,
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        await expect(
          commentRepositoryPostgres.checkCommentIsExist({
            threadId: 'thread-123',
            commentId: 'comment-456',
          }),
        ).rejects.toThrowError('comment tidak ada');
      });
    });

    describe('verifyCommentAccess', () => {
      it('should not throw error if user has authorization', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );
        await expect(
          commentRepositoryPostgres.verifyCommentAccess({
            commentId: 'comment-123',
            ownerId: 'user-123',
          }),
        ).resolves.toBeUndefined();
      });

      it('should throw error if user has no authorization', async () => {
        await ThreadsTableTestHelper.addThread({ id: 'thread-xyz' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-456',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );
        await expect(
          commentRepositoryPostgres.verifyCommentAccess({
            threadId: 'thread-123',
            owner: 'user-456',
          }),
        ).rejects.toThrowError('akses ditolak');
      });
    });
  });
});
