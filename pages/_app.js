import '../styles/globals.css'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink
} from "@apollo/client"

const createApolloCliennt = ()  =>  {
  const link = new HttpLink({
    uri: 'http://localhost:3000/api/graphql'
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
