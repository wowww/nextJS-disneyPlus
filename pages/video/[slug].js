import { gql, GraphQLClient } from 'graphql-request'
import { useState } from 'react'

export const getServerSideProps = async (pageContext) => {
  const url = process.env.ENDPOINT
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization": process.env.GRAPH_CMS_TOKE
    }
  })

  const pageSlug = pageContext.query.slug;
  
  const query = gql`
    query($pageSlug: String!) {
      video(where: {
        slug: $pageSlug
      }) {
        createdAt,
        id,
        title,
        description,
        seen,
        slug,
        tags,
        thumbnail {
          url
        },
        mp4 {
          url
        }
      }
    }
  `
  
  const variables = {
    pageSlug,
  }
  
  const data = await graphQLClient.request(query, variables)
  const video = data.video

  return {
    props: {
      video
    }
  }
}

const video = ({ video }) => {
  const [ watching, setWatching ] = useState(false)
  return (
    <>
      { !watching &&
        <img 
          className="video-image"
          src={video.thumbnail.url}
          alt={video.title}
        />
      }
      { !watching &&
        <div className="info">
          <p>{video.tags.join(', ')}</p>
          <p>{video.description}</p>
          <a href="/">
            <span>
              go back
            </span>
          </a>
          <button 
            className="video-overlay"
            onClick={() => {
              watching ? setWatching(false) : setWatching(true)
            }} 
          >PLAY</button>
        </div>
      }
      { watching && (
        <video width="100%" controls>
          <source 
            src={video.mp4.url} 
            type="video/mp4/" 
          />

        </video>
      )}
    </>
  )
}

export default video