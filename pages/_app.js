import '../styles/globals.css'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink
} from "@apollo/client"

const createApolloCliennt = ()  =>  {
  const link = new HttpLink({
    uri: 'https://marvel-app-graphql-layer.herokuapp.com/'
  })

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}



function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={createApolloCliennt()}>
      <Component {...pageProps} />
    </ApolloProvider>
  ) 
}

export default MyApp
