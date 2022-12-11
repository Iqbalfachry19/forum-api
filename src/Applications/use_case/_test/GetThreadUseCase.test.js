const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const useCaseParams = {
      threadId: 'thread-123',
    };
    const expectedGetThread = new GetThread({
      id: 'thread-123',
      title: 'h',
      body: 'h',
      username: 'dicoding',
      date: new Date('2022-03-25'),
      comments: [
        {
          content: undefined,
        },
      ],
    });
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => ({
      id: 'thread-123',
      title: 'h',
      body: 'h',
      date: new Date('2022-03-25'),
      username: 'dicoding',
    }));
    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{}]));
    const getCommentUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const getThread = await getCommentUseCase.execute(useCaseParams);

    expect(getThread).toStrictEqual(expectedGetThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      'thread-123',
    );
  });
  it('should operate the branching in the _checkIsDeletedComments function properly', async () => {
    // arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };
    const expectedGetThread = new GetThread({
      id: 'thread-123',
      title: 'h',
      body: 'h',
      username: 'dicoding',
      date: new Date('2022-03-25'),
      comments: [
        {
          id: 'comment-123',
          username: 'user A',
          date: '2021',
          content: '**komentar telah dihapus**',
        },
        {
          id: 'comment-456',
          username: 'user B',
          date: '2020',
          content: 'comment B',
        },
      ],
    });
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => ({
      id: 'thread-123',
      title: 'h',
      body: 'h',
      date: new Date('2022-03-25'),
      username: 'dicoding',
    }));
    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: 'comment-123',
            username: 'user A',
            date: '2021',
            content: '**komentar telah dihapus**',

            is_deleted: true,
          },
          {
            id: 'comment-456',
            username: 'user B',
            date: '2020',
            content: 'comment B',

            is_deleted: false,
          },
        ]),
      );

    const getCommentUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const SpyCheckIsDeletedComments = jest.spyOn(
      getCommentUseCase,
      '_checkIsDeletedComments',
    );
    const getThread = await getCommentUseCase.execute(useCaseParams);

    expect(getThread).toStrictEqual(expectedGetThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      'thread-123',
    );
    expect(SpyCheckIsDeletedComments).toReturnWith([
      {
        id: 'comment-123',
        username: 'user A',
        date: '2021',
        content: '**komentar telah dihapus**',
      },
      {
        id: 'comment-456',
        username: 'user B',
        date: '2020',
        content: 'comment B',
      },
    ]);

    SpyCheckIsDeletedComments.mockClear();
  });
});
