const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when payload did not meet data type', () => {
    const payload = {
      id: 1,
      content: 1,
      owner: 1,
    };
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should create AddedComment object properly', () => {
    const payload = {
      id: 'comment-123',
      content: 'somekind content',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
