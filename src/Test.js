import { Button, ButtonBase, Container, Paper, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './Config';
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);
const tokenRef = ref(db,'tokens/0x1111111111111111111111111111111111111113');
const holderRef = ref(db,'holders/0x1111111111111111111111111111111111111111');

console.log("Test.js başlangıç");
export default function Test(props) {
    const [test, settest] = useState(0);

    //onetime get and set
    /*useEffect(() => {
        get(child(dbRef,'holders')).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

        return () => {
            console.log('set çalıştı');
            set(holderRef, {
                balance: 120,
                lastblocknumber: 50
              }).catch(error => {
                  console.error(error);
              });
        }
    }, [test]);*/

    //socket connection obsorver
    /*onValue(tokenRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
    });*/

    /*
    useEffect( () => console.log("mount"), [] );
    useEffect( () => {
        console.log("will update adres")
        return () => console.log("unmount adres");
    }, [ adres ]);
    useEffect( () => console.log("will update any") );
    useEffect( () => () => console.log("will update adres or unmount"), [ adres ] );
    useEffect( () => () => console.log("unmount"), [] );
    */

    return (
        <TextField id="test" label="Test" variant="outlined" placeholder="0x" fullWidth value={test} onChange={(e) => settest(e.target.value)} />
        
    );
}