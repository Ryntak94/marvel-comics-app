import dynamic from 'next/dynamic'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react'
import _ from 'lodash'

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
        }

      })
    }
  })
  return { nodes: _.uniqBy(nodes, "id"), links: _.uniqBy(links, "id")}
}

export default function Home() {

  const [graphData, setGraphData] = useState({nodes: [], links: []})

  const {data} = useQuery(query, {
    onCompleted: (data) =>  setGraphData(formatData(data))
  })

  return <NoSSRForceGraph 
          graphData={graphData}
          nodeLabel={'title'}
          nodeAutoColorBy={'__typename'}
        />
}
