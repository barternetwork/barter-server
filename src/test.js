let graphql = require('./graphql');
graphql.query(graphql.QuickSwap,true,100).then(res=> {
    console.log(res)
}).catch(e=>{console.log(e)});
//Write access to repository not granted.
