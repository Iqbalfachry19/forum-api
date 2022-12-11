class GetThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, date, username, comments, title, body } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({ title, body, username, comments, date, id }) {
    if (!title || !body || !username || !comments || !date || !id) {
      throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      !(date instanceof Date) ||
      !(comments instanceof Array)
    ) {
      throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThread;
