import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Board from './Board';
import BoardPlay from './BoardPlay';

const BoardTop = () => {

  console.log('BoardTop render');
  
  return (
    <div>
      <Board/>
      <BoardPlay/>
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

export default connect(mapStateToProps, mapDispatchToProps)(BoardTop);
