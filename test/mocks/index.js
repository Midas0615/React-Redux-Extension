/* eslint-disable */

class MockPort {
  constructor(name, id) {
    this.name = name;
    this.onMessage = {
      addListener: sinon.spy(),
    };
    this.onDisconnect = {
      addListener: sinon.spy(),
    };
    this.postMessage = sinon.spy();
    this.disconnect = sinon.spy();
    this.sender = {
      tab: {
        id: id || 1000,
      },
    };
  }

  reset() {
    // call disconnect callback
    const call = this.onDisconnect.addListener.getCall(0);
    if (call && call.args) {
      call.args[0]();
    }
    this.name = '';
    this.sender.tab.id = '';
    this.onMessage.addListener.reset();

    this.onDisconnect.addListener.reset();
    this.postMessage.reset();
  }
}

export default MockPort;