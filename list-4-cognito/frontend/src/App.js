import React from 'react';
import './App.css';
import Game from './components/Game';
import { get } from './services/GameService'


import { signOut } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: '55qngui1q738gnllv72scu0nla',
      userPoolId: 'us-east-1_I7yOuIPRv',
    }
  }
});


const App = () => {

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="App">
      <main>
        <Game />
        <button onClick={async () => console.log(await get("HelloWorld"))}>Hello world test</button>
        <button onClick={handleSignOut}>Sign Out</button>
      </main>
    </div>
  );
}

export default withAuthenticator(App);
