import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  gridStyle: {
    height: '200px',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

export let pusher: any;

const BoardTop = () => {

  const classes = useStyles();

  const gridItem = (content: string) => {
    return (
      // From 0 to 600px wide (smart-phones), I take up 12 columns, or the whole device width!
      // From 600-690px wide (tablets), I take up 6 out of 12 columns, so 2 columns fit the screen.
      // From 960px wide and above, I take up 25% of the device (3/12), so 4 columns fit the screen.
      /*
        xs, extra-small: 0px
        sm, small: 600px
        md, medium: 900px
        lg, large: 1200px
        xl, extra-large: 1536px      
      */
      <Grid item xs={12} sm={6} md={3} lg={2} >
        <Paper className={classes.paper}>{content}</Paper>
      </Grid>
    );
  };

  return (
    <div style={{ height: '100%' }}>
      <Grid container spacing={1} justify="center" style={{ minHeight: '5%', maxWidth: '100%' }}>
        {gridItem('Timer/Pause')}
      </Grid>
      <Grid container spacing={1} justify="center" style={{ minHeight: '5%', maxWidth: '100%' }}>
        <Grid item xs={12} sm={6} md={3} lg={2} >
          <Paper className={classes.paper}>Across Clue</Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2} >
          <Paper className={classes.paper}>Down Clue</Paper>
        </Grid>
      </Grid>

      <Grid container spacing={1} justify="center" style={{ minHeight: '90%', maxWidth: '100%', background: 'pink' }}>
        <Grid item xs={8}>
          <Paper className={classes.paper}>Board</Paper>
        </Grid>
        <Grid item container spacing={1} xs={4} style={{ minHeight: '60%', maxWidth: '100%', background: 'cyan' }}>
          <Grid item xs={12} md={6} style={{ background: 'orange' }}>
            <Paper className={classes.paper}>Across Clues</Paper>
          </Grid>
          <Grid item xs={12} md={6} style={{ background: 'gray' }}>
            <Paper className={classes.paper}>Down Clues</Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps)(BoardTop);
