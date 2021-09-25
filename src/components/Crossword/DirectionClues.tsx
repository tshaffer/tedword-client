/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Clue from './Clue';
import { ClueAtLocation, CluesByNumber } from '../../types';

export interface DirectionClueProps {
  direction: string;
  cluesByNumber: CluesByNumber;
}

const DirectionClues = (props: DirectionClueProps) => {

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
    <div style={{ marginBottom: '2em' }}>
      <h3 style={{ marginTop: 0, marginBottom: '0.5em' }}>{props.direction.toUpperCase()}</h3>
      {clueData.map(({ number, clue, completelyFilledIn }) => (
        <Clue
          key={number}
          direction={props.direction}
          number={number}
          clueText={clue}
          completelyFilledIn={completelyFilledIn}
        />
      ))}
    </div>
  );

};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DirectionClues);

