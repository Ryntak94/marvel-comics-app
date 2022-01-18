import dynamic from 'next/dynamic'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import SpriteText from 'three-spritetext';
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  max-width: 100%;
`

const query = gql`
{
  comics(options: {limit: 1000}) {
    title
    marvelId
    __typename
    next_issue {
      title
      marvelId
      __typename
    }
    creators(where: {role_CONTAINS: "writer"}) {
      title
      role
      marvelId
      __typename
    }
    series {
      marvelId
      title
      __typename
      comics {
        title
        marvelId
        __typename
        next_issue {
          title
          marvelId
          __typename
          creators(where: {role_CONTAINS: "writer"})  {
            title
            role
            marvelId
            __typename
          }
        }
      }
    }
  }
}
`

const newQuery = gql`
  query newComics($limit: Int, $comicTitle: String) {
    comics(options: {limit: $limit}, where: {title_CONTAINS: $comicTitle}) {
      title
      marvelId
      __typename
      next_issue {
        title
        marvelId
        __typename
      }
      creators(where: {role_CONTAINS: "writer"}) {
        title
        role
        marvelId
        __typename
      }
      series {
        marvelId
        title
        __typename
        comics {
          title
          marvelId
          __typename
          next_issue {
            title
            marvelId
            __typename
            creators(where: {role_CONTAINS: "writer"})  {
              title
              role
              marvelId
              __typename
            }
          }
        }
      }
    }
  }
`

const NoSSRForceGraph = dynamic(  ()  => import('../lib/NoSSRForceGraph'), { ssr: false })



const formatData = (data) =>  {
  const nodes = []
  const links = []
  console.log(data)
  if(!data.comics)  {
    return { nodes, links }
  }

  data.comics.forEach( (c)  =>  {

    nodes.push({
      id: c.marvelId,
      title: c.title,
      __typename: c.__typename
    })

    if(c.next_issue)  {
      nodes.push({
        id: c.next_issue.marvelId,
        title: c.next_issue.title,
        __typename: c.next_issue.__typename
      })

      links.push({
        source: c.marvelId,
        target: c.next_issue.marvelId,
        label: 'NEXT_ISSUE',
        id: `${c.marvelId}${c.next_issue.marvelId}NEXT_ISSUE`
      })
    }

    if(c.creators.length > 0) {
      nodes.push({
        id: c.creators[0].marvelId,
        name: c.creators[0].title,
        title: `${c.creators[0].title} (${c.creators[0].role})`,
        __typename: c.creators[0].__typename
      })

      links.push({
        source: c.marvelId,
        target: c.creators[0].marvelId,
        label: 'CREATED_BY',
        id: `${c.marvelId}${c.creators[0].marvelId}CREATED_BY`
      })
    }

    if(c.series)  {
      nodes.push({
        id: c.series.marvelId,
        title: c.series.title,
        __typename: c.series.__typename
      })

      links.push({
        source: c.marvelId,
        target: c.series.marvelId,
        label: 'PART_OF_SERIES',
        id: `${c.marvelId}${c.series.marvelId}PART_OF_SERIES`
      })

      c.series.comics.forEach(comic =>  {

        nodes.push({
          id: comic.marvelId,
          title: comic.title,
          __typename: comic.__typename
        })

        links.push({
          source: comic.marvelId,
          target: c.series.marvelId
        })

        if (comic.next_issue) {
          nodes.push({
            id: comic.next_issue.marvelId,
            title: comic.next_issue.title,
            __typename: comic.next_issue.__typename
          })

          links.push({
            source: comic.marvelId,
            target: comic.next_issue.marvelId,
            label: 'NEXT_ISSUE',
            id: `${comic.marvelId}${comic.next_issue.marvelId}NEXT_ISSUE`
          })

          if(comic.next_issue.creators.length > 0)  {
            nodes.push({
              id: comic.next_issue.creators[0].marvelId,
              name: comic.next_issue.creators[0].title,
              title: `${comic.next_issue.creators[0].title} (${comic.next_issue.creators[0].role})`,
              role: comic.next_issue.creators[0].role,
              __typename: comic.next_issue.creators[0].__typename
            })

            links.push({
              source: comic.next_issue.marvelId,
              target: comic.next_issue.creators[0].marvelId,
              label: 'CREATED_BY',
              id: `${comic.next_issue.marvelId}${comic.next_issue.creators[0].marvelId}CREATED_BY`
            })
          }
        }

      })
    }
  })
  return { nodes: _.uniqBy(nodes, "id"), links: _.uniqBy(links, "id")}
}

export default function Home() {

  const [graphData, setGraphData] = useState({nodes: [], links: []})
  const [width, setWidth] = useState(null)
  const {data} = useQuery(query, {
    onCompleted: (data) =>  setGraphData(formatData(data))
  })
  const [comicTitle, setComicTitle] = useState("")
  const [limit, setComicLimit] = useState(100)

  const [newComics, {called, loading, data: newData}]  = useLazyQuery(
    newQuery,
    {
      onCompleted: (data) =>  {
        const newSubgraph = formatData(data)
        console.log("here2")
        setGraphData({
          nodes: _.uniqBy([...newSubgraph.nodes], "id"),
          links: _.uniqBy([...newSubgraph.links], "id")
        })
      }
    }
  )

  useEffect(()  =>  {
    setWidth(window.innerWidth*.9)
  }, [])

  return (
    <>
      <Container>
        <NoSSRForceGraph 
                graphData={graphData}
                width={width}
                backgroundColor={'#080808'}
                nodeLabel={'title'}
                nodeAutoColorBy={'__typename'}
                nodeVal={(node)=> {
                  if(node.__typename === "Creator") {
                    return 40
                  }
                  if(node.__typename === "Series")  {
                    return 20
                  } else  {
                    return 5
                  }
                }}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                linkThreeObjectExtend={true}

              />
              <Sidebar newComics={newComics} comicTitle={comicTitle} limit={limit} setComicTitle={setComicTitle} setComicLimit={setComicLimit} />
            </Container>
  </>
  )
  
}
