import Immutable from 'immutable';
import uuid from './uuid';

export default Immutable.fromJS([
  {
    _id: uuid(),
    label: 'Startpage',
    children: []
  },
  {
    _id: uuid(),
    label: 'Page 1',
    children: [
      {
        _id: uuid(),
        label: 'Page 1a',
        children: [

        ]
      },
      {
        _id: uuid(),
        label: 'Page 1b',
        children: []
      }
    ]
  },
  {
    _id: uuid(),
    label: 'Page 2',
    children: []
  }
]);
