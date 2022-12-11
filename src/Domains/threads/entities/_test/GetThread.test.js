const GetThread = require('../GetThread');

describe('a GetedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });
  it('should throw error when payload did not meet data type', () => {
    const payload = {
      title: 123,
      body: 123,
      username: 123,
      date: 123,
      id: 1,
      comments: {},
    };
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
  it('should create GetThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'a',
      body: 'a',
      username: 'a',
      date: new Date(),
      id: 'a',
      comments: [],
    };

    // Action
    const getThread = new GetThread(payload);

    // Assert
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.username).toEqual(payload.username);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(payload.date);
    expect(getThread.comments).toEqual(payload.comments);
  });
});
