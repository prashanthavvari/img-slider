import Component from '@ember/component';
import layout from '../templates/components/base-slider';
import { set } from '@ember/object';
import { oneWay }from '@ember/object/computed';

export default Component.extend({
  layout,
  currentIndex: oneWay('startIndex'),
  init() {
    this._super();
    if (this.startIndex !== undefined) {
      let newElementsArray = this.elementsArray;
      newElementsArray.forEach((ele, index) => { if(index === this.startIndex) { ele.className='highlight'; ele.classNameMain='block';}});
      this.set('elementsArray', newElementsArray);
    }
  },
  didInsertElement(){
    if (this.timer) {
      this.set('interval', setInterval(()=> {
        this.send('move', 1);
      }, this.timer));
    }
  },
  getCurrentIndex() {
    let currentIndex = -1;
    let reqClassName = this.startIndex ? 'highlight' : 'active';
    this.elementsArray.forEach((ele, index) => { if(ele.className === reqClassName) { currentIndex = index;}});
    try {
      if (typeof currentIndex !== 'number') {
        throw 'more than one index active';
      }
    } catch(e) {
        alert(e);
      }
      return currentIndex;
  },
  rotateArray(right) {
    let newArray = this.elementsArray;
    if (right) {
      let firstEle = newArray.shiftObject(0);
      newArray.pushObject(firstEle);
      this.set('currentIndex', this.minDisplay - 1);
    } else {
      let lastEle = newArray.popObject();
      newArray.unshiftObject(lastEle);
      this.set('currentIndex', 0);
    }
    this.set('elementsArray', newArray);
  },
  setPosition(currentIndex, index, newClassName, oldClassName, classProp) {
    set(this.elementsArray[currentIndex], classProp, oldClassName);
    set(this.elementsArray[index], classProp, newClassName);
  },
  actions: {
    move(position) {
      let length = this.elementsArray.length;
      let currentIndex = this.getCurrentIndex();
      let newClassName = this.startIndex !== undefined? 'highlight': 'active';
      let oldClassName = this.startIndex !== undefined? '': 'none';
      let newClassNameMain = this.startIndex !== undefined ? 'block' : 'none';
      let newIndex = (length+(currentIndex + position))%length;
      this.setPosition(currentIndex, newIndex, newClassName, oldClassName, 'className');
      this.setPosition(currentIndex, newIndex, newClassNameMain, oldClassName, 'classNameMain');
      this.set('currentIndex', (length+(currentIndex + position))%length);
      if (this.currentIndex === (this.minDisplay) || this.currentIndex < 0) {
        this.rotateArray(this.currentIndex, position > 0);
      }
    },
    moveToIndex(index) {
      this.setPosition(this.currentIndex, index, 'highlight', '', 'className');
      this.setPosition(this.currentIndex, index, 'block', 'none', 'classNameMain');
      this.set('currentIndex', index);
    },
    timer() {
      if(this.interval) {
        clearInterval(this.interval);
        delete this.interval;
      }
      else {
        this.set('interval', setInterval(()=> {
          this.send('move', 1);
        }, this.timer));
      }
    }
  }
});
