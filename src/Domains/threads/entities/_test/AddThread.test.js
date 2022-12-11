const AddThread = require('../AddThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when payload did not meet data type', () => {
    const payload = {
      title: 1,
      body: 1,
      owner: 1,
    };
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should create AddThread object properly', () => {
    const payload = {
      title: 'somekind content',
      body: 'hi',
      owner: 'user-123',
    };

    const addedThread = new AddThread(payload);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
