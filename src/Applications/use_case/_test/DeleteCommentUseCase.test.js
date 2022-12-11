const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment use case properly', async () => {
    // arrange

    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const userIdFromAccessToken = 'user-123';

    const expectedDeletedComment = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    /** creating dependancies for use case */
    const mockCommentRepository = new CommentRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed functions */

    mockCommentRepository.checkCommentIsExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // action
    await addCommentUseCase.execute(useCaseParam, userIdFromAccessToken);

    // assert

    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith({
      threadId: useCaseParam.threadId,
      commentId: useCaseParam.commentId,
    });
    expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith({
      ownerId: userIdFromAccessToken,
      commentId: useCaseParam.commentId,
    });
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      expectedDeletedComment,
    );
  });
});
