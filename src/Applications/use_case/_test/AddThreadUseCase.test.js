const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // arrange
    const useCasePayload = {
      title: 'lorem ipsum',
      body: 'dolor sit amet',
    };

    const headerAuthorization = 'Bearer accessToken';

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'lorem ipsum',
      owner: 'Bearer accessToken',
    });

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /* mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'lorem ipsum',
        owner: 'Bearer accessToken',
      }),
    );

    /* creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // action
    const addedThread = await addThreadUseCase.execute(
      useCasePayload,
      headerAuthorization,
    );

    // assert
    expect(addedThread).toStrictEqual({
      id: expectedAddedThread.id,
      title: expectedAddedThread.title,
      owner: expectedAddedThread.owner,
    });

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: expectedAddedThread.owner,
      }),
    );
  });
});
