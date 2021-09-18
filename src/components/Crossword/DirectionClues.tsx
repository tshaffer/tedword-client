/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Clue from './Clue';

export interface DirectionClueProps {
  direction: string;
  clues: any[];
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

  return (
    <div style={{ marginBottom: '2em' }}>
      <h3 style={{ marginTop: 0, marginBottom: '0.5em' }}>{props.direction.toUpperCase()}</h3>
      {props.clues.map(({ number, clue, correct }) => (
        <Clue
          key={number}
          direction={props.direction}
          number={number}
          correct={correct}
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

