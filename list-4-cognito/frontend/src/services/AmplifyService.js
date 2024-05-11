import { signOut } from 'aws-amplify/auth';

const POOL_CLIENT_ID = process.env.REACT_APP_POOL_CLIENT_ID || '55qngui1q738gnllv72scu0nla';
const POOL_ID = process.env.REACT_APP_POOL_ID || 'us-east-1_I7yOuIPRv';

export const awsConfig = {
    Auth: {
        Cognito: {
            userPoolClientId: POOL_CLIENT_ID,
            userPoolId: POOL_ID,
        }
    }
};

export const handleSignOut = async () => {
    try {
        await signOut();
    } catch (error) {
        console.error('Error signing out: ', error);
    }
};
