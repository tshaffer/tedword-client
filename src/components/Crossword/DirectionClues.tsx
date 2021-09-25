/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Clue from './Clue';
import { ClueAtLocation, CluesArray, CluesByNumber } from '../../types';

export interface DirectionClueProps {
  direction: string;
  clues: CluesArray;
  cluesByNumber: CluesByNumber;
  // number
  // clue
  // correct
}

/*
  .direction {
    margin-bottom: 2em;
    ** padding: 0 1em;
    flex: 1 1 20%; **

    .header {
      margin-top: 0;
      margin-bottom: 0.5em;
    }

    div {
      margin-top: 0.5em;
    }
  }
*/

const DirectionClues = (props: DirectionClueProps) => {

  /* {props.clues.map(({ number, clue, correct }) => ( */

  console.log('DirectionClues render');
  console.log(props.direction);
  const clueData: any[] = [];
  for (const clueNumber in props.cluesByNumber) {
    if (Object.prototype.hasOwnProperty.call(props.cluesByNumber, clueNumber)) {
      const clueAtLocation: ClueAtLocation = props.cluesByNumber[clueNumber];
      console.log(clueNumber, props.direction, clueAtLocation.clue);
      clueData.push({
        number: clueNumber,
        clue: clueAtLocation.clue
      });
    }
  }

  /*
        {props.clues.map(({ number, clue }) => (
        <Clue
          key={number}
          direction={props.direction}
          number={number}
          // correct={correct}
          clueText={clue}
        />
      ))}

  */

  return (
    <div style={{ marginBottom: '2em' }}>
      <h3 style={{ marginTop: 0, marginBottom: '0.5em' }}>{props.direction.toUpperCase()}</h3>
      {clueData.map(({ number, clue }) => (
        <Clue
          key={number}
          direction={props.direction}
          number={number}
          clueText={clue}
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

