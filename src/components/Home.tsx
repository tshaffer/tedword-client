import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { DisplayedPuzzle, FileInput } from '../types';
import { loadPuzzle } from '../controllers';
import { getDisplayedPuzzle } from '../selectors';

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

  return (
    <div>
      <p>
        Pizza
      </p>
      <input
        type="file"
        id="fileInput"
        onChange={handleSelectPuzzle}
      >
      </input>
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

