import chai, { expect } from 'chai';
import { spy } from 'sinon';
import dirtyChai from 'dirty-chai';

import EventHandler from '../src/EventHandler';

chai.use(dirtyChai);

const mockFirebaseDb = {};
const mockSendNotification = () => {};
const mockSendSms = () => {};

const handler = new EventHandler(mockFirebaseDb, mockSendNotification, mockSendSms);

describe('EventHandler', () => {
  it('resolves task if no handlers', (done) => {
    const resolveSpy = spy();

    handler.getTaskHandler([])({}, spy(), resolveSpy, spy())
      .then(() => expect(resolveSpy.called).to.be.true())
      .then(() => done())
      .catch(done);
  });

  it('does not call handler if not accepted', (done) => {
    const acceptSpy = spy(() => false);
    const handleSpy = spy(() => Promise.resolve());
    const mockHandler = {
      accept: acceptSpy,
      handle: handleSpy,
    };

    const resolveSpy = spy();

    handler.getTaskHandler([mockHandler])({}, spy(), resolveSpy, spy())
      .then(() => expect(resolveSpy.called).to.be.true())
      .then(() => expect(acceptSpy.called).to.be.true())
      .then(() => expect(handleSpy.called).to.be.false())
      .then(() => done())
      .catch(done);
  });

  it('does call handler if accepted', (done) => {
    const acceptSpy = spy(() => true);
    const handleSpy = spy(() => Promise.resolve());
    const mockHandler = {
      accept: acceptSpy,
      handle: handleSpy,
    };

    const resolveSpy = spy();

    handler.getTaskHandler([mockHandler])({}, spy(), resolveSpy, spy())
      .then(() => expect(resolveSpy.called).to.be.true())
      .then(() => expect(acceptSpy.called).to.be.true())
      .then(() => expect(handleSpy.called).to.be.true())
      .then(() => done())
      .catch(done);
  });

  it('calls all handlers', (done) => {
    const acceptSpy = spy(() => true);
    const notAcceptSpy = spy(() => false);

    const handleSpy = spy(() => Promise.resolve());

    const mockHandler1 = {
      accept: acceptSpy,
      handle: handleSpy,
    };

    const mockHandler2 = {
      accept: notAcceptSpy,
      handle: handleSpy,
    };

    const resolveSpy = spy();

    handler.getTaskHandler([mockHandler1, mockHandler2])({}, spy(), resolveSpy, spy())
      .then(() => expect(resolveSpy.called).to.be.true())
      .then(() => expect(acceptSpy.calledOnce).to.be.true())
      .then(() => expect(notAcceptSpy.calledOnce).to.be.true())
      .then(() => expect(handleSpy.calledOnce).to.be.true())
      .then(() => done())
      .catch(done);
  });

  it('calls handler with correct args', (done) => {
    const acceptSpy = spy(() => true);
    const handleSpy = spy();
    const mockHandler = {
      accept: acceptSpy,
      handle: handleSpy,
    };

    const mockData = {};
    handler.getTaskHandler([mockHandler])(mockData, spy(), spy(), spy())
      .then(() => expect(
        handleSpy.calledWithExactly(mockData, mockFirebaseDb, mockSendNotification, mockSendSms))
          .to.be.true())
      .then(() => done())
      .catch(done);
  });

  it('calls reject if handler rejects', (done) => {
    const acceptSpy = spy(() => true);
    const handleSpy = spy(() => Promise.reject());
    const mockHandler = {
      accept: acceptSpy,
      handle: handleSpy,
    };

    const rejectSpy = spy();

    const mockData = {};
    handler.getTaskHandler([mockHandler])(mockData, spy(), spy(), rejectSpy)
      .then(() => expect(rejectSpy.called).to.be.true())
      .then(() => done())
      .catch(done);
  });

  it('calls reject if one handler rejects but other succeeds', (done) => {
    const acceptSpy = spy(() => true);
    const failureHandleSpy = spy(() => Promise.reject());
    const successHandleSpy = spy(() => Promise.reject());
    const mockHandler1 = {
      accept: acceptSpy,
      handle: successHandleSpy,
    };
    const mockHandler2 = {
      accept: acceptSpy,
      handle: failureHandleSpy,
    };

    const rejectSpy = spy();
    const resolveSpy = spy();

    const mockData = {};
    handler.getTaskHandler([mockHandler1, mockHandler2])(mockData, spy(), resolveSpy, rejectSpy)
      .then(() => expect(rejectSpy.called).to.be.true())
      .then(() => expect(resolveSpy.called).to.be.false())
      .then(() => done())
      .catch(done);
  });

});
