import { Client, Databases, ID, Query } from "appwrite";


const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;


const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);


export const updatesearchcount = async (searchterm, movie) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('searchterm', searchterm)]
    );

    if (result.total > 0) {
      const doc = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id,
        {
          count: doc.count + 1,
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchterm,
          count: 1,
          movie_id: movie.id,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : 'noposter.png',
        }
      );
    }
  } catch (error) {
    console.error("Appwrite error:", error);
  }
};
export const trendingmovies = async() =>
{
    try { const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
        Query.limit(5),
        Query.orderDesc("count"),
    ]); return result.documents;

    } catch(err)
    {
        console.error(err);
    }
}