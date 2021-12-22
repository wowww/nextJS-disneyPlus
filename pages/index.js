import { gql, GraphQLClient } from 'graphql-request'
// import gql from 'graphql-tag'

export const getStaticProps = async() => {
  const url = "ContentAPI";
  const graphQLClient = new GraphQLClient(url, {
    headers: {
      "Authorization": "Bearer TokenValue"
    }
  })

  const query = gql`
    query {
      videos {
        createdAt,
        id,
        title,
        description,
        seen,
        slug,
        tags
      }
    }
  `

  const data = await graphQLClient.request(query)
  const videos = data.videos

  return {
    props: {
      videos,
    }
  }
}


const Home = ({ videos }) => {
  console.log(videos)
  return (
    <div>
    </div>
  )
}
export default Home