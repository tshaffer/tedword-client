/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEmpty } from 'lodash';

import { DisplayedPuzzle, FileInput } from '../types';
import { cellChange, loadPuzzle } from '../controllers';
import { getDisplayedPuzzle } from '../selectors';

const Pusher = require('pusher-js');
// import Pusher from 'pusher-js';
console.log(Pusher);

// import Crossword from '@jaredreisinger/react-crossword';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Crossword = require('@jaredreisinger/react-crossword').Crossword;
console.log(Crossword);

export interface HomeProps {
  displayedPuzzle: DisplayedPuzzle;
  onLoadPuzzle: (file: FileInput) => any;
  onCellChange: (row: number, col: number, typedChar: string) => any;
}

const initializePusher = () => {
  console.log(Pusher);
  const pusher = new Pusher('c6addcc9977bdaa7e8a2', {
    cluster: 'us3',
    // encrypted: true,
  });

  const channel = pusher.subscribe('puzzle');
  channel.bind('cell-change', data => {
    console.log('cell-change');
    console.log(data);
  });
};

const Home = (props: HomeProps) => {

  React.useEffect(initializePusher, []);

  const handleSelectPuzzle = (fileInputEvent: any) => {
    console.log('handleSelectPuzzle');
    const files: FileInput[] = fileInputEvent.target.files;
    console.log(files);
    props.onLoadPuzzle(files[0]);
  };

  const handleCellChange = (row: number, col: number, typedChar: string) => {
    console.log('handleCellChange');
    console.log(row, col, typedChar);
    props.onCellChange(row, col, typedChar);
  };

  const handleClueCorrect = (direction: string, number: string, answer: string) => {
    console.log('handleClueCorrect');
    console.log(direction, number, answer);
  };

  const handleLoadedCorrect = (param) => {
    console.log('handleLoadedCorrect');
    console.log(param);
  };

  const handleCrosswordCorrect = (param) => {
    console.log('handleCrosswordCorrect');
    console.log(param);
  };

  console.log(props.displayedPuzzle);

  console.log(isEmpty(props.displayedPuzzle.across));
  console.log(isEmpty(props.displayedPuzzle.down));
  console.log(Object.keys(props.displayedPuzzle.across).length);
  console.log(Object.keys(props.displayedPuzzle.down).length);

  if (isEmpty(props.displayedPuzzle.across) && isEmpty(props.displayedPuzzle.down)) {
    return (
      <div>
        <p>
          Uncooked Pizza
        </p>
        <input
          type="file"
          id="fileInput"
          onChange={handleSelectPuzzle}
        >
        </input>
      </div>
    );
  }

  return (
    <div>
      <p>
        Cooked Pizza
      </p>
      <Crossword
        data={props.displayedPuzzle}
        onCellChange={handleCellChange}
        onCorrect={handleClueCorrect}
        onLoadedCorrect={handleLoadedCorrect}
        onCrosswordCorrect={handleCrosswordCorrect}
      />
    </div>
  );

};

function mapStateToProps(state: any) {
  return {
    displayedPuzzle: getDisplayedPuzzle(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadPuzzle: loadPuzzle,
    onCellChange: cellChange,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

