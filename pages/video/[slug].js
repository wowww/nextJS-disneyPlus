import { gql, GraphQLClient } from 'graphql-request'

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
  console.log(video)
  return (
    <div>

    </div>
  )
}

export default video