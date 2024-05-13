import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";

import "./App.css";
import Game from "./components/Game";
import { awsConfig, handleSignOut } from "./services/AmplifyService";
import { helloWorldCall } from "./services/GameService";
import { signUpFormConfig } from "./services/AmplifyService";

Amplify.configure(awsConfig);

const App = () => {
  const [debugMessage, setDebugMessage] = useState("");

  const appendDebugMessage = async () => setDebugMessage(`${debugMessage} ${await helloWorldCall()}`);

  return (
    <div className="App">
      <main>
        <Game/>
        
        <button onClick={appendDebugMessage}>Hello world connection test</button>
        <button onClick={handleSignOut}>Sign Out</button>

        <div>{debugMessage}</div>
      </main>
    </div>
  );
}

export default withAuthenticator(App, { formFields: signUpFormConfig });
