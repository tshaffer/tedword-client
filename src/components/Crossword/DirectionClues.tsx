import * as React from 'react';

import Clue from './Clue';
import { ClueAtLocation, CluesByNumber } from '../../types';

export interface DirectionClueProps {
  direction: string;
  cluesByNumber: CluesByNumber;
  onClueSelected: (direction: string, number: string) => any;
}

const DirectionClues = (props: DirectionClueProps) => {

  const handleClueSelected = (direction, number) => {
    props.onClueSelected(direction, number);
  };

  const clueData: any[] = [];
  for (const clueNumber in props.cluesByNumber) {
    if (Object.prototype.hasOwnProperty.call(props.cluesByNumber, clueNumber)) {
      const clueAtLocation: ClueAtLocation = props.cluesByNumber[clueNumber];
      clueData.push({
        number: clueNumber,
        clue: clueAtLocation.clue,
        completelyFilledIn: clueAtLocation.completelyFilledIn,
      });
    }
  }

  return (
    <div style={{
      marginBottom: '2em',
      maxHeight: '95%',
      overflowY: 'auto',
      background: 'white',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '0.5em' }}>{props.direction.toUpperCase()}</h3>
      {clueData.map(({ number, clue, completelyFilledIn }) => (
        <Clue
          key={number}
          direction={props.direction}
          number={number}
          clueText={clue}
          completelyFilledIn={completelyFilledIn}
          onClueSelected={handleClueSelected}
        />
      ))}
    </div>
  );

};

export default DirectionClues;

