class Observable {
  constructor(){
    this.observers = [];
  }

  notifyAll(change){
    this.observers.forEach(o => o.update(change));
  }

  addObserver(observer){
    this.observers.push(observer);
  }
}

module.exports = {
  Observable,
};