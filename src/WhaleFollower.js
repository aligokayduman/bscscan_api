import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme  } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container';
import ListItemText from '@material-ui/core/ListItemText';
import { BSC_API_KEY, PancakeAddress } from './Config';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) =>({
  root: theme.root,
  link: theme.link,  
  paper: theme.paper
}));

console.log("WhaleFollower.js başlangıç");
let lastBlock = 1;
let Holders = [];
let Hashs = [];
let Contracts = [];
let HolderPool = [];
let TokenPool = [];
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
      if (Hashs.length > 0 && Holders.length === 0) getContracts();
    }, 300)

    return () => {
      clearInterval(intHash);
      console.log("intHash kaldırıldı");
    }
  }, []);

  useEffect(() => {
    console.log("intToken kuruldu");
    let intToken = setInterval(() => {
      if (Contracts.length > 0 && Holders.length === 0 && Hashs.length === 0) getTokenName();
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
                if (HolderPool.findIndex(i => i === trn.to) < 0) HolderPool.push(trn.to);
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
    let holder = Holders[0];
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
              hash["time"] = '';
              if (trn.from.toLowerCase() === holder["address"].toLowerCase() && trn.to.toLowerCase() === PancakeAddress.toLowerCase() && trn.txreceipt_status === "1" && trn.isError === "0" && trn.input !== "0x" && trn.value !== "0" && hash["hash"] === '') {
                hash["hash"] = trn.hash;
                hash["value"] = trn.value;
                hash["holderaddress"] = holder["address"];
                hash["blocknumber"] = holder["blocknumber"];
                let time = new Date(parseInt(trn.timeStamp)*100);
                time = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
                hash["time"] = time;
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

    Holders.shift();

  }

  const getContracts = () => {
    //console.log("Hash Count: "+Hashs.length);
    let hash = Hashs[0];
    const url = 'https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=' + hash["hash"] + '&apikey=' + BSC_API_KEY;
    fetch(url)
      .then(res => res.json())
      .then(
        (res) => {
          if (typeof res === 'object' && res !== null) {
            if (Array.isArray(res.result.logs)) {
              if (res.result.logs.length > 2) {
                let contract = {};
                contract["address"] = res.result.logs[2].address;
                contract["value"] = hash["value"];
                contract["holderaddress"] = hash["holderaddress"];
                contract["blocknumber"] = hash["blocknumber"];
                contract["time"] = hash["time"];
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

    Hashs.shift();
  }

  const getTokenName = () => {
    //console.log("Contracts Count: "+Contracts.length);
    let contract = Contracts[0];
    const url = 'https://api.pancakeswap.info/api/v2/tokens/' + contract["address"];
    fetch(url)
      .then(res => res.json())
      .then(
        (res) => {
          if (typeof res === 'object' && res !== null) {
            if (typeof res.data != "undefined") {
              const name = (res.data.name !== 'unknown') ? res.data.name : 'unknown(' + contract["address"] + ')';
              let valuebnb = contract["value"] / 10 ** 18;
              valuebnb = Math.round(valuebnb * 100) / 100;
              let index = HolderPool.findIndex(i => i === contract["holderaddress"]);
              const order = ( index < 0) ? '?.Holder' : index + '. Holder';

              console.log('BlockNumber=' + contract["blocknumber"] + " | HolderAddress=" + contract["holderaddress"] +" Order="+index+" | Time=" + contract["time"] + " | TokenName=" + name + " | Value=" + valuebnb + " (BNB)");
              const token = { name: name, value: valuebnb, time: contract["time"], address: contract["address"], holder: order };

              index = TokenPool.findIndex(i => i.address === contract["address"]); 
              if (index > -1) {
                const currenttoken = { name: name, total: TokenPool[index].total + valuebnb, address: contract["address"] }
                TokenPool[index] = currenttoken;
              } else {
                const newtoken = { name: name, total: valuebnb, address: contract["address"] }
                TokenPool.push(newtoken);
              }
              TokenPool.sort(compare);

              setTokens(Tokens => ({
                ...Tokens,
                [key]: token
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

    Contracts.shift();
  }

  function compare(a, b) {
    if (a.total < b.total) {
      return -1;
    }
    if (a.total > b.total) {
      return 1;
    }
    return 0;
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
        <Paper style={{ visibility: 'hidden' }}>LastBlock = {lastBlock}</Paper>
      </Container>
      <Container maxWidth={false}>
        <Grid container className={classes.root}>

          <Grid item xs={12} md={6} lg={6}>
            <Grid container>
              <List component="nav" className={classes.root} aria-label="token transactions">
                <ListItemText>--- History ---</ListItemText>
                {
                  Object.keys(Tokens).reverse().map(key =>
                    <ListItem key={key}>
                      <ListItemText><a href={'https://poocoin.app/tokens/' + Tokens[key].address} target="_blank" className={classes.link}>{Tokens[key].time + " - " + Tokens[key].holder + " - " + Tokens[key].name + " - " + Tokens[key].value + " (BNB)"}</a></ListItemText>
                    </ListItem>
                  )
                }
              </List>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Grid container>
              <List component="nav" className={classes.root} aria-label="token transactions">
                <ListItemText>--- Totals ---</ListItemText>
                {
                  Object.keys(TokenPool).reverse().map(key =>
                    <ListItem key={key}>
                      <ListItemText><a href={'https://poocoin.app/tokens/' + TokenPool[key].address} target="_blank" className={classes.link}>{TokenPool[key].name + " - " + TokenPool[key].total + " (BNB)"}</a></ListItemText>
                    </ListItem>
                  )
                }
              </List>
            </Grid>
          </Grid>

        </Grid>
      </Container>
    </React.Fragment>
  );
}
