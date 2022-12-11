const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment use case properly', async () => {
    // arrange
    const useCasePayload = {
      content: 'comment content',
    };

    const useCaseParam = {
      threadId: 'thread-123',
    };

    const userIdFromAccessToken = 'user-123';

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userIdFromAccessToken,
    });

    /** creating dependancies for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed functions */
    mockThreadRepository.verifyThreadAvaibility = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          content: useCasePayload.content,
          owner: userIdFromAccessToken,
        }),
      ),
    );

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const addedComment = await addCommentUseCase.execute(
      useCasePayload,
      useCaseParam,
      userIdFromAccessToken,
    );

    // assert
    expect(addedComment).toStrictEqual(expectedAddedComment);

    expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(
      useCaseParam.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: useCasePayload.content,
        threadId: useCaseParam.threadId,
        owner: userIdFromAccessToken,
      }),
    );
  });
});
