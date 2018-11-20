onProcessingTxStatus = () => {
    Bert.alert( 'Processing, please wait...', 'info', 'growl-top-right' );
}

onPendingTxStatus = () => {
    Bert.alert( "Transaction pending, please confirm it in MetaMask.", "success", "growl-top-right" );    
}

onMiningTxStatus = () => {

    Bert.alert( 'Waiting for transaction to be mined...', 'info', 'growl-top-right' );
}

onCompleteTxStatus = () => {
    Bert.alert( 'Transaction was successfully processed.', 'success', 'growl-top-right' );
}

onErrorTxStatus = (_errMsg) => {
    Bert.alert( "Transaction rejected or failed", 'danger', 'growl-top-right' );
}

updateTxHash = (_hash) => {
    Bert.alert( 'Transaction Submitted ', 'info', 'growl-top-right' );
}


processTx = (tx, cb=null,customMsg=null) => {
    if(!customMsg){
    Bert.alert( "Transaction pending, please confirm it in MetaMask.", "success", "growl-top-right" );
    }
    else
    {
        Bert.alert(customMsg, "success", "growl-top-right" );
    }
    tx.send({
            from: web3.eth.defaultAccount
        })
        .on('transactionHash', hash => {
            onMiningTxStatus();
            updateTxHash(hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
            if (confirmationNumber == 0) {
                onCompleteTxStatus();
                if(cb)
                    cb(null, receipt);
            }
        })
        .on('error', error => {
            onErrorTxStatus(error.message);
            if(cb)
                cb(error, null);
        });
}
