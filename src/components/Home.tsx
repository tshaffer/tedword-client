/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEmpty } from 'lodash';

import { DisplayedPuzzle, FileInput } from '../types';
import { loadPuzzle } from '../controllers';
import { getDisplayedPuzzle } from '../selectors';

// import Crossword from '@jaredreisinger/react-crossword';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rc = require('@jaredreisinger/react-crossword');
console.log(rc);
const Crossword = require('@jaredreisinger/react-crossword').Crossword;
console.log(Crossword);

export interface HomeProps {
  displayedPuzzle: DisplayedPuzzle;
  onLoadPuzzle: (file: FileInput) => any;
}

const Home = (props: HomeProps) => {

  const handleSelectPuzzle = (fileInputEvent: any) => {
    console.log('handleSelectPuzzle');
    const files: FileInput[] = fileInputEvent.target.files;
    console.log(files);
    props.onLoadPuzzle(files[0]);
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
      <Crossword data={props.displayedPuzzle} />
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

  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

