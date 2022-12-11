const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    const thread = await this._threadRepository.getThreadById(threadId);
    thread.comments = await this._commentRepository.getCommentByThreadId(
      threadId,
    );

    thread.comments = this._checkIsDeletedComments(thread.comments);
    return new GetThread({
      ...thread,
    });
  }
  _checkIsDeletedComments(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      comments[i].content = comments[i].is_deleted
        ? '**komentar telah dihapus**'
        : comments[i].content;
      delete comments[i].is_deleted;
    }
    return comments;
  }
}

module.exports = GetThreadUseCase;
