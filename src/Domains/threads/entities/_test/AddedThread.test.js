const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when payload did not meet data type', () => {
    const payload = {
      id: 1,
      title: 1,
      owner: true,
    };
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should create AddedThread object properly', () => {
    const payload = {
      id: 'comment-123',
      title: 'somekind content',
      owner: 'user-123',
    };

    const addedThread = new AddedThread(payload);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
