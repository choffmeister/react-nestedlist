import Immutable from 'immutable';
import uuid from './uuid';

export default function (suffix) {
  return Immutable.fromJS([
    {
      _id: uuid(),
      label: 'Startpage',
      children: []
    },
    {
      _id: uuid(),
      label: `Page 1 (${suffix})`,
      children: [
        {
          _id: uuid(),
          label: `Page 1a (${suffix})`,
          children: []
        },
        {
          _id: uuid(),
          label: `Page 1b (${suffix})`,
          children: []
        }
      ]
    },
    {
      _id: uuid(),
      label: `Page 2 (${suffix})`,
      children: []
    }
  ]);
}
