import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { FileInput } from '../types';
import { loadPuzzle } from '../controllers';

export interface HomeProps {
  onLoadPuzzle: (file: FileInput) => any;
}

const Home = (props: HomeProps) => {

  const handleSelectPuzzle = (fileInputEvent: any) => {
    console.log('handleSelectPuzzle');
    const files: FileInput[] = fileInputEvent.target.files;
    console.log(files);
    props.onLoadPuzzle(files[0]);
  };

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
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadPuzzle: loadPuzzle,

  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

