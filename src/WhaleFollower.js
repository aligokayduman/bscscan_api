import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container';
import ListItemText from '@material-ui/core/ListItemText';
import { BSC_API_KEY, firebaseConfig, PancakeAddress } from './Config';
import firebase from 'firebase/app';
import Paper from '@material-ui/core/Paper';

//firebase.initializeApp(firebaseConfig);

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

console.log("WhaleFollower.js başlangıç");
let lastBlock = 1;
let Holders = [];
let Hashs = [];
let Contracts = [];
let key = 0;
export default function WhaleFollower() {
  const classes = useStyles();

  const [BnbPrice, setBnbPrice] = useState(0);
  const [WhaleAddress, setWhaleAddress] = useState('');
  const [WhaleBalance, setWhaleBalance] = useState(0);
  const [Tokens, setTokens] = useState({});

  useEffect(() => {
    console.log("intBnb kuruldu");
    let intBnb = setInterval(() => {
      getBnbPrice();
    }, 30000)

    return () => {
      clearInterval(intBnb);
      console.log("intBnb kaldırıldı");
    }
  }, []);

  useEffect(() => {
    console.log("intBalance kuruldu");
    let intBalance = setInterval(() => {
      getBalance();
    }, 60000)

    return () => {
      clearInterval(intBalance);
      console.log("intBalance kaldırıldı");
    }
  }, [WhaleAddress]);

  useEffect(() => {
    if (WhaleBalance > 0 && WhaleAddress !== '') getHolders();

    return () => Holders = [];
  }, [WhaleBalance]);

  useEffect(() => {
    console.log("intHolder kuruldu");
    let intHolder = setInterval(() => {
      if (Holders.length > 0) getPancakeTransfer();
    }, 300)

    return () => {
      clearInterval(intHolder);
      console.log("intHolder kaldırıldı");
    }
  }, []);

  useEffect(() => {
    console.log("intHash kuruldu");
    let intHash = setInterval(() => {
      if (Hashs.length > 0) getContracts();
    }, 300)

    return () => {
      clearInterval(intHash);
      console.log("intHash kaldırıldı");
    }
  }, []);

  useEffect(() => {
    console.log("intToken kuruldu");
    let intToken = setInterval(() => {
      if (Contracts.length > 0) getTokenName();
    }, 300)

    return () => {
      clearInterval(intToken);
      console.log("intToken kaldırıldı");
    }
  }, []);

  const getBnbPrice = () => {
    const url = 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT';
    fetch(url)
      .then(res => res.json())
      .then(
        (res) => {
          try {
            if (typeof res === "object" && res.price > 0) {
              setBnbPrice(res.price);
            }
          } catch (err) {
            console.log('There was an error : ' + err);
            setBnbPrice(0);
          }
        },
        (err) => {
          console.log('There was an error : ' + err);
          setBnbPrice(0);
        })
      .catch(err => {
        console.log('There was an error : ' + err);
        setBnbPrice(0);
      });
  }

  const getBalance = () => {
    const url = 'https://api.bscscan.com/api?module=account&action=balance&address=' + WhaleAddress + '&tag=latest&apikey=' + BSC_API_KEY;
    fetch(url)
      .then(res => res.json())
      .then(
        (res) => {
          try {
            if (typeof res === "object" && res.result > 0 && res.message === "OK") {
              let newbalance = res.result / 10 ** 18;
              setWhaleBalance(newbalance);
            }
          } catch (err) {
            console.log('There was an error : ' + err);
            setWhaleBalance(0);
          }
        },
        (err) => {
          console.log('There was an error : ' + err);
          setWhaleBalance(0);
        })
      .catch(err => {
        console.log('There was an error : ' + err);
        setWhaleBalance(0);
      });
  }

  const getHolders = () => {
    const url = 'https://api.bscscan.com/api?module=account&action=txlist&address=' + WhaleAddress + '&startblock=' + lastBlock + '&endblock=99999999&page=1&offset=50&sort=desc&apikey=' + BSC_API_KEY;
    fetch(url)
      .then(res => res.json())
      .then(
        (res) => {
          if (typeof res === 'object' && res !== null && res.message === "OK" && Holders.length === 0) {
            const now = Math.round(Date.now() / 1000);
            res.result.forEach(trn => {
              if (trn.from.toLowerCase() === WhaleAddress.toLowerCase() && trn.txreceipt_status === "1" && trn.isError === "0" && trn.input === "0x" && trn.timeStamp <= now - 600) {
                let holder = {};
                holder["address"] = trn.to;
                holder["blocknumber"] = trn.blockNumber;
                if (Holders.findIndex(i => i.address === trn.to) < 0) Holders.push(holder);
                lastBlock = (trn.blockNumber > lastBlock) ? trn.blockNumber : lastBlock;
              }
            });
          }
        },
        (err) => {
          console.log('There was an error : ' + err);
        })
      .catch(err => {
        console.log('There was an error : ' + err);
      });
  }

  const getPancakeTransfer = () => {
    //console.log("Holders Count: "+Holders.length);
    let holder = Holders[Holders.length - 1];
    const url = 'https://api.bscscan.com/api?module=account&action=txlist&address=' + holder["address"] + '&startblock=' + holder["blocknumber"] + '&endblock=99999999&page=1&offset=25&sort=desc&apikey=' + BSC_API_KEY;
    fetch(url)
      .then(res => res.json())
      .then(
        (res) => {
          if (typeof res === 'object' && res !== null && res.message === "OK") {
            res.result.forEach(trn => {
              let hash = {};
              hash["hash"] = '';
              hash["value"] = '';
              hash["holderaddress"] = '';
              hash["blocknumber"] = holder["blocknumber"];
              if (trn.from.toLowerCase() === holder["address"].toLowerCase() && trn.to.toLowerCase() === PancakeAddress.toLowerCase() && trn.txreceipt_status === "1" && trn.isError === "0" && trn.input !== "0x" && trn.value !== "0" && hash["hash"] === '') {
                hash["hash"] = trn.hash;
                hash["value"] = trn.value;
                hash["holderaddress"] = holder["address"];
                hash["blocknumber"] = holder["blocknumber"];
                Hashs.push(hash);
              }
            });
          }
        },
        (err) => {
          console.log('There was an error : ' + err);
        })
      .catch(err => {
        console.log('There was an error : ' + err);
      });

    Holders.pop();

  }

  const getContracts = () => {
    //console.log("Hash Count: "+Hashs.length);
    let hash = Hashs[Hashs.length - 1];
    const url = 'https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=' + hash["hash"] + '&apikey=' + BSC_API_KEY;
    fetch(url)
      .then(res => res.json())
      .then(
        (res) => {
          if (typeof res === 'object' && res !== null) {
            if (Array.isArray(res.result.logs)) {
              if(res.result.logs.length > 2){
                let contract = {};
                contract["address"] = res.result.logs[2].address;
                contract["value"] = hash["value"];
                contract["holderaddress"] = hash["holderaddress"];
                contract["blocknumber"] = hash["blocknumber"];
                Contracts.push(contract);
              }
            }
          }
        },
        (err) => {
          console.log('There was an error : ' + err);
        })
      .catch(err => {
        console.log('There was an error : ' + err);
      });

    Hashs.pop();
  }

  const getTokenName = () => {
    //console.log("Contracts Count: "+Contracts.length);
    let contract = Contracts[Contracts.length - 1];
    const url = 'https://api.pancakeswap.info/api/v2/tokens/'+contract["address"];
    fetch(url)
      .then(res => res.json())
      .then(
        (res) => {
          if (typeof res === 'object' && res !== null) {
            if(typeof res.data != "undefined"){
              const name = (res.data.name !== 'unknown') ? res.data.name : 'unknown('+contract["address"]+')';
              const valuebnb = contract["value"] / 10 ** 18;
              const valuedollar = Math.round(valuebnb * BnbPrice * 100) / 100;
              console.log(contract["blocknumber"] + " - " + contract["holderaddress"] + " - " + name + " - " + valuebnb + "(BNB)");
              const now = new Date();
              const value = { name: name, value: valuebnb, time: now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()};
              setTokens(Tokens => ({
                ...Tokens,
                [key]: value
              }));
              key++;
            }
          }
        },
        (err) => {
          console.log('There was an error : ' + err);
        })
      .catch(err => {
        console.log('There was an error : ' + err);
      });

    Contracts.pop();
  }

  return (

    <React.Fragment>
      <Container maxWidth={false}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container spacing={1}>

            <Grid item xs={12} sm={6}>
              <TextField id="whale-address" label="Whale Address" variant="outlined" placeholder="0x" fullWidth value={WhaleAddress} onChange={(e) => setWhaleAddress(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="whale-balance" label="Balance(BNB)" variant="outlined" fullWidth disabled value={Math.round(WhaleBalance * 100) / 100} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField id="whale-balance-dollar" label="Balance($)" variant="outlined" fullWidth disabled value={Math.round(WhaleBalance * BnbPrice * 100) / 100} />
            </Grid>

          </Grid>
        </form>
      </Container>
      <Container maxWidth={false}>
        <Paper style={{visibility:'hidden'}}>LastBlock = {lastBlock}</Paper>
      </Container>
      <Container maxWidth={false}>
        <List component="nav" className={classes.root} aria-label="token transactions">
          {

            Object.keys(Tokens).reverse().map(key =>
              <ListItem key={key}>
                <ListItemText primary={Tokens[key].time+" - "+Tokens[key].name + " - " + Tokens[key].value + "(BNB)"} />
              </ListItem>
            )
          }
        </List>
      </Container>
    </React.Fragment>
  );
}
