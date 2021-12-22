import { gql, GraphQLClient } from 'graphql-request'
import Section from '../components/Section'
import NavBar from '../components/NavBar'

export const getStaticProps = async() => {
  const url = process.env.ENDPOINT
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization": process.env.GRAPH_CMS_TOKE
    }
  })

  const videosQuery = gql`
    query {
      videos {
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

  const accountsQuery = gql`
    query {
      account(where: {id: "ckxgrfsbkhgh40b54i15kpd1e"}){
        username
        avatar {
          url
        }
      } 
    }
  `

  const data = await graphQLClient.request(videosQuery)
  const videos = data.videos
  const accountData = await graphQLClient.request(accountsQuery)
  const account = accountData.account

  return {
    props: {
      videos,
      account
    }
  }
}

const Home = ({ videos, account }) => {


  const randomVideo = (videos) => {
    return videos[Math.floor(Math.random() * videos.length)]
  }

  const filterVideos = (videos, genre) => {
    return videos.filter((video) => video.tags.includes(genre))
  }

  const unSeenVideos = (videos) => {
    return videos.filter((video) => video.seen === false | video.seen === null)
  }

  return (
    <>
      <NavBar account={account}/>
      <div className="app">
        <div className="main-video">
          <img 
            src={randomVideo(videos).thumbnail.url} 
            alt={randomVideo(videos).title}
          />
        </div>
        <div className="video-feed">
          <Section genre={'Recommeded for you'} videos={unSeenVideos(videos)} />
          <Section genre={'Family'} videos={filterVideos(videos, 'family')} />
          <Section genre={'Thriller'} videos={filterVideos(videos, 'thriller')} />
          <Section genre={'Classic'} videos={filterVideos(videos, 'classic')} />
          <Section genre={'Pixar'} videos={filterVideos(videos, 'pixar')} />
          <Section genre={'Marvel'} videos={filterVideos(videos, 'marvel')} />
          <Section genre={'National Geographic'} videos={filterVideos(videos, 'national-geographic')} />
          <Section genre={'Disney'} videos={filterVideos(videos, 'disney')} />
          <Section genre={'Romence'} videos={filterVideos(videos, 'romence')} />
        </div>
      </div>



    </>
  )
}
export default Home