import React from 'react';
import MiniScammer from './MiniScammer';
import WhaleFollower from './WhaleFollower';
import Test from './Test'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link} from 'react-router-dom';

console.log("App.js başlangıç");    
export default function Start() {
    return(
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/mini-scammer">Mini Scammer</Link>
                    </li>
                    <li>
                        <Link to="/whale-follower">Whale Follower</Link>
                    </li>                  
                    <li>
                        <Link to="/test">Test</Link>
                    </li>                    
                </ul>
                <hr />
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/mini-scammer">
                        <MiniScammer />
                    </Route>
                    <Route path="/whale-follower">
                        <WhaleFollower />
                    </Route>                   
                    <Route path="/test">
                        <Test />
                    </Route>                    
                </Switch>                
            </div>
        </Router>
    );
}

function Home() {
    return (
      <div>
        <h2></h2>
      </div>
    );
  }