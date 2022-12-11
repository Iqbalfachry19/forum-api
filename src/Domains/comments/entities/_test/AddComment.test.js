const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when payload did not meet data type', () => {
    const payload = {
      content: 1,
      threadId: 1,
      owner: 1,
    };
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should create AddComment object properly', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'somekind content',
      owner: 'user-123',
    };

    const addComment = new AddComment(payload);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.owner).toEqual(payload.owner);
  });
});
