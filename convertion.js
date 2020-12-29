function getFullCurrencyCrypto($code){
    $cur = "Unknown";
    switch ($code){
        case "BTC":
            $cur = "Bitcoin";
            break;
        case "LTC":
            $cur = "Litecoin";
            break;
        case "ETH":
            $cur = "Ethereum";
        default:
            break;
    }
}

getFullCurrencyCrypto(code){
    const cur = "Unknown";
    switch (code){
        case "BTC":
            const cur = "Bitcoin";
            break;
        case "LTC":
            const cur = "Litecoin";
            break;
        case "ETH":
            const cur = "Ethereum";
        default:
            break;
    }
    return cur;
}

function getTransactionType($code){
    $cur = "Unknown";
    switch ($code){
        case 1:
            $cur = "BUY";
            break;
        case 2:
            $cur = "SELL";
        default:
            break;
    }
}

getTransactionType(code) {
    const cur = "Unknown";
    switch (code){
        case 1:
            return "BUY";
            break;
        case 2:
            return = "SELL";
        default:
            break;
    }
    return cur;
}

function getStatus($stat){
    $cur = "STATUS_UNKNOWN";
    switch ($stat){
        case 1:
            $cur = "COMPLETE";
            break;
        case 2:
            $cur = "ERROR";
            break;
        case  3:
            $cur = "CANCELLED";
            break;
        case  4:
            $cur = "FROZEN";
            break;
        case  5:
            $cur = "SEIZED";
            break;
        case  6:
            $cur = "BLACKLISTED";
            break;
        case 7:
            $cur = "AUTOFROZEN";
        default:
            break;
    }
    return $cur;
}

getStatus(stat){
    const cur = "STATUS_UNKNOWN";
    switch ($stat){
        case 1:
            return "COMPLETE";
        case 2:
            return "ERROR";
        case  3:
            return "CANCELLED";
        case  4:
            return "FROZEN";
        case  5:
            return "SEIZED";
        case  6:
            return "BLACKLISTED";
        case 7:
            return "AUTOFROZEN";
        default:
            break;
    }
    return cur;
}

function getBlockChainStatus($code){
    if($code > 0){
        $cur = "COMPLETED";
    } else{
        $cur = "PROCESSING";
    }
    return $cur;
}

getBlockChainStatus(code){
    if(code > 0){
        return "COMPLETED";
    } else{
        return "PROCESSING";
    }
    return cur;
}

function getCurrencyCrypto($code){
    $cur = "Unknown";
    switch ($code){
        case 1:
            $cur = "BTC";
            break;
        case 2:
            $cur = "LTC";
            break;
        case 3:
            $cur = "ETH";
        default:
            break;
    }
    return $cur;
}

getCurrencyCrypto(code){
    const cur = "Unknown";
    switch (code){
        case 1:
            return "BTC";
        case 2:
            return "LTC";
        case 3:
            return "ETH";
        default:
            break;
    }
    return cur;
}


function getAmount($coin){
    return $coin/100;//amount is now in USD not BTC 100000000;
}

getAmount(coin){
    return coin/100;//amount is now in USD not BTC 100000000;
}

function getCurrency($code){
    $cur = "FIAT_UNKNOWN";
    switch ($code){
        case 1:
            $cur = "$";
            break;
        case 2:
            $cur = "¥";
            break;
        case 3:
            $cur = "£";
            break;
        case 4:
            $cur = "A$";
            break;
        case 5:
            $cur = "C$";
            break;
        case 6:
            $cur = "Лв";
        default:
            break;
    }

    return $cur;
}

getCurrency(code){
    const cur = "FIAT_UNKNOWN";
    switch (code){
        case 1:
            return "$";
        case 2:
            return "¥";
        case 3:
            return "£";
        case 4:
            return "A$";
        case 5:
            return "C$";
        case 6:
            return "Лв";
        default:
            break;
    }
    return cur;
}