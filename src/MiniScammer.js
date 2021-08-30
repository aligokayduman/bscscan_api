import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '96%',
    },
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  listbuy: {
    color: 'green'
  },
  listsell: {
    color: 'red'
  }
})); 

console.log("MiniScrammer.js başlangıç");
export default function MiniScammer() {
  const classes = useStyles();

  const [txns, settxns] = useState({});

  const [bnbprice, setbnbprice] = useState(0);

  const [ccAddress, setccAddress] = useState('');
  const [ccBalance, setccBalance] = useState(0);
  const [ccDiff, setccDiff] = useState(0);

  const [mhAddress, setmhAddress] = useState('');
  const [mhBalance, setmhBalance] = useState(0);
  const [mhDiff, setmhDiff] = useState(0);

  const [s1Address, sets1Address] = useState('');
  const [s1Balance, sets1Balance] = useState(0);
  const [s1Diff, sets1Diff] = useState(0);

  const [s2Address, sets2Address] = useState('');
  const [s2Balance, sets2Balance] = useState(0);
  const [s2Diff, sets2Diff] = useState(0);

  const [s3Address, sets3Address] = useState('');
  const [s3Balance, sets3Balance] = useState(0);
  const [s3Diff, sets3Diff] = useState(0);

  const [s4Address, sets4Address] = useState('');
  const [s4Balance, sets4Balance] = useState(0);
  const [s4Diff, sets4Diff] = useState(0);

  const [totalbalance, settotalbalance] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      getBalance();
    }, 1000)

    return () => clearInterval(interval)
  })

  const getBalance = () => {
    let addresses = '';
    if (ccAddress.length === 42) addresses += ccAddress + ','
    if (mhAddress.length === 42) addresses += mhAddress + ','
    if (s1Address.length === 42) addresses += s1Address + ','
    if (s2Address.length === 42) addresses += s2Address + ','
    if (s3Address.length === 42) addresses += s3Address + ','
    if (s4Address.length === 42) addresses += s4Address + ',';
    if (addresses.length > 42) addresses = addresses.slice(0, -1);

    fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT')
      .then(res => res.json())
      .then(
        (result) => {
          setbnbprice(result.price);
        },
        (error) => {
          console.log('There was an error : ' + error);
        }
      );

    if (addresses.length >= 42) {

      const url = 'https://api.bscscan.com/api?module=account&action=balancemulti&address=' + addresses + '&tag=latest&apikey=YMH1CJZ4VMYFMAA841SU8TXXJETRZZ4R9B';
      fetch(url)
        .then(res => res.json())
        .then(
          (res) => {
            if (typeof res != "undefined") {
              res.result.forEach(balance => {
                let newbalance = balance.balance / 10 ** 18;
                let diff = 0;
  
                if (balance.account === ccAddress) {
                  diff = Math.round(Math.abs(newbalance - ccBalance) * bnbprice * 100) / 100;
                  setccBalance(newbalance);
                  setccDiff(diff);
  
                  if (newbalance !== ccBalance && ccBalance > 0){
                    const type = (newbalance < ccBalance) ? "buy" : "sell";
                    const key = Object.keys(txns).length;
                    const value = {price:diff, type:type};                               
                    settxns(txns => ({
                      ...txns,
                      [key]: value
                    }));
                  }
  
                  if (newbalance < ccBalance) document.getElementById('contract-creator-diff').style.backgroundColor = "#69ab74";
                  if (newbalance > ccBalance) document.getElementById('contract-creator-diff').style.backgroundColor = "#da5151";
                  if (newbalance === ccBalance) document.getElementById('contract-creator-diff').style.removeProperty('background-color');
                }
                if (balance.account === mhAddress) {
                  diff = Math.round(Math.abs(newbalance - mhBalance) * bnbprice * 100) / 100;
                  setmhBalance(newbalance);
                  setmhDiff(diff);
  
                  if (newbalance !== mhBalance && mhBalance > 0){
                    const type = (newbalance < mhBalance) ? "buy" : "sell";
                    const key = Object.keys(txns).length;
                    const value = {price:diff, type:type};                               
                    settxns(txns => ({
                      ...txns,
                      [key]: value
                    }));
                  }                
  
                  if (newbalance < mhBalance) document.getElementById('main-holder-diff').style.backgroundColor = "#69ab74";
                  if (newbalance > mhBalance) document.getElementById('main-holder-diff').style.backgroundColor = "#da5151";
                  if (newbalance === mhBalance) document.getElementById('main-holder-diff').style.removeProperty('background-color');
                }
                if (balance.account === s1Address) {
                  diff = Math.round(Math.abs(newbalance - s1Balance) * bnbprice * 100) / 100;
                  sets1Balance(newbalance);
                  sets1Diff(diff);
  
                  if (newbalance !== s1Balance && s1Balance > 0){
                    const type = (newbalance < s1Balance) ? "buy" : "sell";
                    const key = Object.keys(txns).length;
                    const value = {price:diff, type:type};                               
                    settxns(txns => ({
                      ...txns,
                      [key]: value
                    }));
                  }                
  
                  if (newbalance < s1Balance) document.getElementById('supplier-first-diff').style.backgroundColor = "#69ab74";
                  if (newbalance > s1Balance) document.getElementById('supplier-first-diff').style.backgroundColor = "#da5151";
                  if (newbalance === s1Balance) document.getElementById('supplier-first-diff').style.removeProperty('background-color');
                }
                if (balance.account === s2Address) {
                  diff = Math.round(Math.abs(newbalance - s2Balance) * bnbprice * 100) / 100;
                  sets2Balance(newbalance);
                  sets2Diff(diff);
  
                  if (newbalance !== s2Balance && s2Balance > 0){
                    const type = (newbalance < s2Balance) ? "buy" : "sell";
                    const key = Object.keys(txns).length;
                    const value = {price:diff, type:type};                               
                    settxns(txns => ({
                      ...txns,
                      [key]: value
                    }));
                  }                
  
                  if (newbalance < s2Balance) document.getElementById('supplier-second-diff').style.backgroundColor = "#69ab74";
                  if (newbalance > s2Balance) document.getElementById('supplier-second-diff').style.backgroundColor = "#da5151";
                  if (newbalance === s2Balance) document.getElementById('supplier-second-diff').style.removeProperty('background-color');
                }
                if (balance.account === s3Address) {
                  diff = Math.round(Math.abs(newbalance - s3Balance) * bnbprice * 100) / 100;
                  sets3Balance(newbalance);
                  sets3Diff(diff);
  
                  if (newbalance !== s3Balance && s3Balance > 0){
                    const type = (newbalance < s3Balance) ? "buy" : "sell";
                    const key = Object.keys(txns).length;
                    const value = {price:diff, type:type};                               
                    settxns(txns => ({
                      ...txns,
                      [key]: value
                    }));
                  }                
  
                  if (newbalance < s3Balance) document.getElementById('supplier-third-diff').style.backgroundColor = "#69ab74";
                  if (newbalance > s3Balance) document.getElementById('supplier-third-diff').style.backgroundColor = "#da5151";
                  if (newbalance === s3Balance) document.getElementById('supplier-third-diff').style.removeProperty('background-color');
                }
                if (balance.account === s4Address) {
                  diff = Math.round(Math.abs(newbalance - s4Balance) * bnbprice * 100) / 100;
                  sets4Balance(newbalance);
                  sets4Diff(diff);
  
                  if (newbalance !== s4Balance && s4Balance > 0){
                    const type = (newbalance < s4Balance) ? "buy" : "sell";
                    const key = Object.keys(txns).length;
                    const value = {price:diff, type:type};                               
                    settxns(txns => ({
                      ...txns,
                      [key]: value
                    }));
                  }                
  
                  if (newbalance < s4Balance) document.getElementById('supplier-fourth-diff').style.backgroundColor = "#69ab74";
                  if (newbalance > s4Balance) document.getElementById('supplier-fourth-diff').style.backgroundColor = "#da5151";
                  if (newbalance === s4Balance) document.getElementById('supplier-fourth-diff').style.removeProperty('background-color');
                }
              });
            }
          },
          (error) => {
            console.log('There was an error : ' + error);
          }
        );

      settotalbalance(ccBalance + mhBalance + s1Balance + s2Balance + s3Balance + s4Balance);
    } else {
      console.log('There are not find any address');
    }

  }

  return (

    <React.Fragment>
      <Container maxWidth={false}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container spacing={1}>

            <Grid item xs={12} sm={6}>
              <TextField id="contract-creator" label="Contract Creator" variant="outlined" placeholder="0x" fullWidth value={ccAddress} onChange={(e) => setccAddress(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="contract-creator-balance" label="Balance(BNB)" variant="outlined" fullWidth disabled value={ccBalance} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="contract-creator-diff" label="Transaction($)" variant="outlined" fullWidth disabled value={ccDiff} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField id="main-holder" label="Main Holder" variant="outlined" placeholder="0x" fullWidth value={mhAddress} onChange={(e) => setmhAddress(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="main-holder-balance" label="Balance(BNB)" variant="outlined" fullWidth disabled value={mhBalance} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="main-holder-diff" label="Transaction($)" variant="outlined" fullWidth disabled value={mhDiff} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField id="supplier-first" label="Supplier First" variant="outlined" placeholder="0x" fullWidth value={s1Address} onChange={(e) => sets1Address(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="supplier-first-balance" label="Balance(BNB)" variant="outlined" fullWidth disabled value={s1Balance} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="supplier-first-diff" label="Transaction($)" variant="outlined" fullWidth disabled value={s1Diff} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField id="supplier-second" label="Supplier Second" variant="outlined" placeholder="0x" fullWidth value={s2Address} onChange={(e) => sets2Address(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="supplier-second-balance" label="Balance(BNB)" variant="outlined" fullWidth disabled value={s2Balance} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="supplier-second-diff" label="Transaction($)" variant="outlined" fullWidth disabled value={s2Diff} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField id="supplier-third" label="Supplier Third" variant="outlined" placeholder="0x" fullWidth value={s3Address} onChange={(e) => sets3Address(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="supplier-third-balance" label="Balance(BNB)" variant="outlined" fullWidth disabled value={s3Balance} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="supplier-third-diff" label="Transaction($)" variant="outlined" fullWidth disabled value={s3Diff} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField id="supplier-fourth" label="Supplier Fourth" variant="outlined" placeholder="0x" fullWidth value={s4Address} onChange={(e) => sets4Address(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="supplier-fourth-balance" label="Balance(BNB)" variant="outlined" fullWidth disabled value={s4Balance} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="supplier-fourth-diff" label="Transaction($)" variant="outlined" fullWidth disabled value={s4Diff} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>Supplier Total : </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="supplier-total-balance" label="Balance(BNB)" variant="outlined" fullWidth disabled value={totalbalance} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.paper}> - </Paper>
            </Grid>

          </Grid>
        </form>
      </Container>
      <Container maxWidth={false}>
        <List component="nav" className={classes.root} aria-label="mailbox folders">
          {

            Object.keys(txns).reverse().map(key => 
              <ListItem key={key}>
                <ListItemText primary={txns[key].price+"$"} className={(txns[key].type==='buy') ? classes.listbuy : classes.listsell}/>
              </ListItem>
            )
          }
        </List>
      </Container>
    </React.Fragment>
  );
}
