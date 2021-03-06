import { gql, GraphQLClient } from 'graphql-request'
import Link from 'next/link'
import Image from 'next/image'
import Section from '../components/Section'
import NavBar from '../components/NavBar'
import disneyLogo from '../public/disney-button.png'
import marvelLogo from '../public/marvel-button.png'
import natgeoLogo from '../public/natgeo-button.png'
import pixarLogo from '../public/pixar.png'

export const getStaticProps = async() => {
  const url = process.env.ENDPOINT
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization": process.env.GRAPH_CMS_TOKEN
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
          <div className="link-wrap">
            <Link href="#pixar"><div className="franchise">
              <Image src={pixarLogo} />
            </div></Link>
            <Link href="#marvel"><div className="franchise" id="marvel">
              <Image src={marvelLogo} />
            </div></Link>
            <Link href="#national-geographic"><div className="franchise" id="national-geographic">
              <Image src={natgeoLogo} />
            </div></Link>
            <Link href="#disney"><div className="franchise" id="disney">
              <Image src={disneyLogo} />
            </div></Link>
          </div>
          <Section genre={'Recommeded for you'} videos={unSeenVideos(videos)} />
          <Section genre={'Family'} videos={filterVideos(videos, 'family')} />
          <Section genre={'Thriller'} videos={filterVideos(videos, 'thriller')} />
          <Section genre={'Classic'} videos={filterVideos(videos, 'classic')} />
          <Section genre={'Romence'} videos={filterVideos(videos, 'romence')} />
          <Section id="pixar" genre={'Pixar'} videos={filterVideos(videos, 'pixar')} />
          <Section id="marvel" genre={'Marvel'} videos={filterVideos(videos, 'marvel')} />
          <Section id="national-geographic" genre={'National Geographic'} videos={filterVideos(videos, 'national-geographic')} />
          <Section id="disney" genre={'Disney'} videos={filterVideos(videos, 'disney')} />
        </div>
      </div>



    </>
  )
}
export default Home