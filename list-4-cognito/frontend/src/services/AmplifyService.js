import { signOut } from 'aws-amplify/auth';

const POOL_CLIENT_ID = process.env.REACT_APP_POOL_CLIENT_ID || '2semrvdld5h3ogmrev6f0dmgnc';
const POOL_ID = process.env.REACT_APP_POOL_ID || 'us-east-1_xYvv1ykCs';

export const awsConfig = {
    Auth: {
        Cognito: {
            userPoolClientId: POOL_CLIENT_ID,
            userPoolId: POOL_ID,
        }
    }
};

export const signUpFormConfig = {
    signUp: [
        {
            label: "Name",
            placeholder: "Enter your full name",
            name: "name",
            required: true,
            displayOrder: 1,
            type: "string",
        },
    ]
};


export const handleSignOut = async () => {
    await signOut()
        .catch((error) => console.error("Error signing out: ", error));
};
