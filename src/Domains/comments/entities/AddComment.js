class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, threadId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
