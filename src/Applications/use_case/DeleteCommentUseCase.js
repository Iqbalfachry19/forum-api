const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams, ownerId) {
    const { threadId, commentId } = useCaseParams;

    await this._commentRepository.checkCommentIsExist({ threadId, commentId });
    await this._commentRepository.verifyCommentAccess({
      commentId,
      ownerId,
    });

    await this._commentRepository.deleteComment(useCaseParams);
  }
}

module.exports = DeleteCommentUseCase;
