import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export interface HomeProps {
}

const Home = (props: HomeProps) => {

  const poo = () => {
    console.log('poo');
  };

  //         onChange={poo}

  return (
    <div>
      <p>
        Pizza
      </p>
      <input
        type="file"
        id="fileInput"
        onChange={poo}
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

