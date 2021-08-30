import { Container, Paper,TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

console.log("Test.js başlangıç");
export default function Test(props) {
    console.log("function başlangıç");

    const [adres,setadres] = useState("true");

    //useEffect( () => console.log("mount"), [] );
    /*useEffect( () => {
        console.log("will update adres")
        return () => console.log("unmount adres");
    }, [ adres ]);*/
    //useEffect( () => console.log("will update any") );
    //useEffect( () => () => console.log("will update adres or unmount"), [ adres ] );
    //useEffect( () => () => console.log("unmount"), [] );

    return(
        <TextField id="contract-creator" label="Contract Creator" variant="outlined" placeholder="0x" fullWidth value={adres} onChange={(e) => setadres(e.target.value)} />
    );
}