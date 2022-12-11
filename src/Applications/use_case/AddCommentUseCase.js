const AddComment = require('../../Domains/comments/entities/AddComment');
class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseParams, owner) {
    await this._threadRepository.verifyThreadAvaibility(useCaseParams.threadId);

    const addedComment = new AddComment({
      ...useCasePayload,
      owner,
      threadId: useCaseParams.threadId,
    });

    return this._commentRepository.addComment(addedComment);
  }
}

module.exports = AddCommentUseCase;
