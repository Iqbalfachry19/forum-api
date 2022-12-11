const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const addedThread = new AddThread({ ...useCasePayload, owner });

    return this._threadRepository.addThread(addedThread);
  }
}

module.exports = AddThreadUseCase;
